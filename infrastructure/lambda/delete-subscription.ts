import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import middy from 'middy';
import cors from '@middy/http-cors';
import { ALLOWED_ORIGIN_PRODUCTION } from './constants';

const dynamodb = new DynamoDB.DocumentClient();

const deleteSubscription = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    const subscriptionId = event.pathParameters?.subscriptionId;

    if (!userId || !subscriptionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    await dynamodb
      .delete({
        TableName: process.env.TABLE_NAME!,
        Key: {
          userId,
          subscriptionId,
        },
      })
      .promise();

    return {
      statusCode: 204,
      body: '',
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

export const handler = middy(deleteSubscription).use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
