# Operations Guide: Change Orchestration Platform

## 1. Introduction
This guide provides detailed operational procedures for the Change Orchestration platform, covering everything from development workflows to disaster recovery.

## 2. Folder Conventions (Monorepo)
The repository follows a strict monorepo pattern to ensure atomic changes across the stack:
- `apps/web`: The React 18 / Vite frontend portal.
- `apps/api`: The FastAPI backend service.
- `packages/ui`: Shared UI components and design tokens.
- `packages/shared-types`: Unified TypeScript interfaces and Python Pydantic models.
- `packages/config`: Centralized configuration management for all services.
- `infrastructure/terraform`: Infrastructure as Code for AWS environments.

## 3. Branch & Promotion Strategy
We utilize a GitFlow-inspired model with explicit environmental gates:
- `main`: Production-stable code. Deployment to `prod` happens via tagged releases.
- `staging`: Integration testing branch. Auto-deploys to the `staging` environment.
- `develop`: Primary development branch. Auto-deploys to the `dev` environment.
- `feature/*`: Short-lived branches for new capabilities.

### Environmental Gates
1. **Dev**: Automated unit and integration tests.
2. **Staging**: Load testing, security scanning, and UAT (User Acceptance Testing).
3. **Prod**: Manual approval by CAB (Change Advisory Board) members.

## 4. Change Approval Workflows
Approvals are risk-weighted:
- **Risk < 30**: Automatic approval. Logged for audit only.
- **30 <= Risk < 70**: Requires at least one peer approval from the same team.
- **Risk >= 70**: Requires manager approval and explicit CAB review.

## 5. Secrets Handling
- **Local**: Managed via `.env` (excluded from git).
- **AWS**: Managed via **AWS Secrets Manager**.
- **CI/CD**: Managed via **GitHub Actions Secrets**.
*Never commit credentials or private keys to the repository.*

## 6. Terraform Workflow
We use a remote state backend with S3 and DynamoDB for locking.
```bash
cd infrastructure/terraform/envs/dev
terraform init
terraform plan -out=tfplan
terraform apply "tfplan"
```
Drift detection runs daily via GitHub Actions to ensure environment parity.

## 7. Incident Rollback Procedures
In the event of a failed change:
1. **Automated Rollback**: The system triggers a rollback if health checks fail post-deployment.
2. **Manual Rollback**:
   - Access the Change Portal.
   - Select the failed Change Request.
   - Click **"Initiate Emergency Rollback"**.
   - This triggers the previous stable Terraform state or container image deployment.

## 8. Scaling Strategy
- **Frontend**: Scaled via CloudFront (CDN) and S3 bucket hosting (Static).
- **Backend**: Auto-scaled via EKS HPA (Horizontal Pod Autoscaler) based on CPU/Memory and Request Count.
- **Database**: RDS multi-AZ with read-replicas for read-heavy reporting workloads.

## 9. Disaster Recovery (DR)
We maintain a **Pilot Light** DR strategy in a secondary AWS region:
- **RPO (Recovery Point Objective)**: 15 minutes (Database replication latency).
- **RTO (Recovery Time Objective)**: 30 minutes (Infrastructure spin-up and DNS cutover).

## 10. Troubleshooting
- **API Logs**: `kubectl logs -n change-orchestration -l app=api`
- **Worker Errors**: Check the Redis queue status via the Admin dashboard.
- **Database Connectivity**: Verify RDS security groups and VPC peering if applicable.

---
<sub>Last Updated: 2026-04-28 | Operations Engineering Team</sub>
