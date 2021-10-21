import globalVariable

# pdf 에서 텍스트 추출
# 텍스트 추출 결과 google cloud storage에 저장됨
# 파일 이름으로 gcs에 폴더 생성하여 결과 저장 -> 파일 이름으로 된 폴더 내에 있는 결과 목록 가져오기

def async_detect_document(userName, fileName):

    from google.cloud import vision
    from google.cloud import storage
    import json
    # from google.protobuf import json_format

    # 결과 테스트
    import sys
    sys.stdout = open('ocr_pdf_result.txt','w')
    
    bucketName = "graduation_bucket"

    client = vision.ImageAnnotatorClient()

    # Supported mime_types are: 'application/pdf' and 'image/tiff'
    mime_type = 'application/pdf'

    # How many pages should be grouped into each json output file.
    batch_size = 20

    feature = vision.Feature(
        type_=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)

    gcs_source_uri = f"gs://{bucketName}/files/{userName}/{fileName}"

    gcs_source = vision.GcsSource(uri=gcs_source_uri)
    input_config = vision.InputConfig(
        gcs_source=gcs_source, mime_type=mime_type)

    # 폴더 알아서 생성되는지 확인
    gcs_destination_uri = f"gs://{bucketName}/results/{userName}/{fileName}/"
    gcs_destination = vision.GcsDestination(uri=gcs_destination_uri) #배치 추가 가능. default = 20

    output_config = vision.OutputConfig(
        gcs_destination=gcs_destination)

    async_request = vision.AsyncAnnotateFileRequest(
        features=[feature], input_config=input_config,
        output_config=output_config)

    operation = client.async_batch_annotate_files(
        requests=[async_request])

    print('Waiting for the operation to finish.')
    operation.result(timeout=420)

    print("done")

    #==============================================================
    # fullText 추출하기
    storage_client = storage.Client()

    prefix = f"results/{userName}/{fileName}/"
    bucket = storage_client.get_bucket(bucketName)

    # List objects with the given prefix.
    blob_list = list(bucket.list_blobs(prefix=prefix))
    print('Output files:')
    for blob in blob_list:
        print(blob.name)
        json_string = blob.download_as_string()
        response = json.loads(json_string)

        pageLen = len(response['responses'])

        for i in range (0, pageLen):
            page_response = response['responses'][i]
            globalVariable.fullText += page_response['fullTextAnnotation']['text']

    # Process the first output file from GCS.
    # Since we specified batch_size=2, the first response contains
    # the first two pages of the input file.

    
    print('Full text:\n')
    print(globalVariable.fullText)