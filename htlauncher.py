import os
import shutil
from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import pandas as pd
import re

app = Flask(__name__)


@app.route('/process', methods=['POST'])
def process_files():
    try:
        # 获取上传的源目录路径和其他参数
        src_dir = request.form.get('src_dir')
        dst_dir = request.form.get('dst_dir')
        keywords = request.form.get('keywords').split(';')
        numbers = request.form.get('numbers').split(';')

        # 检查和创建目标目录
        if not os.path.exists(dst_dir):
            os.makedirs(dst_dir)

        # 复制和重命名HTML文件
        for root, dirs, files in os.walk(src_dir):
            for file in files:
                if file.endswith(".html"):
                    src_file = os.path.join(root, file)
                    dst_file = os.path.join(
                        dst_dir, os.path.basename(root) + ".html")
                    shutil.copy2(src_file, dst_file)

        # 搜索关键字并生成结果
        results = {}
        for file in os.listdir(dst_dir):
            if file.endswith(".html"):
                with open(os.path.join(dst_dir, file), 'r', encoding='utf-8') as f:
                    contents = f.read()
                    soup = BeautifulSoup(contents, 'html.parser')
                    text = soup.get_text().lower()
                    results[file] = {}
                    for keyword in keywords:
                        count = text.count(keyword.lower())
                        results[file][keyword] = count
                    for number in numbers:
                        count = len(re.findall(
                            r'\b' + re.escape(number) + r'\b', text))
                        results[file][number] = count

        # 将结果保存为Excel文件
        df = pd.DataFrame(results).T
        excel_path = os.path.join(dst_dir, 'results.xlsx')
        df.to_excel(excel_path)

        return jsonify({"message": "Processing successful", "excel_file": excel_path}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
