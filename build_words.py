#!/usr/bin/env python3
"""把單字表（TSV）轉成 data/words.js。

用法：
    python3 build_words.py 安親班單字表.tsv            # 覆寫 data/words.js
    python3 build_words.py 安親班單字表.tsv --stdout   # 只印出來檢查

TSV 格式（用 Tab 分欄，欄位不足會自動補空）：

    # 1|Unit 1 School Things|學校用品|康軒 Follow Me 3      ← 單元標題行（id|標題|副標|來源）
    pencil<TAB>鉛筆<TAB>pen-cil<TAB><TAB>I have a red pencil.<TAB>我有一枝紅色鉛筆。
    book<TAB>書                                            ← 後面欄位可以全部省略

欄位順序：英文 / 中文 / 音塊 / 字族 / 例句 / 例句中文
音塊留空時會用「首子音串 + 其餘」自動切（cat→c-at、stop→st-op）；
兩個音節以上切不準，會留空讓老師自己填——寧可空著，不要教錯。
"""
import sys, io, json, os, re

VOWELS = "aeiou"

def auto_chunks(word):
    """單音節字用 onset-rime 切；其他留空（自動切多音節字很容易切錯）。"""
    w = word.lower()
    if not w.isalpha():
        return ""
    # 母音群數量 > 1 就當多音節，不猜
    if len(re.findall(r'[aeiou]+', w)) != 1:
        return ""
    i = next((k for k, c in enumerate(w) if c in VOWELS), -1)
    if i <= 0:            # 沒有母音，或母音在最前面（at、in）→ 不切
        return ""
    return w[:i] + "-" + w[i:]

def parse(path):
    units, cur = [], None
    with io.open(path, encoding="utf-8") as f:
        for lineno, raw in enumerate(f, 1):
            line = raw.rstrip("\n")
            if not line.strip():
                continue
            if line.lstrip().startswith("#"):
                parts = [p.strip() for p in line.lstrip("# ").split("|")]
                parts += [""] * (4 - len(parts))
                uid = int(parts[0]) if parts[0].isdigit() else len(units) + 1
                cur = {"id": uid, "title": parts[1], "sub": parts[2], "source": parts[3], "words": []}
                units.append(cur)
                continue
            if cur is None:
                cur = {"id": 1, "title": "Unit 1", "sub": "", "source": "", "words": []}
                units.append(cur)
            col = (line.split("\t") + [""] * 6)[:6]
            w = col[0].strip()
            if not w:
                continue
            if not col[1].strip():
                print(f"⚠️  第 {lineno} 行「{w}」沒有中文，還是收進去了", file=sys.stderr)
            cur["words"].append({
                "w": w,
                "zh": col[1].strip(),
                "chunks": col[2].strip() or auto_chunks(w),
                "family": col[3].strip(),
                "sent": col[4].strip(),
                "sentZh": col[5].strip(),
            })
    return units

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    src = sys.argv[1]
    units = parse(src)
    total = sum(len(u["words"]) for u in units)
    no_chunk = [w["w"] for u in units for w in u["words"] if not w["chunks"]]
    body = json.dumps({"version": os.path.basename(src), "units": units},
                      ensure_ascii=False, indent=2)
    out = ("// 英文單字大冒險 ── 單字資料（由 build_words.py 產生，不要手改這個檔）\n"
           f"// 來源：{src}\n"
           f"window.EN_WORDS = {body};\n")
    if "--stdout" in sys.argv:
        print(out)
    else:
        io.open("data/words.js", "w", encoding="utf-8").write(out)
        print(f"✅ 寫入 data/words.js：{len(units)} 個單元、{total} 個字")
    if no_chunk:
        print(f"📝 這 {len(no_chunk)} 個字的音塊要自己填（多音節切不準）：{', '.join(no_chunk)}", file=sys.stderr)

if __name__ == "__main__":
    main()
