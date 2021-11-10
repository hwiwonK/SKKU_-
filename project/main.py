import globalVariable
from ocr_image import detect_document_uri #이미지에서 텍스트 추출
from ocr_pdf import async_detect_document #pdf에서 텍스트 추출
from keyword_eng import keywords_eng
from keyword_kor import keywords_kor
import sys
import json
import re #정규식 위함


from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# 한국어인지 영어인지 체크
def checkLanguage():
    korN = 0
    engN = 0

    reg = re.compile(r'[가-힣]')

    korString = reg.findall(globalVariable.fullText_f)

    if len(korString) > 0 :
        return "kor"
    else :
        return "eng"

    # for c in globalVariable.fullText_f:
    #     if reg.match(c) :
    #         engN += 1
    #     else:
    #         korN += 1

    #     if (korN > 0) :
    #         return "kor"

    # return "eng"

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
    globalVariable.fullText_f = re.sub('[^A-Za-z가-힣. ]', "", globalVariable.fullText_f)

    #어절 단위로 토큰화
    word_tokens = word_tokenize(globalVariable.fullText_f)

    # 불용어 모음
    stopwordEng = set(stopwords.words('english'))
    with open('korStopWords.txt', 'r') as f:
        readData = f.read()
    stopwordKor = readData.splitlines()

    # print(globalVariable.fullText_f)

    lanResult = checkLanguage()

    # print(stopwordKor)

    if lanResult == "eng":
        # print("this is english")
        
        globalVariable.fullText_f = ""

        for token in word_tokens:
            if token not in stopwordEng:
                globalVariable.fullText_f += (token + ' ')

        # print(globalVariable.fullText_f)

        keywords_eng()

    else :
        # print("this is korean")

        globalVariable.fullText_f = ""

        for token in word_tokens:
            if token not in stopwordKor:
                globalVariable.fullText_f += (token + ' ')

        # print(globalVariable.fullText_f)


        keywords_kor()
    
    return
    


algoStart(sys.argv[1], sys.argv[2], sys.argv[3])


keys = len(globalVariable.keywordArr)

for i in range (0, keys):
    print(globalVariable.keywordArr[i], end='\n')



# print(globalVariable.keywordArr)

# print(globalVariable.keywordArr)

sys.stdout.flush()