# make csv to json

import sys
import csv
import json

CDB1 = "CDB1.csv" # Industry
CDB2 = "CDB2.csv" # Sector (unused)
CDB3 = "CDB3.csv" # Stock

CDB1_DATA = []
CDB2_DATA = []
CDB3_DATA = []

if len(sys.argv) == 2:
    CDB1 = str(sys.argv[1])
    CDB3 = str(sys.argv[2])

# helper function
def roundne(x):
    if x == "#VALUE!" or x == "#DIV/0!" or x == '':
        return ''
    return round(float(x), 5) 

def p2f(x):
    # convert percentage to float
    if x == "#VALUE!" or x == "#DIV/0!" or x == '':
        return ''
    return float(x.strip('%'))/100


def csv2json(csvfile, type):
    reader = csv.DictReader(csvfile)
    for row in reader:
        # current logic: if the value is #VALUE! or #DIV/0! or '', then we do not push this row to the array
        # so before we push, we need to check the value of each attr
        if row['時富雷達 (CR)'] == "#VALUE!" or row['時富雷達 (CR)'] == "#DIV/0!" or row['時富雷達 (CR)'] == '':
            continue
        if row['基本分析分數'] == "#VALUE!" or row['基本分析分數'] == "#DIV/0!" or row['基本分析分數'] == '':
            continue
        if row['技術分析分數'] == "#VALUE!" or row['技術分析分數'] == "#DIV/0!" or row['技術分析分數'] == '':
            continue
        if row['銷售額增長标准分数'] == "#VALUE!" or row['銷售額增長标准分数'] == "#DIV/0!" or row['銷售額增長标准分数'] == '':
            continue
        if row['債務股本比例标准分数'] == "#VALUE!" or row['債務股本比例标准分数'] == "#DIV/0!" or row['債務股本比例标准分数'] == '':
            continue
        if row['淨收入改善标准分数'] == "#VALUE!" or row['淨收入改善标准分数'] == "#DIV/0!" or row['淨收入改善标准分数'] == '':
            continue
        if row['保留盈餘增長标准分数'] == "#VALUE!" or row['保留盈餘增長标准分数'] == "#DIV/0!" or row['保留盈餘增長标准分数'] == '':
            continue
        if row['基因分析標準分數'] == "#VALUE!" or row['基因分析標準分數'] == "#DIV/0!" or row['基因分析標準分數'] == '':
            continue
        if type == "CDB1":
            if row['調整後移動平均線标准分数 (5日)'] == "#VALUE!" or row['調整後移動平均線标准分数 (5日)'] == "#DIV/0!" or row['調整後移動平均線标准分数 (5日)'] == '':
                continue
            if row['移動平均線 (5日)'] == "#VALUE!" or row['移動平均線 (5日)'] == "#DIV/0!" or row['移動平均線 (5日)'] == '':
                continue
            if row['布林线指數标准分数'] == "#VALUE!" or row['布林线指數标准分数'] == "#DIV/0!" or row['布林线指數标准分数'] == '':
                continue
        if row['相對強弱指數标准分数'] == "#VALUE!" or row['相對強弱指數标准分数'] == "#DIV/0!" or row['相對強弱指數标准分数'] == '':
            continue
        if type == "CDB3":
            if row['布蘭標準差分數'] == "#VALUE!" or row['布蘭標準差分數'] == "#DIV/0!" or row['布蘭標準差分數'] == '':
                continue
            if row['移動平均線 (10日)'] == "#VALUE!" or row['移動平均線 (10日)'] == "#DIV/0!" or row['移動平均線 (10日)'] == '':
                continue
        if row['技術分析標準分數'] == "#VALUE!" or row['技術分析標準分數'] == "#DIV/0!" or row['技術分析標準分數'] == '':
            continue
        if row['相對強弱指數 (9日)'] == "#VALUE!" or row['相對強弱指數 (9日)'] == "#DIV/0!" or row['相對強弱指數 (9日)'] == '':
            continue
        if row['布林线 (上線) (20日)'] == "#VALUE!" or row['布林线 (上線) (20日)'] == "#DIV/0!" or row['布林线 (上線) (20日)'] == '':
            continue
        if row['布林线 (下線) (20日)'] == "#VALUE!" or row['布林线 (下線) (20日)'] == "#DIV/0!" or row['布林线 (下線) (20日)'] == '':
            continue

        # 2. change the attr to float
        row['時富雷達 (CR)'] = roundne(row['時富雷達 (CR)'])
        row['基本分析分數'] = roundne(row['基本分析分數'])
        row['技術分析分數'] = roundne(row['技術分析分數'])
        row['銷售額增長标准分数'] = roundne(row['銷售額增長标准分数'])
        row['債務股本比例标准分数'] = roundne(row['債務股本比例标准分数'])
        row['淨收入改善标准分数'] = roundne(row['淨收入改善标准分数'])
        row['保留盈餘增長标准分数'] = roundne(row['保留盈餘增長标准分数'])
        row['基因分析標準分數'] = roundne(row['基因分析標準分數'])
        if type == "CDB1":
            row['調整後移動平均線标准分数 (5日)'] = roundne(row['調整後移動平均線标准分数 (5日)'])
            row['移動平均線 (5日)'] = roundne(row['移動平均線 (5日)'])
        row['相對強弱指數标准分数'] = roundne(row['相對強弱指數标准分数'])
        if type == "CDB3":
            row['布蘭標準差分數'] = roundne(row['布蘭標準差分數'])
            row['移動平均線 (10日)'] = roundne(row['移動平均線 (10日)'])
            row['個股代號／公司名字'] = row['個股代號／公司名字']
        row['技術分析標準分數'] = roundne(row['技術分析標準分數'])
        row['相對強弱指數 (9日)'] = roundne(row['相對強弱指數 (9日)'])
        row['布林线 (上線) (20日)'] = roundne(row['布林线 (上線) (20日)'])
        row['布林线 (下線) (20日)'] = roundne(row['布林线 (下線) (20日)'])
        row['波幅指數 (10日)'] = roundne(row['波幅指數 (10日)'])

        row['基本分析比重'] = p2f(row['基本分析比重'])
        row['技術分析比重'] = p2f(row['技術分析比重'])

        """ OPT: Using english key
        row['CR'] = roundne(row.pop('時富雷達 (CR)'))
        row['industry'] = row.pop('行業')
        row['fund_weight'] = p2f(row.pop('基本分析比重'))
        row['tech_weight'] = p2f(row.pop('技術分析比重'))
        row['fund_score'] = roundne(row.pop('基本分析分數'))
        row['tech_score'] = roundne(row.pop('技術分析分數'))
        row['sales_growth'] = roundne(row.pop('銷售額增長标准分数'))
        row['debt_ratio'] = roundne(row.pop('債務股本比例标准分数'))
        row['net_income'] = roundne(row.pop('淨收入改善标准分数'))
        row['capital_return'] = roundne(row.pop('資本回報标准分数'))
        row['retained_earning'] = roundne(row.pop('保留盈餘增長标准分数'))
        row['gene_analysis'] = roundne(row.pop('基因分析標準分數'))
        if type == "CDB1":
            row['adj_moving_average'] = roundne(row.pop('調整後移動平均線标准分数 (5日)'))
            row['moving_average'] = roundne(row.pop('移動平均線 (5日)'))
        row['relative_strength'] = roundne(row.pop('相對強弱指數标准分数'))
        if type == "CDB3": 
            row['bollinger'] = roundne(row.pop('布蘭標準差分數'))
            row['moving_average'] = roundne(row.pop('移動平均線 (10日)'))
        row['tech_analysis'] = roundne(row.pop('技術分析標準分數'))
        row['relative_strength_9'] = roundne(row.pop('相對強弱指數 (9日)'))
        row['bollinger_upper'] = roundne(row.pop('布林线 (上線) (20日)'))
        row['bollinger_lower'] = roundne(row.pop('布林线 (下線) (20日)'))
        row['amplitude'] = roundne(row.pop('波幅指數 (10日)'))
        """

        if type == "CDB3":
            row.pop('TA3')

        row.pop('TA4')
        row.pop('TA5')

        # 2. write to array
        if type == "CDB3":
            CDB3_DATA.append(row)
        elif type == "CDB1":
            CDB1_DATA.append(row)


# data sample of each row CDB3

# {'個股代號': '2382 HK', '個股代號／公司名字': '2382 HK/ 舜宇光學科技', '時富雷達 (CR)': '0.41', 
# '行業': '資訊科技', '基本分析比重': '40.0%', '技術分析比重': '60.0%', '基本分析分數': '2.66', 
# '技術分析分數': '0.52', '銷售額增長标准分数': '-0.6693529898', '債務股本比例标准分数': '-1.420238048', 
# '淨收入改善标准分数': '-1.445419767', '資本回報标准分数': '-3.166124636', 
# '保留盈餘增長标准分数': '-5', '基因分析標準分數': '2.659772912', 'TA3': '', 'TA4': '', 'TA5': '', 
# '相對強弱指數标准分数': '0', '布蘭標準差分數': '1.047143579', '技術分析標準分數': '0.5235717897', 
# '相對強弱指數 (9日)': '63.3522', '布林线 (上線) (20日)': '99.007', '布林线 (下線) (20日)': '83.183', 
# '波幅指數 (10日)': '60.072', '移動平均線 (10日)': '93.09'}

# data sample of each row CDB1
# 行業	時富雷達 (CR)	行業	基本分析比重	技術分析比重	基本分析分數	技術分析分數	
# 銷售額增長标准分数	債務股本比例标准分数	淨收入改善标准分数	資本回報标准分数	保留盈餘增長标准分数	
# 基因分析標準分數	TA4	TA5	調整後移動平均線标准分数 (5日)	相對強弱指數标准分数	相對強弱指數标准分数	
# 技術分析標準分數	相對強弱指數 (9日)	布林线 (上線) (20日)	布林线 (下線) (20日)	波幅指數 (10日)	移動平均線 (5日)

with open(CDB3, 'r') as f:
    csv2json(f, "CDB3")
    # write to json file
    with open('CDB3.json', 'w') as f:
        json.dump(CDB3_DATA, f, ensure_ascii=False)

with open(CDB1, 'r') as f:
    csv2json(f, "CDB1")
    # write to json file
    with open('CDB1.json', 'w') as f:
        json.dump(CDB1_DATA, f, ensure_ascii=False)
