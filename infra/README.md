# Event Macha Database Infrastructure (AWS CDK)

This repository contains the production-ready Infrastructure as Code (IaC) for the **Event Macha** platform's database layer. It is built using **AWS CDK (Cloud Development Kit) in TypeScript** and deploys six optimized DynamoDB tables to AWS Region `ap-south-1` for the **Production** environment.

## Directory Layout
```
infra/
  ├── package.json          # Dependencies & deployment scripts
  ├── tsconfig.json         # TypeScript compiler configurations
  ├── cdk.json              # CDK app runner & context variables
  ├── bin/
  │   └── event-macha-infra.ts   # Entrypoint & environment orchestration
  ├── config/
  │   ├── app-config.ts     # Production environment parameters
  │   └── iam-policies.json # Copy-pasteable JSON IAM policies for Lambdas
  ├── constructs/
  │   └── event-macha-table.ts # Reusable DynamoDB table builder
  ├── tables/               # Isolated DynamoDB schema modules (1 file per table)
  │   ├── users-table.ts
  │   ├── rate-cards-table.ts
  │   ├── rate-card-plans-table.ts
  │   ├── orders-table.ts
  │   ├── payments-table.ts
  │   └── payment-history-table.ts
  └── stacks/
      └── event-macha-db-stack.ts # Core DB Stack orchestrator with CfnOutputs
```

---

## Production-Ready Features

1. **Continuous Backup (Point-in-Time Recovery)**: Enabled (`pointInTimeRecovery: true`) on all tables to safeguard data against accidental deletes or write errors.
2. **Deletion Protection**: Automatically enabled (`deletionProtection: true`) to prevent accidental stack deletions from tearing down production databases.
3. **Pay-Per-Request Billing**: Sets `billingMode: BillingMode.PAY_PER_REQUEST` on all tables to prevent provisioning idle RUs/WUs, ensuring optimal scale-to-zero pricing.
4. **Encryption at Rest**: Fully secured at rest using standard **AWS Managed KMS keys** (`TableEncryption.AWS_MANAGED`).
5. **Enforced Tagging**: Automatically applies standard tags (`Project=EventMacha`, `Environment=prod`) to all DynamoDB tables recursively.
6. **TTL Support**: Built-in TTL configuration (on the `ttl` attribute) in the `PaymentHistory` table for automatic log pruning.
7. **CloudFormation Exports**: Automatically creates CloudFormation outputs with explicit exports for every table name and ARN, facilitating easy integration with Lambda and API Gateway stacks.

---

## Prerequisites

Before deploying, ensure you have:
1. **Node.js** (v18 or higher recommended)
2. **AWS CLI** installed and configured with your credentials:
   ```bash
   aws configure
   ```
3. **AWS CDK CLI** installed globally (or run via `npx`):
   ```bash
   npm install -g aws-cdk
   ```

---

## Installation & Deployment Instructions

### 1. Install Dependencies
Change into the `infra` directory and run:
```bash
npm install
```

### 2. AWS Bootstrap (Only required once per region/account)
CDK requires a bootstrap stack to store assets before deployment. If you haven't bootstrapped your AWS account in the `ap-south-1` region, run:
```bash
npx cdk bootstrap aws://your-account-id/ap-south-1
```

### 3. Synthesize CloudFormation Templates (Verify Compilation)
Translate your TypeScript definitions into raw CloudFormation templates to verify syntactical correctness:
```bash
npx cdk synth -c environment=prod
```

### 4. Diff Changes
Examine planned database changes before executing them in the AWS cloud:
```bash
npx cdk diff -c environment=prod
```

### 5. Deploy to AWS manually via CLI
Execute the stack creation on your AWS account:
```bash
npx cdk deploy EventMachaDbStack-prod -c environment=prod
```

---

## GitHub Actions Manual Deployment Pipeline

This repository comes pre-configured with a manual GitHub Actions deployment workflow located at `.github/workflows/deploy-infra.yml`.

### Set up Secrets
Before running the pipeline, configure the following secrets in your GitHub Repository settings (**Settings -> Secrets and variables -> Actions**):
* `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
* `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.

### Trigger Deployment
1. Go to your repository on GitHub.
2. Click on the **Actions** tab.
3. Select **Deploy Event Macha Database Infrastructure (Prod)** from the left sidebar.
4. Click the **Run workflow** dropdown on the right.
5. Select the target branch and click **Run workflow**.

---

## Backend Integration (Quarkus)

The stack outputs table names and ARNs. For the Quarkus backend to access these tables on AWS Lambda, map the following Environment Variables in your serverless launcher or Lambda console:

| Environment Variable | Source / CloudFormation Export Name |
| :--- | :--- |
| `EVENT_MACHA_USERS_TABLE_NAME` | `EventMacha-prod-Users-TableName` |
| `EVENT_MACHA_RATE_CARDS_TABLE_NAME` | `EventMacha-prod-RateCards-TableName` |
| `EVENT_MACHA_RATE_CARD_PLANS_TABLE_NAME` | `EventMacha-prod-RateCardPlans-TableName` |
| `EVENT_MACHA_ORDERS_TABLE_NAME` | `EventMacha-prod-Orders-TableName` |
| `EVENT_MACHA_PAYMENTS_TABLE_NAME` | `EventMacha-prod-Payments-TableName` |
| `EVENT_MACHA_PAYMENT_HISTORY_TABLE_NAME` | `EventMacha-prod-PaymentHistory-TableName` |

See [backend/application.properties](../backend/application.properties) for complete configuration settings in the Java/Kotlin codebase.
