import globalVariable


def detect_document_uri(userName, fileName):
    """Detects document features in the file located in Google Cloud
    Storage."""
    from google.cloud import vision

    # 결과 테스트
    import sys
    # sys.stdout = open('ocr_image_result.txt','w')

    bucketName = "graduation_bucket"
    client = vision.ImageAnnotatorClient()

    image = vision.Image(
        source = vision.ImageSource(gcs_image_uri=f"gs://{bucketName}/{fileName}")
    )

    response = client.document_text_detection(image=image)

#     const [annotation] = textDetections.textAnnotations;
#   const text = annotation ? annotation.description : '';
#   console.log('Extracted text from image:', text);


    globalVariable.fullText += response.text_annotations[0].description

    # print("최종 결과")

    # print(globalVariable.fullText)    

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))
    
    return


    