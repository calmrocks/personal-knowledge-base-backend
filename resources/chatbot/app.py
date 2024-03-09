import json
import boto3

bedrock = boto3.client(
    service_name='bedrock',
    region_name='us-east-1'
)

# Bedrock Runtime client used to invoke and question the models
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1'
)
def lambda_handler(event, context):
    foundation_models = bedrock.list_foundation_models()
    # matching_model = next((model for model in foundation_models["modelSummaries"] if model.get("modelName") == "Llama 2 Chat 70B"), None)

    matching_model = next((model for model in foundation_models["modelSummaries"] if model.get("modelName") == "Jurassic-2 Ultra"), None)
    print(matching_model)

    question = json.loads(event['body'])['question']
    body = json.dumps(
        {
            "prompt": question,
            "maxTokens": 500,
            "temperature": 0.7,
            "topP": 1,
        }
    )

    # The actual call to retrieve an answer from the model
    response = bedrock_runtime.invoke_model(
        body=body,
        modelId=matching_model["modelArn"],
        accept='application/json',
        contentType='application/json'
    )

    # Extract the answer from the response
    response_body = json.loads(response.get('body').read())
    print(response_body)
    # The response from the model now mapped to the answer
    answer = response_body.get('completions')[0].get('data').get('text')
    print("answer:", answer)

    return {
        'statusCode': 200,
        'body': json.dumps({
            'question': question,
            'answer': answer
        })
    }
