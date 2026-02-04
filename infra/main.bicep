param location string = resourceGroup().location
param functionAppName string
param storageAccountName string
param appInsightsName string

@secure()
param acsConnectionString string
param acsEmailFrom string
param acsSuppressionListLevel string = 'domain'

param acsSubscriptionId string
param acsResourceGroup string
param acsEmailServiceName string
param acsDomainResourceName string
param acsSuppressionListName string

var appServicePlanName = '${functionAppName}-plan'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

resource plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
}

resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage__accountName'
          value: storageAccount.name
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
{
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~22'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'ACS_CONNECTION_STRING'
          value: acsConnectionString
        }
        {
          name: 'ACS_EMAIL_FROM'
          value: acsEmailFrom
        }
        {
          name: 'ACS_SUPPRESSION_LIST_LEVEL'
          value: acsSuppressionListLevel
        }
        {
          name: 'AZURE_SUBSCRIPTION_ID'
          value: acsSubscriptionId
        }
        {
          name: 'ACS_RESOURCE_GROUP'
          value: acsResourceGroup
        }
        {
          name: 'ACS_EMAIL_SERVICE_NAME'
          value: acsEmailServiceName
        }
        {
          name: 'ACS_DOMAIN_RESOURCE_NAME'
          value: acsDomainResourceName
        }
        {
          name: 'ACS_SUPPRESSION_LIST_NAME'
          value: acsSuppressionListName
        }
        {
          name: 'AzureWebJobs.sendTestEmail.Disabled'
          value: 'true'
        }
        {
          name: 'AzureWebJobs.getSuppression.Disabled'
          value: 'true'
        }
        {
          name: 'AzureWebJobs.updateSuppression.Disabled'
          value: 'true'
        }
      ]
    }
    httpsOnly: true
  }
}

resource storageRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, functionApp.id, 'StorageBlobDataOwner')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b')
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

output functionAppName string = functionApp.name
output functionAppId string = functionApp.id
output functionAppPrincipalId string = functionApp.identity.principalId
