# ACS Email Event Handler (Azure Functions)

This project provides an Azure Functions-based system that subscribes to Azure Communication Services (ACS) Email events via Event Grid, keeps the Managed Suppression List optimal, and includes test email sending and suppression list query/management endpoints.

## Features
- Send test emails
- Subscribe to ACS Email events via Event Grid
- Update Managed Suppression List based on delivery events
- Query and manage the Managed Suppression List

## Architecture
- Azure Functions handles HTTP endpoints and Event Grid delivery events.
- ACS Email events drive suppression list updates.
- Suppression list management uses the ACS management SDK (ARM).

## Prerequisites
- Node.js 20.x
- Azure Functions Core Tools v4
- Azure CLI
- ACS Email resource with a verified sender and configured domain
- Managed identity or service principal for ARM calls

## Configuration
Create local settings from [local.settings.json.example](local.settings.json.example) and set:
- `ACS_CONNECTION_STRING`
- `ACS_EMAIL_FROM`
- `AZURE_SUBSCRIPTION_ID`
- `ACS_RESOURCE_GROUP`
- `ACS_EMAIL_SERVICE_NAME`
- `ACS_DOMAIN_RESOURCE_NAME`
- `ACS_SUPPRESSION_LIST_NAME`

For local development, set `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` if using a service principal. In Azure, a managed identity is recommended.

## Local Development
- Install dependencies, run tests, and start the Functions host.
- Use the HTTP endpoints below to validate behavior.

## HTTP Endpoints
- `POST /api/send-test`
	- Body: `{ "to": "user@example.com", "subject": "Test", "plainText": "Hello" }`
- `GET /api/suppression?email=user@example.com`
- `POST /api/suppression`
	- Body: `{ "email": "user@example.com", "action": "add", "reason": "bounced" }`

## Event Grid Subscription
Subscribe the ACS Email event `Microsoft.Communication.EmailDeliveryReportReceived` to the Function `emailEvents` in this app. Use the function’s Event Grid endpoint from the Azure portal when creating the subscription.

## Deployment
Infrastructure templates are in [infra/main.bicep](infra/main.bicep). Copy [infra/parameters.sample.json](infra/parameters.sample.json) to `infra/parameters.json`, fill in real values, then deploy to create the Function App, storage, and Application Insights, and deploy the function code package.

## Tests
This project follows TDD. Run the unit tests before and after changes to confirm behavior.
