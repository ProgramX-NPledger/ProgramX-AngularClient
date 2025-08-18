export interface HealthCheck {
    status: string,
    azureFunctions: boolean | null,
    azureCosmosDb: boolean | null,
    azureStorage: boolean | null
}