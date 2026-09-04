// 單字大冒險 ── 單字資料（演示 MVP）
//
// 單元＝日期，一天 5 個字，全部都要寫。
// 欄位：w 英文｜pos 詞性｜zh 中文｜emoji 備援圖示｜chunks 音塊｜anim 微動效
//
// 圖片：img/<單字>.png，由 fetch_images.py 從 ARASAAC 抓下來（CC BY-NC-SA）。
//       圖檔載入失敗時自動退回 emoji，所以 emoji 欄位不要拿掉。
//
// chunks 拆解規則（兩層，不要混用）：
//   ① 多音節字先切音節：pen-cil、hap-py、rab-bit
//   ② 單音節字切「首音 ＋ 韻腳」：c-at、sh-op
//   ③ 母音開頭的單音節字切「母音組合 ＋ 尾音」：ea-t
//   ④ 不規則字不切，標 sight:true（write）
//
// anim 只給動作看得出來的字，在「看」和翻答案時播一下：
//   hop 上下跳｜shake 左右晃｜pulse 輕微放大
//
// 之後拿到安親班單字表，用 build_words.py 覆蓋這個檔，再跑 fetch_images.py 補圖。
window.EN_WORDS = {
  version: "demo-2026-09-04",
  units: [
    { id:"2026-09-04", title:"9 / 4", sub:"星期五", words:[
      {w:"book",   pos:"n.",  zh:"書",   emoji:"📖", chunks:"b-ook"},
      {w:"bag",    pos:"n.",  zh:"書包", emoji:"🎒", chunks:"b-ag"},
      {w:"pen",    pos:"n.",  zh:"筆",   emoji:"🖊️", chunks:"p-en"},
      {w:"ruler",  pos:"n.",  zh:"尺",   emoji:"📏", chunks:"ru-ler"},
      {w:"clock",  pos:"n.",  zh:"時鐘", emoji:"🕐", chunks:"cl-ock"}
    ]},
    { id:"2026-09-07", title:"9 / 7", sub:"星期一", words:[
      {w:"cat",    pos:"n.",  zh:"貓",   emoji:"🐱", chunks:"c-at"},
      {w:"dog",    pos:"n.",  zh:"狗",   emoji:"🐶", chunks:"d-og"},
      {w:"bird",   pos:"n.",  zh:"鳥",   emoji:"🐦", chunks:"b-ird"},
      {w:"fish",   pos:"n.",  zh:"魚",   emoji:"🐟", chunks:"f-ish"},
      {w:"rabbit", pos:"n.",  zh:"兔子", emoji:"🐰", chunks:"rab-bit"}
    ]},
    { id:"2026-09-08", title:"9 / 8", sub:"星期二", words:[
      {w:"apple",  pos:"n.",  zh:"蘋果", emoji:"🍎", chunks:"ap-ple"},
      {w:"bread",  pos:"n.",  zh:"麵包", emoji:"🍞", chunks:"br-ead"},
      {w:"milk",   pos:"n.",  zh:"牛奶", emoji:"🥛", chunks:"m-ilk"},
      {w:"rice",   pos:"n.",  zh:"飯",   emoji:"🍚", chunks:"r-ice"},
      {w:"egg",    pos:"n.",  zh:"蛋",   emoji:"🥚", chunks:"e-gg"}
    ]},
    { id:"2026-09-09", title:"9 / 9", sub:"星期三", words:[
      {w:"run",    pos:"v.",  zh:"跑",   emoji:"🏃", chunks:"r-un",  anim:"shake"},
      {w:"jump",   pos:"v.",  zh:"跳",   emoji:"🤸", chunks:"j-ump", anim:"hop"},
      {w:"eat",    pos:"v.",  zh:"吃",   emoji:"🍽️", chunks:"ea-t",  anim:"pulse"},
      {w:"sleep",  pos:"v.",  zh:"睡覺", emoji:"😴", chunks:"sl-eep",anim:"pulse"},
      {w:"write",  pos:"v.",  zh:"寫",   emoji:"✍️", chunks:"", sight:true, anim:"shake"}
    ]},
    { id:"2026-09-10", title:"9 / 10", sub:"星期四", words:[
      {w:"happy",  pos:"adj.", zh:"快樂的", emoji:"😀", chunks:"hap-py"},
      {w:"sad",    pos:"adj.", zh:"難過的", emoji:"😢", chunks:"s-ad"},
      {w:"hot",    pos:"adj.", zh:"熱的",   emoji:"🔥", chunks:"h-ot"},
      {w:"cold",   pos:"adj.", zh:"冷的",   emoji:"🧊", chunks:"c-old"},
      {w:"big",    pos:"adj.", zh:"大的",   emoji:"🐘", chunks:"b-ig", anim:"pulse"}
    ]}
  ]
};
