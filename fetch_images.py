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
    "fish": 11339,  # VB p6 的 fish 是「釣魚」；11339 是上鉤的魚（舊單元用過 2520 活魚）
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
    # ── CS3 Reading Book 樂器單元（2026-09-25）。逐字查過 bestsearch：
    "instrument": 8608,        # 查無 instrument；8608 是 musical instruments 合集
    "band": 23811,             # 預設 3016 語意模糊；23811 標的是 music band
    "hit": None,               # 預設 6513 是網球拍擊球，課本是「敲鼓」，會教錯
    "bow": None,               # 預設 2946 是蝴蝶結（keywords: bow, knot），不是琴弓
    "sticks": None,            # 預設 11322 是竿子／棍子，不是鼓棒
    "drumsticks": None,        # 查無；搜 drumstick 單數也查無
    # ── VB p5 School（2026-10-01）。整張對照表看過後指定：
    "board": 2526,             # 預設 6143 是一塊木板；課本是黑板
    "eraser": 2409,            # 預設 16341 是黑板擦；2409 才是孩子用的橡皮擦
    "class": 39686,            # 查無；39686 是老師和學生在教室上課
    "classroom": 33072,        # 預設 5913 只畫筆記本和鉛筆；33072 有黑板、課桌椅
    "draw": 11238,             # 預設 5506 畫的是剪刀剪紙
    "lesson": 32546,           # 查無；32546 language lesson，看著課本上課
    "part": 27093,             # 查無；27093 piece，一整塊缺一角，正好是「部分」
    "read": 28643,             # 預設 5973 是「講述」（跟 tell 同一張）；28643 是看書
    "right": 34641,            # 預設 4624 是右手；課本 right 是「正確的」
    "test": 38462,             # 預設 28825 是視力檢查；38462 是考卷
    "tick": 21381,             # 查無；21381 是在方框裡打勾
    "sentence": None,          # 只有「離婚判決」和西班牙文句子圖
    "example": None,           # 查無
    "word": None,              # 9837 印的是西班牙文 casa／amor／mano，孩子會照著唸
    # ── 寫作本 U4–U8（2026-10-04）。逐張看過：
    "save": 37022,       # 預設 4556 是存錢筒（存錢），書上是 save water；37022 是關水龍頭
    "waste": None,       # 預設 26388 是工廠污染，不是「浪費」
    "use": None,         # 預設 15485 是雙手捏球，看不出意思
    "hockey": 27106,     # 預設 10161 是草地曲棍球，書上是冰上曲棍球
    "hair salon": 2850,  # 查無；2850 是有理髮椅的店面
    "pro gamer": 37464,  # 查無；37464 遊戲手把
    "taste": 2944,       # 查無；2944 舌頭，對上書上那個味覺圖示
    "YouTuber": None,    # 查無
    "cartoonist": None,  # 查無；draw 的圖只是在畫畫，不像漫畫家
    # ── VB p6 運動休閒＋p7 交通／大自然／顏色（2026-10-26）。整張對照表看過後指定：
    "plane": 6924,       # 預設 5609 是木工刨刀（woodworking plane）
    "orange": 2888,      # 預設 2483 是柳橙水果；這頁是顏色，2888 是橘色色塊（跟其他顏色同一套）
    "story": 2364,       # 預設 6469 印著西班牙文 EL LOBO TIENE HAMBRE；2364 是故事書
    "game": 2731,        # 預設 6170 是電視上的足球賽，跟 football 撞圖
    "violet": 34483,     # 預設 11395 是紫羅蘭花；34483 是紫色色塊
    "indigo": 4869,      # 查無；4869 是深藍色塊，跟 blue 的淺藍分得開
    "hobby": None,       # 查無；hobbies 只搜到摺紙、氣球造型這類特定嗜好
    # ── 星期（2026-11-13）。預設 65xx 是西班牙文縮寫 L M X J V S D，會教錯；
    #    改用 377xx 無字月曆：週日排第一（同台灣月曆），紅格＝當天
    "Sunday": 37723, "Monday": 37730, "Tuesday": 37729, "Wednesday": 37728,
    "Thursday": 37727, "Friday": 37726, "Saturday": 37725,
    # ── 時間主題（2026-11-13）
    "fall": 5531,        # 預設 4582 是「跌倒」；5531 是落葉＋季節條，跟 spring/summer/winter 同一套
    "weekend": 32396,    # 預設 27329 又是西班牙文 S D；32396 是一排格子最後兩格紅
    "afternoon": 32708,  # 時鐘 12→6 塗紅；預設 7268（太陽往下落）讓給 evening，兩張才分得開
    "evening": 7268,     # 查無；38567 帶驚嘆號是「晚安」問候語
    "holiday": 32416,    # 查無；32416 背包出遊露營
    "noon": None,        # 查無，只有下午茶點心；退回 🕛
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
