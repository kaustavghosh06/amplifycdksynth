import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

export class AmplifyStack extends cdk.Stack {
  cfnIncludedStack: cfn_inc.CfnInclude;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*const ampifyEnv = process.env.AMPLIFY_ENV;
    const envParams =  */

    // Get env params from amplify-out/amplify-backend-exports.json file

    // The code that defines your stack goes here
    const cfnInclude = new cfn_inc.CfnInclude(this, 'Template', { 
      templateFile: 'amplify-out/root-stack-template.json',
      preserveLogicalIds: true,
      parameters: {
        "DeploymentBucketName": "amplify-cdkeject-dev-142745-deployment",
        "AuthRoleName": "amplify-cdkeject-dev-142745-authRole",
        "UnauthRoleName": "amplify-cdkeject-dev-142745-unauthRole"
      },
      loadNestedStacks: {
        'functioncdkejectfdbf6518': {
          templateFile: 'amplify-out/function/cdkejectfdbf6518/cdkejectfdbf6518-cloudformation-template.json',
          preserveLogicalIds: true
        },
      },
    });

    this.cfnIncludedStack = cfnInclude;

    const includedChildStack = cfnInclude.getNestedStack('functioncdkejectfdbf6518');
    const childStack = includedChildStack.stack;
    const childTemplate = includedChildStack.includedTemplate;

    const LambdaFunction = childTemplate.getResource('LambdaFunction') as lambda.CfnFunction

    LambdaFunction.description = "CDK DESCRIPTION!!!!";

    const role = new iam.Role(this, 'MyRoleWTH', {
      assumedBy: new iam.AccountRootPrincipal(),
    });
    
    role.addToPolicy(new iam.PolicyStatement({
      actions: [
        '*',
      ],
      resources: [LambdaFunction.attrArn],
    }));    

  }
}