# -*- coding: utf-8 -*-
import globalVariable

def keywords_kor() :

    from krwordrank.word import KRWordRank

    
    # wordrank-kr 활용
    min_count = 1   # 단어의 최소 출현 빈도수 (그래프 생성 시), 원래 5
    max_length = 10 # 단어의 최대 길이
    wordrank_extractor = KRWordRank(min_count=min_count, max_length=max_length)

    beta = 0.85    # PageRank의 decaying factor beta
    max_iter = 10
    # # texts = ['예시 문장 입니다', '여러 문장의 list of str 입니다', ... ]
    keywords, rank, graph = wordrank_extractor.extract([globalVariable.fullText_f], beta, max_iter)

    for word, r in sorted(keywords.items(), key=lambda x:x[1], reverse=True)[:30]:
        globalVariable.keywordArr.append(word)
        # print('%8s:\t%.4f' % (word, r))

    globalVariable.keywordArr = globalVariable.keywordArr[:5]
    # print(globalVariable.keywordArr)