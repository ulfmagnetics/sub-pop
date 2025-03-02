import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import middy from 'middy';
import cors from '@middy/http-cors';
import { ALLOWED_ORIGIN_PRODUCTION } from './constants';

const dynamodb = new DynamoDB.DocumentClient();

const updateSubscription = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.claims.sub;
    const subscriptionId = event.pathParameters?.subscriptionId;

    if (!userId || !subscriptionId || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    const updates = JSON.parse(event.body);

    // Build update expression
    const updateExpression =
      'set ' +
      Object.keys(updates)
        .map((key) => `#${key} = :${key}`)
        .join(', ');

    const expressionAttributeNames = Object.keys(updates).reduce(
      (acc, key) => ({ ...acc, [`#${key}`]: key }),
      {}
    );

    const expressionAttributeValues = Object.entries(updates).reduce(
      (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
      {}
    );

    const params = {
      TableName: process.env.TABLE_NAME!,
      Key: {
        userId,
        subscriptionId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
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

export const handler = middy(updateSubscription).use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
