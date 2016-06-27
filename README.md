# OpenVPN GitHub Auth

This is a authentication backend for openvpn-httpbasic on Rancher using a filtered list of GitHub usernames (in a comma-delimated environment variable named ALLOWED_USERS).

## Example Rancher docker-compose.yml

```openvpn-httpbasic-server:
  ports:
  - 1194:1194/tcp
  environment:
    AUTH_HTTPBASIC_URL: http://openvpn-httpbasic-proxy:3000/
    AUTH_METHOD: httpbasic
    CERT_CITY: Birmingham
    CERT_COUNTRY: US
    CERT_EMAIL: foo@example.com
    CERT_ORG: ACME
    CERT_OU: IT
    CERT_PROVINCE: AL
    REMOTE_IP: IP-address-or-hostname
    REMOTE_PORT: '1194'
    VPNPOOL_CIDR: '16'
    VPNPOOL_NETWORK: 10.43.0.0
  log_driver: ''
  labels:
    io.rancher.sidekicks: openvpn-httpbasic-data
    io.rancher.container.pull_image: always
    io.rancher.scheduler.affinity:host_label: org.concord.role=manager
  log_opt: {}
  image: mdns/rancher-openvpn:1.0
  links:
  - 'openvpn-httpbasic-proxy:'
  privileged: true
  volumes_from:
  - openvpn-httpbasic-data
openvpn-httpbasic-proxy:
  ports:
  - 3000:3000/tcp
  environment:
    ALLOWED_USERS: dougmartin,scytacki
  labels:
    io.rancher.container.pull_image: always
    io.rancher.scheduler.affinity:host_label: org.concord.role=manager
  image: concordconsortium/openvpn-github-auth
openvpn-httpbasic-data:
  labels:
    io.rancher.container.start_once: 'true'
    io.rancher.scheduler.affinity:host_label: org.concord.role=manager
  entrypoint:
  - /bin/true
  image: busybox
  links:
  - 'openvpn-httpbasic-proxy:'
  volumes:
  - /etc/openvpn/
```
