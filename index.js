var http = require('http'),
    auth = require('basic-auth'),
    request = require('request');

var allowedUsers = (process.env.ALLOWED_USERS || "").split(",").filter(function (s) { return s.length > 0 });

var server = http.createServer(function (req, res) {
  var credentials = auth(req),
      grantAccess = function (grant, message) {
        if (grant) {
          res.end(message || 'Access granted');
        }
        else {
          res.statusCode = 401;
          res.setHeader('WWW-Authenticate', 'Basic realm="openvpn-auth-proxy"');
          res.end(message || 'Access denied');
        }
      },
      requestOptions;

  if (allowedUsers.length == 0) {
    res.statusCode = 503;
    res.end('ALLOWED_USERS environment variable is not set with a comma-delimited list of GitHub usernames!');
  }
  else if (!credentials) {
    grantAccess(false, 'Please enter your GitHub username and password...');
  }
  else if (allowedUsers.indexOf(credentials.name) == -1) {
    grantAccess(false, credentials.name + ' is not in the list of allowed users!');
  }
  else {
    requestOptions = {
      url: 'https://' + credentials.name + ':' + credentials.pass + '@api.github.com/users/' + credentials.name,
      headers: {
        'User-Agent': 'openvpn-auth-proxy'
      }
    };
    request(requestOptions, function (err, response, body) {
      if (err) {
        grantAccess(false, err);
      }
      else if (response.statusCode != 200) {
        grantAccess(false, body);
      }
      else {
        grantAccess(true);
      }
    });
  }
})

server.listen(3000);
