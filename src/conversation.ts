import { PromptResponse } from './utils';
import axios from 'axios';
import { DBSingletone } from './DBSingletone';
import { v4 as uuidv4 } from 'uuid';
import { getUserSummary } from './summary';

export async function getConversationContext(sessionId: string,
    currentInput: string,
    userId: string, contextTableName: string, summaryTableName: string) {
    const promptEP = process.env.EP ?? ""
    const params = {
        TableName: contextTableName,
        KeyConditionExpression: 'sessionId = :sessionId',
        ExpressionAttributeValues: {
            ':sessionId': sessionId
        }
    };
    try {
        const data = await DBSingletone.query(params)
        const messages = data.Items;
        const context = messages?.map(msg => {
            return `User: ${msg.userMessage}\nBot: ${msg.botResponse}`;
        }).join('\n');
        const summary = await getUserSummary(userId, summaryTableName);
        const completeContext = `${context}\nUser: ${currentInput}\nSummary: ${summary}\n`;
        const response: PromptResponse = await axios.post(promptEP, { input: completeContext })
        putCurrentInputAndResponse(contextTableName, sessionId, currentInput, response);
        return response
    } catch (error) {
        console.error('Error retrieving conversation context:', error);
        return null;
    }
}

async function putCurrentInputAndResponse(tableName: string, sessionId: string,
    currentInput: string, response: PromptResponse) {
    const conversationId = uuidv4()
    const ttl = Math.floor(Date.now() / 1000) + 3600;
    const paramsPut = {
        TableName: tableName,
        Item: {
            sessionId: { S: sessionId },
            conversationId: { S: conversationId },
            userMessage: { S: currentInput },
            botResponse: { S: response.data.response },
            ttl: { N: ttl.toString() },
            createdAt: { N: Math.floor(Date.now() / 1000).toString() },
            updatedAt: { N: Math.floor(Date.now() / 1000).toString() },
        },
    };
    try {
        await DBSingletone.put(paramsPut);
    } catch (error) {
        console.error('Error adding item:', error);
    }
}
