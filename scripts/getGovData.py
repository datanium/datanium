import urllib.request
from urllib.error import HTTPError
import json

#initialize
#proxy = urllib.request.ProxyHandler({'http': 'x'}) 
#auth = urllib.request.HTTPBasicAuthHandler() 
#opener = urllib.request.build_opener(proxy, auth, urllib.request.HTTPHandler) 
#urllib.request.install_opener(opener)
headers = {'Host': 'data.stats.gov.cn',
		'Proxy-Connection': 'keep-alive',
		'Cache-Control': 'max-age=0',
		'Accept': 'application/json, text/javascript, */*; q=0.01',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36',
		'Referer': 'http://data.stats.gov.cn/workspace/index?m=hgnd', 
		'Accept-Encoding': 'gzip,deflate,sdch',
		'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6'}
		#'Cookie': 'BCSI-CS-d67c9046c8fd9252=2; JSESSIONID=D31A23CDE33899166A12F171948A93F5; BCSI-CS-d289ac54b9abdc1e=2; u=6'} 
children_url = 'http://data.stats.gov.cn/quotas/getchildren'

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
  for i,child in enumerate(target):
    child_list = GetInidcator (child['id'], request_url, dbcode ,level+1 )
    if ( len(child_list)== 0):
      indicator['code'] = child['id']
      indicator['name'] = child['name']
      indicator_list.append(indicator.copy())
    else:
      indicator_list=indicator_list+child_list
  return indicator_list


#get indexes
top_level_indexes = ['A01','A02','A03','A04']

sub_indexes = ['A04060E','A04060A'] 
#for i,top_index in enumerate ( top_level_indexes):
print (GetInidcator ('A01',children_url,'hgnd',1))

#repeat children_url can get indicator list finally 

#get data  -- indicators are embedded in the data
#for i,index in enumerate (sub_indexes):
#  url_string = 'http://data.stats.gov.cn/workspace/index?a=l&tmp=1416106263321&m=hgnd&index='+index+'&region=000000&time=-1%2C1949&selectId=000000&third=region'
#  print (url_string)
#  try:   
#    url = urllib.request.Request(url='http://data.stats.gov.cn/workspace/index?m=hgnd', headers=headers)
#    url = urllib.request.Request (url=url_string, headers=headers)
#    conn = urllib.request.urlopen(url)

	#usually the data only have one line
#    count=1
#    while (count < 2):
#      strr = conn.readline()
#      print(strr)
#      count=count+1

#  except HTTPError as e: 
#    err = e.read() 
#    print('fail----------------') 
#    print(err)
#    continue

#format data so
