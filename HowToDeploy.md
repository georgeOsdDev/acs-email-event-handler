# How to Deploy (CLI)

This guide deploys the infrastructure with Bicep and publishes the Azure Functions app using the Azure CLI and Functions Core Tools.

## Prerequisites
- Azure CLI
- Azure Functions Core Tools v4
- Node.js 20.x
- An Azure subscription with permission to create resources

## 1) Sign in and select subscription
```bash
az login
az account set --subscription <subscription-id>
```

## 2) Create a resource group
```bash
az group create --name <resource-group> --location <location>
```

## 3) Prepare parameters
Copy [infra/parameters.sample.json](infra/parameters.sample.json) to `infra/parameters.json` and set all values:
- functionAppName
- storageAccountName
- appInsightsName
- acsConnectionString
- acsEmailFrom
- acsSubscriptionId
- acsResourceGroup
- acsEmailServiceName
- acsDomainResourceName
- acsSuppressionListName

## 4) Deploy infrastructure
```bash
az deployment group create \
  --resource-group <resource-group> \
  --template-file infra/main.bicep \
  --parameters @infra/parameters.json
```

## 5) Assign role to Function App's Managed Identity
Grant the Function App's Managed Identity the "Communication and Email Service Owner" role on the ACS resource:

```bash
# Get the Function App's principal ID (from Bicep output or Portal)
PRINCIPAL_ID=$(az functionapp identity show --name <function-app-name> --resource-group <resource-group> --query principalId -o tsv)

# Get the ACS resource ID
ACS_RESOURCE_ID="/subscriptions/<subscription-id>/resourceGroups/<acs-resource-group>/providers/Microsoft.Communication/communicationServices/<acs-service-name>"

# Assign "Communication and Email Service Owner" role (role ID: e8948e48-967f-4b3e-8167-469f60aed267)
az role assignment create \
  --assignee-object-id "$PRINCIPAL_ID" \
  --role "Communication and Email Service Owner" \
  --scope "$ACS_RESOURCE_ID"
```

Or use the Azure Portal: ACS resource > Access control (IAM) > Add role assignment > "Communication and Email Service Owner" > select the Function App.

## 6) Build the Functions app
```bash
npm ci
npm run build
```

## 7) Publish the Functions app
```bash
func azure functionapp publish <function-app-name>  --typescript
```

## 8) Create Event Grid subscription
Create an Event Grid subscription from the ACS Email resource to the Function App’s Event Grid endpoint. In the Azure Portal, select the ACS Email resource and add a new Event Grid subscription with the event type `Microsoft.Communication.EmailDeliveryReportReceived` and endpoint set to the Function `emailEvents`.

## 9) Validate
- Send a test email via `POST /api/send-test`
- Query suppression via `GET /api/suppression?email=user@example.com`
- Confirm suppression updates on bounce/complaint events

## Notes
- For suppression list management, the Function App should use a managed identity or service principal with access to the ACS resource.
- Store secrets in App Settings or Key Vault.
