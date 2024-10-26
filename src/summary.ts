import { DBSingletone } from "./DBSingletone";

export async function getUserSummary(userId: string, summaryTableName: string) {
    const params = {
        TableName: summaryTableName,
        Key: {
            userId: userId,
        },
    };

    try {
        const data = await DBSingletone.get(params);
        return (data.Items as any)?.summary ?? ''  
    } catch (error) {
        console.error('Error retrieving user summary:', error);
        return null;
    }
}