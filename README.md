# my-health-check-api
A barebones Express application that exposes a single endpoint, like /status or /health.

# Install Node.js and Express on local development machine
1. sudo apt update && sudo apt install npm
2. cd ~/my-health-check-api
3. npm init -y
4. npm install express

# Building and Running Container Image
1. docker build -t my-health-check-api:v1.0.0 .
2. docker run -p 8080:3000 my-health-check-api:v1.0.0

# Testing
1. http://localhost:8080
2. http://localhost:8080/health

# Clean Up
1. docker rm <container name>
2. docker rmi my-health-check-api:v1.0.0

# Setup MicroK8s Cluster & Access
1. Get the MicroK8s KubeconfigFirst, you need the configuration file that tells kubectl how to connect to your cluster. In your WSL terminal, run `microk8s config > cluster-config.yaml`
2. Update the Server Address (The WSL IP) By default, the config file uses 127.0.0.1 (localhost). However, GitHub cannot see "localhost" on your machine. You must replace it with your WSL IP Address. Find your WSL IP `hostname -I | awk '{print $1}'` Edit cluster-config.yaml Open the file and find the line starting with server: https://127.0.0.1:16443. Change it to: server: https://<YOUR_WSL_IP>:16443. 
[!IMPORTANT]You may need to ensure your Windows Firewall allows incoming traffic on port 16443.
Open Firewall Advanced Security -> Create a New Inbound Rule 

  Rule Type: Port
  Protocol and Ports: TCP 16443
  Actio: Allow the connection
  Profile: Uncheck Public (for security). Keep Domain and Private checked.
  Name: MicroK8s API Server

  Even after opening the firewall, Windows doesn't automatically know that traffic hitting port 16443 should go to WSL. WSL has its own internal IP address. To bridge this gap, you need to run a Port Proxy command in PowerShell (as Administrator). This tells Windows: "Anything coming to my physical PC's IP on 16443 should be sent to the WSL IP on 16443.
  Run the Proxy Command (PowerShell Admin) `netsh interface portproxy add v4tov4 listenport=16443 listenaddress=0.0.0.0 connectport=16443 connectaddress=<WSL_IP>`

  How to Verify it's Working: To check if the port is actually open and listening on your Windows machine, run this in a standard Windows Command Prompt or PowerShell: `Test-NetConnection -ComputerName localhost -Port 16443`
  If TcpTestSucceeded is True, you have successfully opened the path!

3. Create KUBE_CONFIG_DATA GitHub Actions Secret: azure/k8s-set-context@v4 supports both raw format and Base64 format. Proceed with just pasting the raw format to the secret value. Copy all of the content inside the cluster-config.yaml. Save the Secret in your GitHub Repository. Click Settings > Secrets and variables > Actions. Click New repository secret. Name: KUBE_CONFIG_DATA (or any naming, as long as it is referenced in ci.yml)
Secret: Paste the raw string format from cluster-config.yaml

How the Connection Works: Once this is set up, the azure/k8s-set-context action in your workflow will decode that secret and use it to point the GitHub Runner toward your WSL environment.

4. Use a Tannel to make the local MicroK8s cluster "Public"
- Install ngrok on Windows.
- Sign up for a ngrok account using GitHub: https://dashboard.ngrok.com/signup
- Access Auth Token: https://dashboard.ngrok.com/get-started/your-authtoken
- Add auth token to ngrok config: `ngrok config add-authtoken $YOUR_AUTHTOKEN`
- Add payment method for identity verification: https://dashboard.ngrok.com/settings#id-verification
- In Command Prompt, Run: `ngrok tcp 16443`
- Ngrok will give you a public URL (e.g., tcp://0.tcp.ngrok.io:12345) - replace `tcp` with `https`
- You would update the server: line in your GitHub Secret to match that URL. This should override the change made in step 3.
