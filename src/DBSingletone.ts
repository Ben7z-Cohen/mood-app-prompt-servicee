import { AWSError } from "aws-sdk";
import { DocumentClient, } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
import {
    DynamoDBClient, PutItemCommand,
    PutItemCommandInput, PutItemCommandOutput,
    UpdateItemCommandInput, UpdateItemCommandOutput,
    UpdateItemCommand, DeleteItemCommandInput, DeleteItemCommandOutput,
    DeleteItemCommand
} from '@aws-sdk/client-dynamodb';

export class DBSingletone {

    private static instance: DBSingletone;
    private static dynamoDocumentClient: DocumentClient;
    private static dynamoDBClient: DynamoDBClient;
    private constructor() {}

    public static async get(params: DocumentClient.GetItemInput): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
        return await this.dynamoDocumentClient.get(params).promise()
    }

    public static async put(params: PutItemCommandInput): Promise<PutItemCommandOutput> {
        const command = new PutItemCommand(params);
        return await this.dynamoDBClient.send(command);
    }

    public static async update(params: UpdateItemCommandInput): Promise<UpdateItemCommandOutput> {
        const command = new UpdateItemCommand(params);
        return await this.dynamoDBClient.send(command);
    }

    public static async delete(params: DeleteItemCommandInput): Promise<DeleteItemCommandOutput> {
        const command = new DeleteItemCommand(params);
        return await this.dynamoDBClient.send(command);
    }

    public static async query(params: DocumentClient.QueryInput): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
        return await this.dynamoDocumentClient.query(params).promise()
    }

    public static getInstance(): DBSingletone {
        if (!DBSingletone.instance) {
            DBSingletone.instance = new DBSingletone();
            this.dynamoDocumentClient = new DocumentClient()
            this.dynamoDBClient = new DynamoDBClient()
        }
        return DBSingletone.instance;
    }
}