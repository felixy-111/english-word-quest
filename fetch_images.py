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
import json, os, re, sys, urllib.parse, urllib.request

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
    "Earth": 30015, # 預設 3160 是「土壤」不是地球；30015 是藍海綠陸的那顆地球，
                    # 正好對上 CS3 課堂問的 What makes the Earth blue and green
    # ── M1 課本（2026-09-12）。bestsearch 查無或語意不對，逐張看過後指定：
    "shop": 39753,             # 9058 是一袋蔬果（比較像 groceries），39753 是推推車買東西
    "smoothie": 11463,         # 查無 smoothie；11463 是果汁機＋杯子，正是果昔的做法
    "department store": 15551, # 查無；15551 是 shopping mall
    "borrow": 34790,           # 查無；34790 是 lend a book，正好對上課本的 borrow books
    "postal worker": 2690,     # 查無；2690 postman
    "server": 6072,            # 查無；課本的 server 是餐廳服務生＝waiter
    "vet": 2780,               # 查無縮寫；2780 veterinarian
    "fight fires": 5907,       # 預設 6477 是「兩個人吵架」；5907 是水柱撲滅火
    "kick": 5961,              # 預設那張太一說看不出在踢；5961 是射門的動作
    "old": 21008,              # 預設 4770 是一台舊車；課本講的是人年紀大，21008 是老夫婦
    "tight": 31052,            # 查無；31052 是鞋子太緊（課本 tight pants 同一個意思）
    "sour": 4552,              # 預設是 sour cream（酸奶油）；4552 是被酸到的表情＋檸檬
    "baggy": 24881,            # 查無；24881 loose shirt
    "desk": 11302,             # 查無；11302 school desk
    "dresser": 16281,          # 查無；16281 chest of drawers
    "bookcase": 3279,          # 查無；3279 bookshelf
    # ── 第二輪：整張對照表看過後發現語意不對的（2026-09-12）
    "gum": 8724,               # 預設是一瓶膠水（西語 goma 同時是膠和口香糖）；8724 才是口香糖
    "park": 2434,              # 預設 5379 是停車場；2434 是有樹有步道的公園
    "cook": 30526,             # 預設是一只鍋子；課本 cook 是「廚師」這個人
    "fly": 9205,               # 預設是蒼蠅（fly 的名詞義）；課本是 fly planes
    "cold": 5479,              # 舊圖是一杯冰塊（形容詞 cold）；課本 L4 的 cold 是「感冒」
    "salesperson": 37809,      # 34878 畫的是店面；37809 才是站在櫃檯的店員
    "thick": None,             # 預設是濃稠的糖漿；ARASAAC 沒有「厚的」，用 emoji
    # None ＝ 這個字寧可沒有圖。ARASAAC 只有語意會教錯的圖，程式退回 emoji：
    "light": None,             # 只有「明暗漸層」，課本 light 是「輕的」
    "hard": None,              # 只有「數學難題」，課本 hard 是「硬的」
    "greasy": None,            # 只有「胖瘦對比」，跟「油膩的」無關
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
                if pid is None:      # 刻意不給圖，讓程式退回 emoji
                    print(f"  {w:<8} — 不抓圖（ARASAAC 的圖語意會教錯），用 emoji")
                    continue
            else:
                hits = json.loads(get(SEARCH.format(urllib.parse.quote(w))))
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
