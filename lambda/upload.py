import boto3
import os
import json

s3_client = boto3.client('s3')
BUCKET_NAME = os.getenv('BucketName')  # Set your bucket name in environment variables

def lambda_handler(event, context):
    # Parse the request body
    if isinstance(event['body'], str):
        body = json.loads(event['body'])
    else:
        body = event['body']
    
    folder_name = body.get('folderName')  # This will be the case ID folder
    file_name = body.get('fileName')
    file_type = body.get('fileType')
    sub_folder_name = body.get('subFolderName', '')  # Optional, used for audio/video subfolders
    
    # Validate required fields
    if not folder_name or not file_name or not file_type:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'folderName, fileName, and fileType are required'})
        }
    
    # Determine the path structure based on file type and context
    if file_type.startswith("video") or file_type.startswith("audio"):
        if not sub_folder_name:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'subFolderName is required for audio/video files'})
            }
        # For audio/video files, add the provided subfolder name under the main folder
        object_key = f"{folder_name}/{sub_folder_name}/{file_name}"
    elif body.get('isEvidence', False):
        # For evidence files, place them in an 'evidence' subfolder
        object_key = f"{folder_name}/evidence/{file_name}"
    elif body.get('isFIR', False):
        # For FIR files, place them in an 'FIR' subfolder
        object_key = f"{folder_name}/FIR/{file_name}"
    else:
        # Default path without any additional subfolders
        object_key = f"{folder_name}/{file_name}"

    # Generate a pre-signed URL for uploading the file to S3
    try:
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': BUCKET_NAME, 'Key': object_key, 'ContentType': file_type},
            ExpiresIn=3600  # URL expiration time in seconds
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'url': presigned_url})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


{
  "body": {
    "folderName": "case123",
    "fileName": "fir_document.pdf",
    "fileType": "application/pdf",
    "isFIR": true
  }
}