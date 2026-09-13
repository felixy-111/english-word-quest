#!/usr/bin/env python3
"""單字發音音檔 ── 用 macOS 內建的 say 產生，存進 audio/。

用法：
    python3 make_audio.py            # 只補還沒有的
    python3 make_audio.py --force    # 全部重做

為什麼不用瀏覽器的 speechSynthesis：
  ① 每台裝置裝的人聲不一樣，孩子的 iPad 聽到的跟老師挑的可能不同
  ② 在嵌入框（iframe）裡會被瀏覽器擋掉，完全沒聲音
  ③ 預先做成檔案才能離線播（Service Worker 一起快取）

⚠️ 語調的坑：Tom 這類神經語音唸「孤立單字」時會用句子中段的懸空語調，
   聽起來像話講到一半。句點、驚嘆號、[[pmod]] 全部無效（產生的檔案 byte 完全相同）。
   解法是唸「單字. Stop.」讓單字站在句尾拿到下降語調，再從中間的停頓切掉後半。
"""
import json, os, re, subprocess, sys

HERE  = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(HERE, "audio")
VOICE = "Tom (Enhanced)"     # 太一 2026-09-13 定案
RATE  = "150"                # wpm

# 某些字用 Tom 唸起來不對勁時，在這裡指定別的人聲（值＝say -v 的名稱）。
# 一個字的音塊會跟著它的人聲走，不會半句 Tom 半句別人。
# 這七個是太一 2026-09-13 逐字聽過後指定改用 Allison 的。
_ALLISON = "Allison (Enhanced)"
VOICE_OVERRIDE = {
    "smoothie":  _ALLISON,
    "milkshake": _ALLISON,
    "watch":     _ALLISON,
    "glue":      _ALLISON,
    "cashier":   _ALLISON,
    "thin":      _ALLISON,
    "Türkiye":   _ALLISON,
}

def say_clip(text, dest, voice=None):
    """唸一段話，回傳 mp3 路徑。用尾隨的 Stop. 逼出句尾下降語調後再切掉。"""
    raw = dest + ".aiff"
    subprocess.run(["say", "-v", voice or VOICE, "-r", RATE, "-o", raw, text + ". Stop."],
                   check=True, capture_output=True)
    p = subprocess.run(["ffmpeg", "-i", raw, "-af", "silencedetect=noise=-38dB:d=0.12",
                        "-f", "null", "-"], capture_output=True, text=True)
    m = re.search(r"silence_start: ([\d.]+)", p.stderr)
    args = ["ffmpeg", "-y", "-i", raw]
    if m:
        args += ["-t", str(float(m.group(1)) + 0.06)]   # 留一點尾巴，不要削掉尾音
    else:
        print(f"  ⚠️  {text}：找不到停頓，整段留著（可能會聽到 Stop）", file=sys.stderr)
    subprocess.run(args + ["-codec:a", "libmp3lame", "-b:a", "32k", "-ac", "1", dest],
                   check=True, capture_output=True)
    os.remove(raw)
    return dest

def chunk_text(part, is_last_piece):
    """沒有母音的音塊補 uh —— 否則 TTS 會唸字母名稱（c 唸成 see），那正好教錯。"""
    return part + "uh" if (not is_last_piece and not re.search(r"[aeiou]", part, re.I)) else part

def words_from_js():
    src = open(os.path.join(HERE, "data", "words.js"), encoding="utf-8").read()
    out, seen = [], set()
    for m in re.finditer(r'\{w:"([^"]+)"(.*?)\}', src, re.S):
        w, rest = m.group(1), m.group(2)
        if w in seen:
            continue
        seen.add(w)
        ck = re.search(r'chunks:"([^"]*)"', rest)
        out.append((w, ck.group(1) if ck else ""))
    return out

def main():
    force = "--force" in sys.argv
    os.makedirs(AUDIO, exist_ok=True)
    words = words_from_js()
    print(f"{len(words)} 個單字\n")
    made = 0
    for w, chunks in words:
        voice = VOICE_OVERRIDE.get(w)
        jobs = [(w, os.path.join(AUDIO, f"{w}.mp3"))]
        parts = [p for p in chunks.split("-") if p]
        for i, p in enumerate(parts):
            jobs.append((chunk_text(p, i == len(parts) - 1), os.path.join(AUDIO, f"{w}_c{i}.mp3")))
        for text, dest in jobs:
            if os.path.exists(dest) and not force:
                continue
            say_clip(text, dest, voice)
            made += 1
        tag = f"（{voice}）" if voice else ""
        print(f"  {w:<18} {len(jobs)} 段 {tag}")
    total = sum(os.path.getsize(os.path.join(AUDIO, f)) for f in os.listdir(AUDIO))
    print(f"\n✅ 新做 {made} 個檔，audio/ 共 {len(os.listdir(AUDIO))} 個、{total/1024:.0f} KB")

if __name__ == "__main__":
    main()
