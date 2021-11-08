# @article {DBLP:journals/corr/BarriosLAW16,
#   author    = {Federico Barrios and
#              Federico L{\'{o}}pez and
#              Luis Argerich and
#              Rosa Wachenchauzer},
#   title     = {Variations of the Similarity Function of TextRank for Automated Summarization},
#   journal   = {CoRR},
#   volume    = {abs/1602.03606},
#   year      = {2016},
#   url       = {http://arxiv.org/abs/1602.03606},
#   archivePrefix = {arXiv},
#   eprint    = {1602.03606},
#   timestamp = {Wed, 07 Jun 2017 14:40:43 +0200},
#   biburl    = {https://dblp.org/rec/bib/journals/corr/BarriosLAW16},
#   bibsource = {dblp computer science bibliography, https://dblp.org}

import globalVariable

def keywords_eng() :
    from summa import keywords
    import re

    # from nltk.stem import PorterStemmer

    import sys

    # sys.stdout = open('keyword_eng_result.txt','w')

    # with open("ocr_pdf_result.txt") as f:
    #     fullText = f.read()
        
    # print(repr(fullText))


    # textrank 활용
    globalVariable.keywordArr = keywords.keywords(globalVariable.fullText_f).split('\n')

    globalVariable.keywordArr = globalVariable.keywordArr[:5]

    # print("stem 전")
    # print(globalVariable.keywordArr)

    return




