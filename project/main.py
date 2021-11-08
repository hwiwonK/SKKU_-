import globalVariable
from ocr_image import detect_document_uri #이미지에서 텍스트 추출
from ocr_pdf import async_detect_document #pdf에서 텍스트 추출
from keyword_eng import keywords_eng
from keyword_kor import keywords_kor
import sys
import json
import re #정규식 위함

def algoStart(fileName, fileType, userName):

    #fullText 전역변수 설정
    globalVariable.init()
    

    #텍스트 추출 (파일 형식에 따라 구분)
    if (fileType in ['.jpeg', '.png', '.jpg']):
        detect_document_uri(userName, fileName)
    
    elif (fileType == '.pdf'):
        async_detect_document(userName, fileName)

    
    # print(globalVariable.fullText)
    # 텍스트 전처리
    globalVariable.fullText_f = globalVariable.fullText.replace("\n", " ")
    globalVariable.fullText_f = globalVariable.fullText_f.replace(",", "")
    
    #영어, 한국어, .(온점) 남기고 삭제
    re.sub('[^A-Za-z가-힣.]', '', globalVariable.fullText_f)



    #키워드 추출 (언어에 따라 구분)
    if globalVariable.fullText_f.encode().isalpha():
        # print("this is english")
        keywords_eng()
    else:
        # print("this is korean")
        keywords_kor()
    
    return
    



algoStart(sys.argv[1], sys.argv[2], sys.argv[3])

keys = len(globalVariable.keywordArr)

for i in range (0, keys):
    print(globalVariable.keywordArr[i], end='\n')



# print(globalVariable.keywordArr)

# print(globalVariable.keywordArr)

sys.stdout.flush()