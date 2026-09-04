#!/usr/bin/env python3
"""單字圖片抓取 ── 從 ARASAAC 圖庫抓對應的圖，存進 img/。

ARASAAC（西班牙 Aragón 政府的溝通輔具圖庫）授權 CC BY-NC-SA，
非商業教學用途可用，但要標出處（App 的「怎麼玩」頁面裡有標）。

用法：
    python3 fetch_images.py            # 只補還沒有的圖
    python3 fetch_images.py --force    # 全部重抓

抓不到或畫得不好的字，自己放一張 img/<單字>.png 進去，
腳本會跳過已存在的檔，不會覆蓋。
"""
import json, os, re, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "img")
SEARCH = "https://api.arasaac.org/api/pictograms/en/bestsearch/{}"
# _300.png 是彩色 300x300，約 8KB。不要改用 API 的 resolution=500（18-29KB）
DOWNLOAD = "https://static.arasaac.org/pictograms/{0}/{0}_300.png"

# bestsearch 的第一名有時語意對不上（fish 挑到「盤子裡的魚料理」而不是活的魚），
# 這裡指定正確的圖片 id。逐張看過後發現不對就往這裡加。
OVERRIDE = {
    "fish": 2520,   # 預設 2519 是魚料理，這單元講的是動物
    "bag": 2475,    # 預設 23849 是紙購物袋，不是書包
    "rice": 39387,  # 預設 6911 是稻穗，不是煮好的飯
}
# img/big.png 是手工合成的大小對比圖 —— ARASAAC 沒有小三看得懂的「大的」
# （不是紅方框比大小就是 XL 吊牌）。腳本會跳過已存在的檔，不會蓋掉手工圖。


def words_from_js():
    """從 data/words.js 撈出所有 w 欄位（照出現順序，去重）。"""
    src = open(os.path.join(HERE, "data", "words.js"), encoding="utf-8").read()
    out, seen = [], set()
    for m in re.finditer(r'\bw\s*:\s*"([^"]+)"', src):
        w = m.group(1)
        if w not in seen:
            seen.add(w)
            out.append(w)
    return out


def get(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": "word-quest/1.0"})
    return urllib.request.urlopen(req, timeout=timeout).read()


def main():
    force = "--force" in sys.argv
    os.makedirs(IMG, exist_ok=True)
    words = words_from_js()
    print(f"{len(words)} 個單字\n")
    missing = []
    for w in words:
        dest = os.path.join(IMG, f"{w}.png")
        if os.path.exists(dest) and not force:
            print(f"  {w:<8} 已存在，跳過")
            continue
        try:
            if w in OVERRIDE:
                pid, kw = OVERRIDE[w], "指定"
            else:
                hits = json.loads(get(SEARCH.format(w)))
                if not isinstance(hits, list) or not hits:
                    raise ValueError("查無圖")
                pid = hits[0]["_id"]
                kw = ", ".join(k.get("keyword", "") for k in hits[0].get("keywords", [])[:2])
            data = get(DOWNLOAD.format(pid))
            open(dest, "wb").write(data)
            print(f"  {w:<8} id={pid:<6} {len(data)/1024:5.1f} KB  ({kw})")
        except Exception as e:
            print(f"  {w:<8} ✗ {e}")
            missing.append(w)
    if missing:
        print(f"\n抓不到 {len(missing)} 個：{', '.join(missing)}")
        print("自己放一張 img/<單字>.png 進去即可。")


if __name__ == "__main__":
    main()
