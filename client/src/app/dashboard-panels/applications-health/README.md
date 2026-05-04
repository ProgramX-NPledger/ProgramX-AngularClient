# Applications Health
This component is intended to provide application health information, including basic diagnostics to identify any 
issues with the configuration. Additional data will be logged.

## Security

This component must only be used within an authenticated scenario.

## Service

The service is `HealthCheckService` and is responsible for providing data access to the underlying API.

The `healthCheckItems$` Observable can be used to subscribe to the results of the Health Check request.
This can be applied using an Async Pipe.

The Service must only return applications for which the user has access, by whatever means. Or the user has the administration role.

## Component

The component is the behavioural layer of the health check service. It is used as the behavioural layer that communicates with the service.

The `healthCheck$` Observable can be used to get an asynchronous response from the Health Check service and is optimised for a declarative application using an Async Pipe.


