import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import middy from 'middy';
import cors from '@middy/http-cors';
import { ALLOWED_ORIGIN_PRODUCTION } from './constants';

const dynamodb = new DynamoDB.DocumentClient();

const getSubscription = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // TODO: Get userId from the JWT token (assuming Cognito integration)
    // const userId = event.requestContext.authorizer?.claims.sub;

    // For now, we'll just use a hardcoded userId for testing
    const userId = 'test-user-id';

    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const params = {
      TableName: process.env.TABLE_NAME!,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
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

export const handler = middy(getSubscription).use(
  cors({
    origin: '*', // Allow all origins for development
    credentials: true,
  })
);
