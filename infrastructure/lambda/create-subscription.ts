import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // TODO: Get userId from the JWT token (assuming Cognito integration)
    // const userId = event.requestContext.authorizer?.claims.sub;

    // For now, we'll just use a hardcoded userId for testing
    const userId = 'test-user-id';

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
