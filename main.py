import globalVariable
from ocr_image import detect_document_uri #이미지에서 텍스트 추출
from ocr_pdf import async_detect_document #pdf에서 텍스트 추출

#fullText 전역변수 설정
globalVariable.init()

filename = 'image_eng.jpeg'
username = "hwiwon"

filename2 = 'pdf_eng2.pdf'


#이미지 텍스트 추출
detect_document_uri(username, filename)
async_detect_document(username, filename2)

#pdf 텍스트 추출
