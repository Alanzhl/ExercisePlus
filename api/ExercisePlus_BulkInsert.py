# ***ExercisePlus_BulkInsert***:
# 
# This lambda function is triggered everytime there is an upload event at the S3 storage.
# The function would retrieve the bucket name and filename from S3 event notification, 
# and access the raw dataset by reading the file. Then, it would transform the data and 
# insert them in batch into the respective table in DynamoDB.


import json
import boto3
from urllib.parse import unquote_plus


s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    for record in event['Records']:
        # step 1: read from s3
        bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
        data = s3_client.get_object(Bucket=bucket, Key=key)
        text = data['Body'].read().decode('utf-8')
        text_json = json.loads(text)
        
        # step 2: write to dynamodb in batch
        table = None
        if key == "gyms-my.txt":
            table = dynamodb.Table('ExercisePlus-Gyms')    # specified table name in DynamoDB
        elif key == "parks-my.txt":
            table = dynamodb.Table('ExercisePlus-Parks')    # specified table name in DynamoDB
        if table == None:
            return {
                'statusCode': 200,
                'body': json.dumps('Created file %s, but would not store it in dynamodb.' 
                                    % (key))
            }
        else:
            with table.batch_writer() as batch:
                for item in text_json:
                    batch.put_item(Item=item)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully created the file in S3, and stored it in dynamodb.')
    }
