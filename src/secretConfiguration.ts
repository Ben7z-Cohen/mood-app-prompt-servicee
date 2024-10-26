const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

export const getSecretValue = async (secretName?: string) => {
    if (process.env.NODE_ENV === 'local') {
        return {
            SecretString: JSON.stringify({
                COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
                COGNITO_APP_CLIENT_ID: process.env.COGNITO_APP_CLIENT_ID,
                USER_POOL_NAME: process.env.USER_POOL_NAME,
                CONTEXT_DYNAMO_TABLE_NAME: process.env.CONTEXT_DYNAMO_TABLE_NAME,
                SUMMARY_DYNAMO_TABLE_NAME: process.env.SUMMARY_DYNAMO_TABLE_NAME
            }),
        };
    }

    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    return data;
};
