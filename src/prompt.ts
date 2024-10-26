import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSecretValue } from "./secretConfiguration";
import { secretManagerSchema } from "./secretManagerSchema";
import { getUserIdFromToken, userInput } from "./utils";
import { getConversationContext } from "./conversation";

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const body: userInput = JSON.parse(event.body || '{}');
        const { sessionId, input } = body
        const secret = await getSecretValue(process.env.SECRET_NAME);
        const secrets: secretManagerSchema = JSON.parse(secret.SecretString);
        console.log('secrets', secrets);
        const useriD = getUserIdFromToken(event);
        const response = await getConversationContext(sessionId, input,
            useriD, secret.CONTEXT_DYNAMO_TABLE_NAME, secret.SUMMARY_DYNAMO_TABLE_NAME)
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: response,
            }),
        };
    } catch (error) {
        console.error("Error: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: (error as Error).message }),
        };
    }
};
