import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { PRODUCTION_DOMAIN } from './config';

export class SubscriptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // set the removal policy based on the environment
    const environment = this.node.tryGetContext('env') || 'development';
    const removalPolicy =
      environment === 'production'
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY;

    // DynamoDB Table
    const subscriptionsTable = new dynamodb.Table(this, 'SubscriptionsTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'subscriptionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: removalPolicy,
    });

    // Add GSIs for common query patterns
    subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'byCategory',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'category', type: dynamodb.AttributeType.STRING },
    });

    subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'byRenewalDate',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'nextRenewalDate', type: dynamodb.AttributeType.STRING },
    });

    // Lambda Functions
    const getSubscriptionsFunction = new NodejsFunction(
      this,
      'GetSubscriptionsFunction',
      {
        entry: 'lambda/get-subscriptions.ts',
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        environment: {
          TABLE_NAME: subscriptionsTable.tableName,
        },
      }
    );

    const createSubscriptionFunction = new NodejsFunction(
      this,
      'CreateSubscriptionFunction',
      {
        entry: 'lambda/create-subscription.ts',
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        environment: {
          TABLE_NAME: subscriptionsTable.tableName,
        },
      }
    );

    const updateSubscriptionFunction = new NodejsFunction(
      this,
      'UpdateSubscriptionFunction',
      {
        entry: 'lambda/update-subscription.ts',
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        environment: {
          TABLE_NAME: subscriptionsTable.tableName,
        },
      }
    );

    const deleteSubscriptionFunction = new NodejsFunction(
      this,
      'DeleteSubscriptionFunction',
      {
        entry: 'lambda/delete-subscription.ts',
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_22_X,
        environment: {
          TABLE_NAME: subscriptionsTable.tableName,
        },
      }
    );

    // Grant DynamoDB permissions to Lambda functions
    subscriptionsTable.grantReadData(getSubscriptionsFunction);
    subscriptionsTable.grantWriteData(createSubscriptionFunction);
    subscriptionsTable.grantWriteData(updateSubscriptionFunction);
    subscriptionsTable.grantWriteData(deleteSubscriptionFunction);

    // API Gateway
    const allowedOrigins =
      environment === 'production'
        ? [PRODUCTION_DOMAIN]
        : apigateway.Cors.ALL_ORIGINS;
    const api = new apigateway.RestApi(this, 'SubscriptionsApi', {
      restApiName: 'Subscriptions Service',
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    // API Resources and Methods
    const subscriptions = api.root.addResource('subscriptions');

    subscriptions.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getSubscriptionsFunction)
    );
    subscriptions.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createSubscriptionFunction)
    );

    const subscription = subscriptions.addResource('{subscriptionId}');
    subscription.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(updateSubscriptionFunction)
    );
    subscription.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteSubscriptionFunction)
    );

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
}
