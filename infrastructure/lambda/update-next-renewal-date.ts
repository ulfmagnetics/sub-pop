import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Fetch all the Subscription rows from Dynamo that are not inactive
    // and which have a nextRenewal date that is in the past
    const dynamodb = new DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.TABLE_NAME!,
      FilterExpression: 'nextRenewal < :now AND NOT (#status = :inactive)',
      ExpressionAttributeValues: {
        ':now': new Date().toISOString(),
        ':inactive': 'inactive',
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    };
    console.log('Querying DynamoDB with params:', JSON.stringify(params));
    const result = await dynamodb.scan(params).promise();

    // Iterate over the results and update the nextRenewal date to be either:
    // - the next month if the billing cycle is monthly
    // - the next year if the billing cycle is annual
    const updatePromises = result.Items?.map(async (item) => {
      const nextRenewalDate = new Date(item.nextRenewal);
      if (item.billingCycle === 'monthly') {
        nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
      } else if (item.billingCycle === 'annual') {
        nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);
      }

      const updateParams = {
        TableName: process.env.TABLE_NAME!,
        Key: {
          userId: item.userId,
          subscriptionId: item.subscriptionId,
        },
        UpdateExpression: 'SET #nextRenewal = :nextRenewal',
        ExpressionAttributeValues: {
          ':nextRenewal': nextRenewalDate.toISOString(),
        },
        ExpressionAttributeNames: {
          '#nextRenewal': 'nextRenewal',
        },
      };
      console.log(
        'Updating DynamoDB with params:',
        JSON.stringify(updateParams)
      );

      // pass a callback to the update function to log the result of the update
      const updateResult = await dynamodb.update(updateParams).promise();
      console.log('Update successful:', updateResult);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: (error as Error).message,
      }),
    };
  }
};
