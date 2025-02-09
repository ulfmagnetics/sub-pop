import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // TODO: Get userId from the JWT token (assuming Cognito integration)
    // const userId = event.requestContext.authorizer?.claims.sub;

    // For now, we'll just use a hardcoded userId for testing
    const userId = 'test-user-id';
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
