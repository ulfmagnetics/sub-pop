import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { PRODUCTION_DOMAIN } from './config';

export class SubscriptionStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

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
      indexName: 'serviceName',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'serviceName', type: dynamodb.AttributeType.STRING },
    });

    subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'nextRenewal',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'nextRenewal', type: dynamodb.AttributeType.STRING },
    });

    subscriptionsTable.addGlobalSecondaryIndex({
      indexName: 'cost',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'cost', type: dynamodb.AttributeType.NUMBER },
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

    // Create a Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'SubscriptionsUserPool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    // Create a User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      generateSecret: false,
    });

    // Create an Identity Pool
    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    // Create an IAM role for authenticated users
    const authenticatedRole = new iam.Role(this, 'CognitoAuthenticatedRole', {
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
      ],
    });

    // Attach the authenticated role to the identity pool
    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'IdentityPoolRoleAttachment',
      {
        identityPoolId: identityPool.ref,
        roles: {
          authenticated: authenticatedRole.roleArn,
        },
      }
    );

    // Create a Cognito User Pool Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      'Authorizer',
      {
        cognitoUserPools: [this.userPool],
      }
    );

    // API Resources and Methods
    const subscriptions = api.root.addResource('subscriptions');

    subscriptions.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getSubscriptionsFunction),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }
    );
    subscriptions.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createSubscriptionFunction),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }
    );

    const subscription = subscriptions.addResource('{subscriptionId}');
    subscription.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(updateSubscriptionFunction),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }
    );
    subscription.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteSubscriptionFunction),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }
    );

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    // Output the User Pool ID and App Client ID
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: identityPool.ref,
      description: 'Cognito Identity Pool ID',
    });
  }
}
