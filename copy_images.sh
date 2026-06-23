#!/bin/bash
# 複製 photo 文件夾的圖片到 website/images
# 由 Claude 自動生成

set -e
SRC="$HOME/Downloads/photo"
DST="$(cd "$(dirname "$0")" && pwd)/images"

mkdir -p "$DST"

cp "$SRC/圖片_20260523205643_184_3.jpg"  "$DST/hero-bg.jpg"
cp "$SRC/圖片_20260523205806_194_3.jpg"  "$DST/product-01-structures.jpg"
cp "$SRC/圖片_20260523205538_180_3.jpg"  "$DST/product-02-materials.jpg"
cp "$SRC/圖片_20260523202345_170_3.jpg"  "$DST/product-03-rail.jpg"
cp "$SRC/圖片_20260523210123_217_3.jpg"  "$DST/product-04-vehicles.jpg"
cp "$SRC/圖片_20260523205813_195_3.jpg"  "$DST/product-05-formwork.jpg"
cp "$SRC/圖片_20260523210051_213_3.jpg"  "$DST/product-06-automotive.jpg"
cp "$SRC/圖片_20260523210107_215_3.jpg"  "$DST/factory-about.jpg"
cp "$SRC/圖片_20260523204357_175_3.jpg"  "$DST/factory-manufacturing.jpg"

echo "已完成複製 9 張圖片到 $DST"
ls -la "$DST"
