import pandas as pd
import json
import os

# 路径配置
SOURCE_XLSX = './data/meals_source.xlsx'
OUTPUT_JSON = './src/data/meals.json'

def build():
    print("🔍 正在扫描 Excel 数据...")
    
    if not os.path.exists(SOURCE_XLSX):
        print(f"❌ 错误：在 ./data/ 下找不到 meals_source.xlsx")
        return

    # 读取数据
    df = pd.read_excel(SOURCE_XLSX)
    
    # 1. 专业校验：检查 ID 是否有重复
    if df['id'].duplicated().any():
        duplicates = df[df['id'].duplicated()]['id'].unique().tolist()
        print(f"🛑 严重错误：发现重复的 ID {duplicates}！请在 Excel 中修正。")
        return 

    meals = []
    for _, row in df.iterrows():
        # 辅助函数：处理分号分隔的数组
        def split_field(val):
            if pd.isna(val) or str(val).lower() == 'nan':
                return []
            return [item.strip() for item in str(val).split(';')]

        # 2. 构建基础对象
        item = {
            "id": str(row['id']),
            "name": str(row['name']),
            "category": str(row['category']),
            "date": str(row['date']),
            "rating": float(row['rating']) if pd.notna(row['rating']) else 0,
            "images": split_field(row.get('images')),
            "ingredients": split_field(row.get('ingredients')),
            "steps": split_field(row.get('steps')),
            "notes": str(row['notes']) if pd.notna(row['notes']) else "",
            "cuisine": str(row['cuisine']) if pd.notna(row['cuisine']) else "",
            "entry_date": str(row['entry_date']) if pd.notna(row.get('entry_date')) else ""
        }
        
        # 3. 处理数字可选字段
        if pd.notna(row.get('difficulty')): item['difficulty'] = int(row['difficulty'])
        if pd.notna(row.get('makingTime')): item['makingTime'] = int(row['makingTime'])
        if pd.notna(row.get('cost')): item['cost'] = float(row['cost'])
        
        meals.append(item)

    # 4. 导出 JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump({"meals": meals}, f, ensure_ascii=False, indent=2)
    
    print(f"✨ 成功！已将 {len(meals)} 条菜品转换至 {OUTPUT_JSON}")

if __name__ == "__main__":
    build()