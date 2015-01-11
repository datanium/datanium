import requests
import json
import timeit
import time
import io
import os
import itertools
from pymongo import MongoClient
from multiprocessing.dummy import Pool as ThreadPool
from functools import partial

class Static:
    headers = {'Host': 'data.stats.gov.cn',
		'Proxy-Connection': 'keep-alive',
		'Cache-Control': 'max-age=0',
		'Accept': 'application/json, text/javascript, */*; q=0.01',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36',
		'Referer': 'http://data.stats.gov.cn/workspace/index?m=hgnd', 
		'Accept-Encoding': 'gzip,deflate,sdch',
		'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'}
    prefix = 'CHNNS'
    request_url_init = 'http://data.stats.gov.cn/quotas/init'
    request_url_indicator = 'http://data.stats.gov.cn/quotas/getchildren'
    request_url_data = 'http://data.stats.gov.cn/workspace/index'
    output_folder = '/Users/Puffy/Works/data_output/TONGJIJU'
    database_name = 'datanium'
    indicator_col_name = 'indicator_test'
    dataset_col_name = 'dataset_test'
    date_range = '1960:2013'
    mongo_url = 'localhost'
    ## mongo_url = 'www.dtnium.com'
    mongo_port = 27017

def load_indicator_init(dbcode):
    ## load first level of tree by dbcode 'hgnd/hgyd'
    print("load indicator categories...")
    
    static = Static()
    indicator_categories=[]
    r_params = {'dbcode': dbcode}
    r = requests.get(static.request_url_init, params=r_params)
    indicator_categories = json.loads(r.text)
    print(str(len(indicator_categories)) + " indicator categories are loaded...")
    
    return indicator_categories
    
def load_indicators_monthly(is_incremental):
    ## load indicators for monthly data
    print("load indicators for monthly...")
    all_start = timeit.default_timer()
    
    static = Static()
    indicator_array = []
    indicator_categories = load_indicator_init('hgyd')
    for cate in indicator_categories:
        if(int(cate['pId']) > 0):
            print(cate['id'] + ' - ' + cate['name'])
            indicator_array.extend(load_children(cate, 'hgyd'))

    print(str(len(indicator_array)) + " indicators are loaded for monthly...\n")
    ## print(indicator_array)

    ## insert data to MongoDB
    client = MongoClient(static.mongo_url, static.mongo_port)
    db = client[static.database_name]
    indicator_col = db[static.indicator_col_name]
    if not is_incremental:
        indicator_col.drop()
        
    for indicator_rec in indicator_array:
        pk = indicator_col.insert(indicator_rec)

    print("total records: " + str(indicator_col.count()))
    print("total time cost: " + str(round(timeit.default_timer() - all_start)) + 's')

def load_children(parent, dbcode):
    ## load children nodes by parent node
    ## print(parent['id'] + ' - ' + parent['name'] + ' - isData:' + parent['ifData'])
    
    static = Static()
    tmp_indicator_list = []
    r_params = {'code': parent['id'], 'dbcode': dbcode, 'dimension': 'zb'}
    r = requests.get(static.request_url_indicator, params=r_params)
    children = json.loads(r.text)
    for child in children:
        if(int(child['ifData']) == 1):
            indicator_key = static.prefix + '_' + child['id']
            data_type = 'number'
            if(child['name'].find('率') > -1 or child['name'].find('百分比') > -1):
                data_type = 'percentage'
            topics = []
            indicator_rec = {'indicator_key': indicator_key, 'original_id': child['id'], 'indicator_text': child['name'], 'data_type': data_type, 'sourceNote': '', 'topics': topics, 'data_source': '国家统计局', 'dimension': [{'dimension_key': 'year', 'dimension_text': '年'}, {'dimension_key': 'month', 'dimension_text': '月'}, ]}
            tmp_indicator_list.append(indicator_rec)
        else:
            tmp_indicator_list.extend(load_children(child, dbcode))
    return tmp_indicator_list
                

if __name__ == '__main__':
    load_indicators_monthly(True)
