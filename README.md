
---

## 3️⃣ `InventoryAppTrial1` (+ Web‑UI)

```markdown
# Inventory App v1

Internal tool for stock tracking across multiple warehouses. Written in Node & Express, plus a lightweight React Admin UI. This repo will evolve into a fully containerised micro‑service deployed on **AKS**.

| Section | Details |
|---------|---------|
| **Goal** | CRUD inventory, QR‑scan intake, basic reporting (download to Excel/PDF). |
| **Stack** | Node.js 20, Express, MongoDB Atlas, React 18 (Vite), Jest, Docker, Helm. |
| **Status** | Proof‑of‑Concept (API + basic UI) |

## Roadmap&nbsp;🗺
- [x] REST API (items, locations, movements)
- [x] React UI (table + forms)
- [ ] Dockerfile & Compose for local dev
- [ ] GitHub Actions → build & push image to ACR
- [ ] Terraform module (AKS + Mongo DB flex server)
- [ ] GitOps (ArgoCD) rollout Dev → Prod
- [ ] Prometheus metrics + Grafana dashboard
- [ ] Role‑based access (JWT + Entra ID)

## Local dev
```bash
git clone https://github.com/mcapostol/InventoryAppTrial1
npm ci                      # backend
npm run dev                 # API on :4000
cd web && npm ci && npm run dev   # UI on :5173

## 🖼 Infrastructure Diagram

```mermaid
graph TD
    subgraph CI/CD
        devPC[(Developer PC)]
        gha[GitHub<br>Actions]
        devPC -->|push| gha
    end

    subgraph Azure_RG["Azure Resource Group: rg-inventory"]
        terraform[Terraform State<br>(Storage Account)]
        aks[(AKS Cluster)]
        acr[(Azure&nbsp;Container&nbsp;Registry)]
        log[(Log Analytics)]
        argo[Argo CD<br>(namespace argocd)]
    end

    subgraph AKS
        ingress[NGINX<br>Ingress Controller]
        inventoryDeploy[Deployment<br>inventory-api]
        inventoryUI[Deployment<br>inventory-ui]
        hpa[HPA<br>scale 2‑6]
    end

    mongo[(MongoDB Atlas<br>Cloud)]
    
    %% CI/CD flow
    gha -->|docker build & push| acr
    gha -->|helm upgrade --install| argo

    %% GitOps sync
    argo -->|sync manifests| ingress
    argo --> inventoryDeploy
    argo --> inventoryUI
    argo --> hpa

    %% Runtime traffic
    ingress --> inventoryUI
    ingress --> inventoryDeploy
    inventoryDeploy -->|CRUD REST| mongo

    %% Observability
    aks -- metrics --> log
    inventoryDeploy -- logs --> log
    inventoryUI -- logs --> log

    %% IaC
    devPC -->|terraform apply| aks
    devPC -->|terraform apply| acr
    devPC -->|terraform apply| log
