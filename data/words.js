// 單字大冒險 ── 單字資料（演示 MVP）
//
// 單元＝日期，一天 5 個字，全部都要寫。
// 欄位：w 英文｜pos 詞性｜zh 中文｜img 圖（emoji，第 3 步「看」用）｜chunks 音塊
//
// chunks 拆解規則（兩層，不要混用）：
//   ① 多音節字先切音節：pen-cil、hap-py、rab-bit
//   ② 單音節字切「首音 ＋ 韻腳」：c-at、sh-op
//   ③ 母音開頭的單音節字切「母音組合 ＋ 尾音」：ea-t
//   ④ 不規則字不切，標 sight:true（write）
//
// 之後拿到安親班單字表，用 build_words.py 覆蓋這個檔。
window.EN_WORDS = {
  version: "demo-2026-09-04",
  units: [
    { id:"2026-09-04", title:"9 / 4", sub:"星期五", words:[
      {w:"book",   pos:"n.",  zh:"書",   img:"📖", chunks:"b-ook"},
      {w:"bag",    pos:"n.",  zh:"書包", img:"🎒", chunks:"b-ag"},
      {w:"pen",    pos:"n.",  zh:"筆",   img:"🖊️", chunks:"p-en"},
      {w:"ruler",  pos:"n.",  zh:"尺",   img:"📏", chunks:"ru-ler"},
      {w:"clock",  pos:"n.",  zh:"時鐘", img:"🕐", chunks:"cl-ock"}
    ]},
    { id:"2026-09-07", title:"9 / 7", sub:"星期一", words:[
      {w:"cat",    pos:"n.",  zh:"貓",   img:"🐱", chunks:"c-at"},
      {w:"dog",    pos:"n.",  zh:"狗",   img:"🐶", chunks:"d-og"},
      {w:"bird",   pos:"n.",  zh:"鳥",   img:"🐦", chunks:"b-ird"},
      {w:"fish",   pos:"n.",  zh:"魚",   img:"🐟", chunks:"f-ish"},
      {w:"rabbit", pos:"n.",  zh:"兔子", img:"🐰", chunks:"rab-bit"}
    ]},
    { id:"2026-09-08", title:"9 / 8", sub:"星期二", words:[
      {w:"apple",  pos:"n.",  zh:"蘋果", img:"🍎", chunks:"ap-ple"},
      {w:"bread",  pos:"n.",  zh:"麵包", img:"🍞", chunks:"br-ead"},
      {w:"milk",   pos:"n.",  zh:"牛奶", img:"🥛", chunks:"m-ilk"},
      {w:"rice",   pos:"n.",  zh:"飯",   img:"🍚", chunks:"r-ice"},
      {w:"egg",    pos:"n.",  zh:"蛋",   img:"🥚", chunks:"e-gg"}
    ]},
    { id:"2026-09-09", title:"9 / 9", sub:"星期三", words:[
      {w:"run",    pos:"v.",  zh:"跑",   img:"🏃", chunks:"r-un"},
      {w:"jump",   pos:"v.",  zh:"跳",   img:"🤸", chunks:"j-ump"},
      {w:"eat",    pos:"v.",  zh:"吃",   img:"🍽️", chunks:"ea-t"},
      {w:"sleep",  pos:"v.",  zh:"睡覺", img:"😴", chunks:"sl-eep"},
      {w:"write",  pos:"v.",  zh:"寫",   img:"✍️", chunks:"", sight:true}
    ]},
    { id:"2026-09-10", title:"9 / 10", sub:"星期四", words:[
      {w:"happy",  pos:"adj.", zh:"快樂的", img:"😀", chunks:"hap-py"},
      {w:"sad",    pos:"adj.", zh:"難過的", img:"😢", chunks:"s-ad"},
      {w:"hot",    pos:"adj.", zh:"熱的",   img:"🔥", chunks:"h-ot"},
      {w:"cold",   pos:"adj.", zh:"冷的",   img:"🧊", chunks:"c-old"},
      {w:"big",    pos:"adj.", zh:"大的",   img:"🐘", chunks:"b-ig"}
    ]}
  ]
};
