import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';

export class PersonalKnowledgeBaseBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const chatbotLambda = new lambda.Function(this, 'ChatbotLambda', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'app.lambda_handler',
      code: lambda.Code.fromAsset('resources/chatbot'),
      timeout: cdk.Duration.seconds(300),
    });

    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:*',
        'bedrock:ListFoundationModels',
        'cloudwatch:*',
      ],
      resources: ['*'],
    });

    chatbotLambda.addToRolePolicy(policy);

    const chatbotApi = new apigateway.LambdaRestApi(this, 'ChatbotApi', {
      handler: chatbotLambda,
      proxy: false,
    });

    const chatbotResource = chatbotApi.root.addResource('chatbot');
    chatbotResource.addMethod('POST', undefined, {
      apiKeyRequired: true,
    });

    const apiKey = chatbotApi.addApiKey('ApiKey');
    const usagePlan = chatbotApi.addUsagePlan('UsagePlan', {
      name: 'ChatbotUsagePlan',
    });
    usagePlan.addApiKey(apiKey);

    usagePlan.addApiStage({
      stage: chatbotApi.deploymentStage,
    });

    new cdk.CfnOutput(this, 'ApiKey', {
      value: apiKey.keyId,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: chatbotApi.url,
    });
  }
}
