
import { APIGatewayProxyEvent } from "aws-lambda";
const jwt = require('jsonwebtoken');

export const getUserIdFromToken = (event: APIGatewayProxyEvent) => {
    try {
        const authorizationHeader = event.headers['Authorization'] || event.headers['authorization'];
        if (authorizationHeader) {
            const [bearer, token] = authorizationHeader.split(' ');

            if (bearer !== 'Bearer' || !token) {
                console.error('Invalid Authorization header format')
                throw new Error('Invalid Authorization header format');
            }

            const decodedToken = jwt.decode(token);
            return decodedToken ? decodedToken.sub : null;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        throw new Error('Error decoding token');
    }
    throw new Error('Error decoding token, no authorizationHeader header');
}

export interface PromptResponse {
    data: { response: string }
}

export interface userInput {
    input: string,
    sessionId: string,
}