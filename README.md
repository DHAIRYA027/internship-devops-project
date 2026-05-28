# Internship DevOps Project

A complete **DevSecOps CI/CD pipeline** with multi-environment Kubernetes deployments, automated security scanning, and Discord notifications.

![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=flat&logo=jenkins&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?style=flat&logo=kubernetes&logoColor=white)
![SonarQube](https://img.shields.io/badge/SonarQube-Code%20Quality-4E9BCD?style=flat&logo=sonarqube&logoColor=white)

---

## ✨ Features

| Feature | Tool | Description |
|---|---|---|
| CI/CD Pipeline | Jenkins | Automated pipeline triggered on every push |
| Code Analysis | SonarQube | Static analysis and quality gates |
| Secret Scanning | GitLeaks | Detects exposed credentials in code |
| Vulnerability Scanning | Grype | Scans container images for CVEs |
| Container Build & Push | Docker | Automated image build and registry push |
| Multi-Env Deployment | Kubernetes | Separate dev, QA, and prod namespaces |
| Health Checks | Kubernetes | Automated readiness & liveness probes |
| Rollback Support | Kubernetes | One-command deployment rollback |
| Notifications | Discord | Real-time pipeline status alerts |

---

## 🛠 Prerequisites

Install the following before getting started:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/intro/install/)
- [Jenkins](https://www.jenkins.io/doc/book/installing/)
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## 🚀 Setup Guide

### 1. Start Minikube

```bash
minikube start
```

Verify:

```bash
minikube status
```

---

### 2. Start Docker

Ensure Docker Desktop is running, then verify:

```bash
docker ps
```

---

### 3. Start Jenkins

```bash
brew services start jenkins-lts
```

Open Jenkins at: [http://localhost:8080](http://localhost:8080)

---

### 4. Start SonarQube

```bash
docker start sonarqube
```

Open SonarQube at: [http://localhost:9000](http://localhost:9000)

---

### 5. Verify Kubernetes Cluster

```bash
kubectl get nodes
```

---

### 6. Create Namespaces

```bash
kubectl create namespace dev
kubectl create namespace qa
kubectl create namespace prod
```

Verify:

```bash
kubectl get ns
```

---

### 7. Deploy Application

**Dev**

```bash
kubectl apply -f kubernetes/deployment.yaml -n dev
kubectl apply -f kubernetes/service.yaml -n dev
```

**QA**

```bash
kubectl apply -f kubernetes/deployment.yaml -n qa
kubectl apply -f kubernetes/service.yaml -n qa
```

**Prod**

```bash
kubectl apply -f kubernetes/deployment.yaml -n prod
kubectl apply -f kubernetes/service.yaml -n prod
```

Verify all deployments:

```bash
kubectl get all -A
```

---

### 8. Port Forward Applications

| Environment | Command | URL |
|---|---|---|
| Dev | `kubectl port-forward service/internship-service 3000:3000 -n dev` | http://localhost:3000 |
| QA | `kubectl port-forward service/internship-service 3001:3000 -n qa` | http://localhost:3001 |
| Prod | `kubectl port-forward service/internship-service 3002:3000 -n prod` | http://localhost:3002 |

---

### 9. Run Jenkins Pipeline

Push your code — the pipeline triggers automatically:

```bash
git add .
git commit -m "your message"
git push
```

---

## ⚙️ Useful Kubernetes Commands

### Pods & Services

```bash
kubectl get pods -A
kubectl get svc -A
```

### View Logs

```bash
kubectl logs <pod-name> -n <namespace>
```

### Rollout Management

```bash
kubectl rollout restart deployment/internship-app -n dev
kubectl rollout status deployment/internship-app -n dev
kubectl rollout undo deployment/internship-app -n dev
```

---

## 🛑 Stop Everything

| Service | Command |
|---|---|
| Jenkins | `brew services stop jenkins-lts` |
| SonarQube | `docker stop sonarqube` |
| Minikube | `minikube stop` |
