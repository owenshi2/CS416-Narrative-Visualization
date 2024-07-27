import pandas as pd
import numpy as np

data = pd.read_csv('./data/student-data.csv')
GPdata = data[(data['address'] == 'U')]
GPdataAve = GPdata.filter(items=["school", "sex", "age", "studytime", "failures"])
GPdataAve["averageGrade"] = round(GPdata[['G1', 'G2', 'G3']].mean(axis=1) / 20 * 100, 2)
GPdataAve["alcoholism1to5"] = round(GPdata[['Dalc', 'Walc']].mean(axis=1)).astype(int)
GPdataAve.to_csv('./data/student-data-clean-noindex.csv', encoding='utf-8', index=False)
