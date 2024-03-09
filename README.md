# Welcome to Your CDK TypeScript Project

This project provides a template for developing AWS CDK applications using TypeScript.

## Configuration

The `cdk.json` file configures the CDK Toolkit for executing your application.

## Useful Commands

- `npm run build`: Compiles TypeScript code to JavaScript.
- `npm run watch`: Watches for changes in the TypeScript files and compiles them automatically.
- `npm run test`: Runs the Jest unit tests.
- `npx cdk deploy`: Deploys the stack to your default AWS account and region.
- `npx cdk diff`: Compares the deployed stack with the current state.
- `npx cdk synth`: Generates the CloudFormation template for the stack.

## Building and Deploying the Stack

To build and deploy the stack:

```
npm run build
```

Deploy the stack

```
cdk bootstrap
cdk deploy
```

Alternatively, to deploy using a specific AWS named profile:

```
cdk bootstrap --profile my-profile-name
cdk deploy --profile my-profile-name
```
