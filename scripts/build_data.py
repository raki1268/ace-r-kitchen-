import pandas as pd
import json
import os
from PIL import Image

# 路径配置
SOURCE_XLSX = './data/meals_source.xlsx'
OUTPUT_JSON = './src/data/meals.json'

# --- 图片配置 ---
PUBLIC_DIR = './public'
OPTIMIZED_BASE = './public/images/optimized' # 优化后的根目录
MAX_WIDTH = 1600 
QUALITY = 80

def optimize_image(img_rel_path):
    """
    img_rel_path 示例: "/images/homemake/hm001.jpg"
    """
    if not img_rel_path or pd.isna(img_rel_path):
        return ""

    # 1. 转换路径，确保能找到物理文件
    # 去掉开头的 / 方便拼接，将 /images/xxx 变成 images/xxx
    clean_rel_path = img_rel_path.lstrip('/') 
    src_path = os.path.join(PUBLIC_DIR, clean_rel_path)

    if not os.path.exists(src_path):
        # 如果原图不存在，返回原始路径（避免数据丢失）
        return img_rel_path

    # 2. 构建目标路径 (保持原子目录结构)
    # 比如: public/images/optimized/homemake/hm001.webp
    path_parts = clean_rel_path.split('/') # ['images', 'homemake', 'hm001.jpg']
    sub_dir = path_parts[1] if len(path_parts) > 2 else "" # 'homemake'
    filename = path_parts[-1]
    base_name = os.path.splitext(filename)[0]
    
    dest_dir = os.path.join(OPTIMIZED_BASE, sub_dir)
    os.makedirs(dest_dir, exist_ok=True)
    
    dest_filename = f"{base_name}.webp"
    dest_path = os.path.join(dest_dir, dest_filename)
    
    # 3. 执行压缩 (如果 WebP 不存在则处理)
    if not os.path.exists(dest_path):
        try:
            with Image.open(src_path) as img:
                img = img.convert("RGB")
                if img.width > MAX_WIDTH:
                    h_size = int(float(img.height) * (MAX_WIDTH / float(img.width)))
                    img = img.resize((MAX_WIDTH, h_size), Image.Resampling.LANCZOS)
                img.save(dest_path, "WEBP", quality=QUALITY)
                print(f"  📸 已优化: {sub_dir}/{filename} -> {dest_filename}")
        except Exception as e:
            print(f"  ❌ 处理失败 {filename}: {e}")
            return img_rel_path

    # 4. 返回前端使用的 web 路径
    return f"/images/optimized/{sub_dir}/{dest_filename}".replace("//", "/")

def build():
    print("🔍 正在扫描 Excel 并自动递归处理各分类图片...")
    
    if not os.path.exists(SOURCE_XLSX):
        print(f"❌ 错误：找不到 Excel 文件")
        return

    df = pd.read_excel(SOURCE_XLSX)
    meals = []

    for _, row in df.iterrows():
        def split_field(val):
            if pd.isna(val) or str(val).lower() == 'nan': return []
            return [item.strip() for item in str(val).split(';')]

        # 核心：批量处理该菜品的所有图片
        raw_images = split_field(row.get('images'))
        optimized_images = [optimize_image(img) for img in raw_images]

        item = {
            "id": str(row['id']),
            "name": str(row['name']),
            "category": str(row['category']),
            "date": str(row['date']),
            "rating": float(row['rating']) if pd.notna(row['rating']) else 0,
            "images": optimized_images, 
            "ingredients": split_field(row.get('ingredients')),
            "steps": split_field(row.get('steps')),
            "notes": str(row['notes']) if pd.notna(row['notes']) else "",
            "cuisine": str(row['cuisine']) if pd.notna(row['cuisine']) else ""
        }
        
        # 处理可选数字字段
        for field in ['difficulty', 'makingTime', 'cost']:
            if pd.notna(row.get(field)): item[field] = float(row[field])
        
        meals.append(item)

    # 导出
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump({"meals": meals}, f, ensure_ascii=False, indent=2)
    
    print(f"\n✨ 大功告成！")
    print(f"📦 菜品总数: {len(meals)}")
    print(f"🖼️ 优化图片已存至: {OPTIMIZED_BASE}")

if __name__ == "__main__":
    build()