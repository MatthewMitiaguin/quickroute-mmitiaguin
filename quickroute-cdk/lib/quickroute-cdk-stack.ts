import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

export class QuickrouteCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiKeyParameter = new ssm.StringParameter(this, 'TomTomApiKey', {
      parameterName: '/address-service/tomtom-api-key',
      stringValue: process.env.TOMTOM_API_KEY || 'dummy-value',
      description: 'TomTom API Key for Address Service',
      tier: ssm.ParameterTier.STANDARD
    });

    const quickrouteLambda = new nodejs.NodejsFunction(this, 'QuickRouteFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/quickroute-handler.ts'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    quickrouteLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ssm:GetParameter'],
      resources: [apiKeyParameter.parameterArn],
    }));

    const api = new apigateway.RestApi(this, 'QuickRouteApi', {
      restApiName: 'QuickRoute API',
      description: 'API for QuickRoute address search'
    });

    const addresses = api.root.addResource('addresses');
    addresses.addMethod('GET', new apigateway.LambdaIntegration(quickrouteLambda), {
      requestParameters: {
        'method.request.querystring.query': true 
      }
    });

    // Output 

    // API Key ARN
    new cdk.CfnOutput(this, 'ApiKeyParameterName', {
      value: '/address-service/tomtom-api-key',
      description: 'SSM Parameter name for TomTom API key',
    });

    // LAMBDA ARN
    new cdk.CfnOutput(this, 'LambdaArn', {
      value: quickrouteLambda.functionArn,
      description: 'QuickRoute Lambda ARN',
    });

    // APi Gateway
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
}
