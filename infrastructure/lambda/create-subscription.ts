import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import middy from 'middy';
import cors from '@middy/http-cors';
import { ALLOWED_ORIGIN_PRODUCTION } from './constants';

const dynamodb = new DynamoDB.DocumentClient();

const createSubscription = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;

    if (!userId || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    const subscription = JSON.parse(event.body);
    const subscriptionId = uuidv4();

    const item = {
      userId,
      subscriptionId,
      createdAt: new Date().toISOString(),
      ...subscription,
    };

    await dynamodb
      .put({
        TableName: process.env.TABLE_NAME!,
        Item: item,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(item),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

// Determine the allowed origin based on the environment
const allowedOrigin =
  process.env.NODE_ENV === 'production' ? ALLOWED_ORIGIN_PRODUCTION : '*';

export const handler = middy(createSubscription).use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
