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

    let result;
    try {
      console.log('Querying DynamoDB with params:', JSON.stringify(params));
      result = await dynamodb.scan(params).promise();
      console.log('Successfully queried DynamoDB');
    } catch (error) {
      console.error('Failed to query DynamoDB:', error);
      throw error;
    }

    // Iterate over the results and update the nextRenewal date to be either:
    // - the next month if the billing cycle is monthly
    // - the next year if the billing cycle is annual
    const updatePromises = result.Items?.map(async (item) => {
      const nextRenewalDate = new Date(item.nextRenewal);
      const originalDay = nextRenewalDate.getDate();

      if (item.billingCycle === 'monthly') {
        // Move to the first of the next month
        nextRenewalDate.setDate(1);
        nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

        // Try to set the original day, but don't exceed the month's last day
        const lastDayOfMonth = new Date(
          nextRenewalDate.getFullYear(),
          nextRenewalDate.getMonth() + 1,
          0
        ).getDate();
        nextRenewalDate.setDate(Math.min(originalDay, lastDayOfMonth));
      } else if (item.billingCycle === 'annual') {
        // Same logic for annual renewals
        const originalMonth = nextRenewalDate.getMonth();
        nextRenewalDate.setDate(1);
        nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);

        // Check the last day of the target month
        const lastDayOfMonth = new Date(
          nextRenewalDate.getFullYear(),
          originalMonth + 1,
          0
        ).getDate();
        nextRenewalDate.setDate(Math.min(originalDay, lastDayOfMonth));
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

      try {
        console.log(
          'Starting DynamoDB update with params:',
          JSON.stringify(updateParams)
        );
        const updateResult = await dynamodb.update(updateParams).promise();
        console.log('Update successful:', JSON.stringify(updateResult));
      } catch (error) {
        console.error(
          'Failed to update item:',
          JSON.stringify(updateParams),
          error
        );
        throw error; // Re-throw to be caught by the outer try-catch
      }
    });

    // Wait for all updates to complete
    if (updatePromises) {
      await Promise.all(updatePromises);
    }

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
