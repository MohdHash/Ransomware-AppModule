import boto3
import os
import json

s3_client = boto3.client('s3')
BUCKET_NAME = os.getenv('BucketName')  # Ensure the bucket name is set in environment variables

def lambda_handler(event, context):
    # Check if event['body'] is already a dictionary
    if isinstance(event['body'], str):
        body = json.loads(event['body'])
    else:
        body = event['body']
    
    # Extract the concatenation ID from the event body
    concatenation_id = body.get('concatenationId')
    
    # Validate that concatenationId is provided
    if not concatenation_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'concatenationId is required'})
        }
    
    # Construct the prefix to search for files within the audio folder under the specified concatenation ID
    folder_prefix = f"{concatenation_id}/audio/"
    
    try:
        # List all objects in the specified folder
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_prefix)
        
        # Check if the folder is empty or doesn't exist
        if 'Contents' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'No files found in the specified audio folder.'})
            }
        
        # Generate a pre-signed URL for each file in the audio folder
        file_urls = []
        for obj in response['Contents']:
            file_key = obj['Key']
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': file_key},
                ExpiresIn=3600  # URL expires in 1 hour
            )
            file_urls.append({
                'fileName': file_key.split('/')[-1],  # Get only the file name, not the full path
                'url': presigned_url
            })

        return {
            'statusCode': 200,
            'body': json.dumps({'files': file_urls})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


{
  "body": {
    "concatenationId": "2a122916-3ad7-4854-9031-abbd46ca3286"
  }
}