# import json
# import gzip
#
# # 读取JSON文件内容
# with open('three.cad-master/demo/cube-with-hole.json', 'r') as f:
#     data = json.load(f)
#
# # 将JSON数据转为字符串
# json_str = json.dumps(data)
#
# # 将字符串压缩为gzip格式
# with gzip.open('cube-with-hole.json.gz', 'wb') as f:
#     f.write(json_str.encode('utf-8'))

import gzip
import json

# 打开原始 JSON 文件并读取数据
with open('myExample.json', 'rt', encoding='utf-8') as file:
    data = file.read()

# 将数据转换为 JSON 格式（如果它还不是）
data_json = json.loads(data)

# 压缩 JSON 数据并保存为 GZ 文件
with gzip.open('myExample.json.gz', 'wt', encoding='utf-8') as zipfile:
    json.dump(data_json, zipfile)
