import urllib.request
from urllib.error import HTTPError
import json

#initialize
headers = {'Host': 'data.stats.gov.cn',
		'Proxy-Connection': 'keep-alive',
		'Cache-Control': 'max-age=0',
		'Accept': 'application/json, text/javascript, */*; q=0.01',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36',
		'Referer': 'http://data.stats.gov.cn/workspace/index?m=hgnd', 
		'Accept-Encoding': 'gzip,deflate,sdch',
		'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'}
children_url = 'http://data.stats.gov.cn/quotas/getchildren'
data_url = 'http://data.stats.gov.cn/workspace/index?'
country_region_code = '000000'
all_provinces_region_code = '110000,120000,130000,140000,150000,210000,220000,230000,310000,320000,330000,340000,350000,360000,370000,410000,420000,430000,440000,450000,460000,500000,510000,520000,530000,540000,610000,620000,630000,640000,650000'

#definitions
def GetInidcator( index, request_url, dbcode,level ):
  indicator_list=[]
  indicator={}
  request_data = "code="+index+"&level="+str(level)+"&dbcode="+dbcode+"&dimension=zb"
  try:
    url = urllib.request.Request(url=request_url,data=request_data.encode(encoding="utf-8"),headers=headers)
    conn = urllib.request.urlopen(url)
    index_str = conn.readline().decode("utf-8")
  except HTTPError as e:
    return indicator_list
  if (len(index_str)==0):
    return indicator_list
  else:
    target = json.loads(index_str)
  for child in target:
    child_list = GetInidcator (child['id'], request_url, dbcode ,level+1 )
    if ( len(child_list)== 0):
      indicator['code'] = child['id']
      indicator['name'] = child['name']
      indicator['frequency'] = dbcode
      indicator_list.append(indicator.copy())
    else:
      indicator_list=indicator_list+child_list
  return indicator_list

def GetData ( index_list, request_url, dbcode, region ):
  indicator_list = []
  data_list = []
  for index in index_list:
    indicator_list = indicator_list + GetInidcator ( index ,children_url, dbcode ,1)
  for indicator in indicator_list:
    url_string = data_url + 'a=l&m='+ indicator['frequency'] +'&index='+indicator['code']+'&region='+ region + '&time=-1%2C1949&selectId='+region +'&third=region'
    try:
      url = urllib.request.Request (url=url_string, headers=headers)
      conn = urllib.request.urlopen(url)
      data_str = conn.readline().decode("utf-8")
    except HTTPError as e: 
      err = e.read() 
      print('fail----------------') 
      print(err)
      continue
    target = json.loads(data_str)
    data_list.append (target.copy())
  return data_list

#get country annual data - hgnd
top_level_indexes = ['A01','A02']
print ( GetData (top_level_indexes, data_url, 'hgnd', '000000'))

#get country monthly data - hgyd

#get country quarterly data - hgjd

#get monthly region data - fsyd

#get quarterly region data - fsjd

#get annual region data - fsnd
