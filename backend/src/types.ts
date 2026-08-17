import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

export type ApiEvent = APIGatewayProxyEventV2
export type ApiResult = APIGatewayProxyResultV2
export type AdminClaims = { sub: string; email: string; role: 'admin' }
