# -*- coding: utf-8 -*-

from krwordrank.word import KRWordRank

keywordArr = []
fullText = ""
# 텍스트 전처리
fullText_f = fullText.replace("\n", " ")

# wordrank-kr 활용
min_count = 5   # 단어의 최소 출현 빈도수 (그래프 생성 시)
max_length = 10 # 단어의 최대 길이
wordrank_extractor = KRWordRank(min_count=min_count, max_length=max_length)

beta = 0.85    # PageRank의 decaying factor beta
max_iter = 10
# # texts = ['예시 문장 입니다', '여러 문장의 list of str 입니다', ... ]
texts = [fullText_f]
keywords, rank, graph = wordrank_extractor.extract(texts, beta, max_iter)

for word, r in sorted(keywords.items(), key=lambda x:x[1], reverse=True)[:30]:
    keywordArr.append(word)
    # print('%8s:\t%.4f' % (word, r))

keywordArr = keywordArr[:5]
print(keywordArr)