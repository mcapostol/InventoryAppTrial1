## 3️⃣ InventoryAppTrial1 (+ Web‑UI)

[![API Health](https://img.shields.io/badge/health-ok-brightgreen?logo=uptime-robot)](http://localhost:4000/health)
[![API Docker Build](https://github.com/mcapostol/InventoryAppTrial1/actions/workflows/build-api.yml/badge.svg)](https://github.com/mcapostol/InventoryAppTrial1/actions/workflows/build-api.yml)
[![UI Docker Build](https://img.shields.io/badge/UI--Docker--Build-passing-brightgreen?logo=docker)]()
[![Docker Compose](https://img.shields.io/badge/docker_compose-up-blue?logo=docker)]()


Internal tool for stock tracking across multiple warehouses. Written in Node & Express,  
plus a lightweight React Admin UI. This repo will evolve into a fully containerised  
micro‑service deployed on **AKS**.

| Section  | Details                                                             |
|----------|---------------------------------------------------------------------|
| **Goal**  | CRUD inventory, QR‑scan intake, basic reporting (download to Excel/PDF). |
| **Stack** | Node.js 20, Express, MongoDB Atlas, React 18 (Vite), Jest, Docker, Helm.  |
| **Status**| Proof‑of‑Concept (API + basic UI)                                    |

## Roadmap 🗺
- [x] REST API (items, locations, movements)  
- [x] React UI (table + forms)  
- [x] Dockerfile & Compose for local dev  
- [x] GitHub Actions → build & push image to ACR  
- [ ] Terraform module (AKS + Mongo DB flex server)  
- [ ] GitOps (ArgoCD) rollout Dev → Prod  
- [ ] Prometheus metrics + Grafana dashboard  
- [ ] Role‑based access (JWT + Entra ID)  

## Local dev
```bash
git clone https://github.com/mcapostol/InventoryAppTrial1
cd InventoryAppTrial1
npm ci               # backend
npm run dev          # API on :4000
cd web && npm ci && npm run dev   # UI on :5173
```
## Local Docker

Pornire locală cu Docker Compose:

```bash
docker compose up --build
```

```mermaid
graph TD
    %% CI / CD
    subgraph "CI / CD"
      devPC[(Developer PC)]
      gha["GitHub<br/>Actions<br/>(CI + CD)"]
      devPC -- "push / PR" --> gha
    end

    %% Resource Group
    subgraph Azure_RG["Azure Resource Group: rg‑inventory"]
      terraform["Terraform State<br/>(Storage Account)"]
      aks[(AKS Cluster)]
      acr["Azure Container Registry"]
      kv["Azure Key Vault"]
      log["Log Analytics Workspace"]
      policy["Azure Policy<br/>Add‑on for AKS"]
      defender["Defender for Cloud"]
      argo["Argo CD<br/>(ns argocd)"]
    end

    %% AKS internals
    subgraph AKS_Internal["Inside AKS"]
      ingress["NGINX<br/>Ingress Controller"]
      inventoryDeploy["Deployment<br/>inventory-api"]
      inventoryUI["Deployment<br/>inventory-ui"]
      hpa["HPA<br/>min 2 / max 6"]
    end

    %% External DB
    mongo["MongoDB Atlas<br/>Cloud"]

    %% CI/CD flow
    gha -- "docker build & push" --> acr
    gha -- "helm upgrade --install" --> argo

    %% GitOps sync
    argo -- "sync manifests" --> ingress
    argo --> inventoryDeploy
    argo --> inventoryUI
    argo --> hpa

    %% Runtime traffic
    ingress --> inventoryUI
    ingress --> inventoryDeploy
    inventoryDeploy -- "CRUD REST" --> mongo

    %% Secrets
    kv -- "CSI / AAD Pod Identity" --> inventoryDeploy
    kv -- "CSI / AAD Pod Identity" --> inventoryUI

    %% Observability
    aks -- metrics --> log
    inventoryDeploy -- logs --> log
    inventoryUI -- logs --> log

    %% IaC apply
    devPC -- "terraform apply" --> aks
    devPC --> acr
    devPC --> kv
    devPC --> log
    devPC --> policy
    devPC --> defender

    %% Governance
    policy -. "enforce CIS & custom policies" .-> aks
    defender -. "CSPM & vuln scans" .-> aks

```
  
