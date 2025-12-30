# Self-Signed Certificate Setup
Manually One Time Setup
1. Generate a private key on WSL host where MicroK8s is running: `openssl genrsa -out tls.key 2048`
2. Create the certificate (valid for 10 years)
# Replace [NODE_IP] with your actual MicroK8s node IP (e.g., 192.168.1.10)
openssl req -x509 -new -nodes -key tls.key -sha256 -days 3650 \
  -out tls.crt \
  -subj "/CN=localhostl" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:[NODE_IP]"
3. Create Kubernetes TLS Secret holding the tls.key and tls.crt
kubectl create secret tls my-api-tls-secret \
  --cert=tls.crt \
  --key=tls.key

4. Add tls and secret reference to [text](ingress.yml)

# Cert-Manager Certificate Setup (TODO)