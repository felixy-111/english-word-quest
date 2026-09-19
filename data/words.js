// 單字大冒險 ── 單字資料
//
// 單元＝日期，一天固定 8 個字（太一 2026-09-12 指定）。
// 2026-09-21 起上課日改成「週一 / 三 / 五 / 日」——家長反映週二、四時間不夠，
// 拿掉那兩天、補一天週日，原本的內容依序往後遞延（太一 2026-09-19）。
// 欄位：w 英文｜pos 詞性｜zh 中文｜emoji 備援圖示｜chunks 音塊｜anim 微動效
//
// 圖片：img/<單字>.png，由 fetch_images.py 從 ARASAAC 抓下來（CC BY-NC-SA）。
//       圖檔載入失敗時自動退回 emoji，所以 emoji 欄位不要拿掉。
//
// chunks 拆解規則（兩層，不要混用）：
//   ① 多音節字先切音節：pa-per、plas-tic、re-cy-cle
//   ② 單音節字切「首音 ＋ 韻腳」：pl-ant、c-at、sh-op
//   ③ 母音開頭的單音節字切「母音組合 ＋ 尾音」：ea-t
//   ④ 不規則字不切，標 sight:true
//
// ⚠️ chunks 留空「不等於」這個字不規則，只是還沒填。程式分得出來（見 chunkState）：
//    要標成「整個記」必須明寫 sight:true。
//
// 老師上課現場加的字走 App 裡的「👩‍🏫 老師：加單字」，存在裝置的 localStorage，
// 匯出後再灌進這個檔才會跟著上線給孩子。
window.EN_WORDS = {
  version: "cs3+m1-2026-09-19",
  units: [
    // 來源：安親班 CS3（9/7，Lily 老師）指定的拼字考單字。主題 Save the Earth。
    { id:"2026-09-12", title:"9 / 12", sub:"星期六", words:[
      // 這課的作業是 Write 6 ways to save the earth，「plant trees（種樹）」是標準答案，
      // 所以用動詞「種植」而不是名詞「植物」——ARASAAC 抓到的圖也正是動手種下去那張。
      {w:"plant",   pos:"v.", zh:"種植", emoji:"🌱", chunks:"pl-ant"},
      {w:"paper",   pos:"n.", zh:"紙",   emoji:"📄", chunks:"pa-per"},
      {w:"plastic", pos:"n.", zh:"塑膠", emoji:"🥤", chunks:"plas-tic"},
      {w:"recycle", pos:"v.", zh:"回收", emoji:"♻️", chunks:"re-cy-cle"},
      // 老師寫的是大寫 Earth（地球，專有名詞），拼字考要大寫，別改成小寫。
      // ⚠️ ear 在 hear／near／year 唸 /ɪr/，但 earth／early／learn 唸 /ɜr/ —— 這是例外。
      // 太一 2026-09-13 決定：還是照拆，不要寫「拼不出來」（那句話會讓家長以為只能死背）。
      // 代價是「拆」的語音會把 Ear 唸成「ear（耳朵）」，這個音要老師當面示範。
      {w:"Earth",   pos:"n.", zh:"地球", emoji:"🌍", chunks:"Ear-th"}
    ]},

    // ─────────────────────────────────────────────────────────────────────
    // 來源：M1 班課本（太一 2026-09-12 拍照）。主課本 Unit 1–5 ＋ 寫作本 Seedlings U1–U3。
    // 共 104 字，13 個上課日 × 8 字，9/14（一）～9/30（三），跳過週末。
    //
    // 片語取「關鍵字」（太一指定）：watch a movie→watch、go swimming→swim、
    // help sick animals→help。複合名詞（potato chips、post office）是課本的單一詞條，
    // 整個留著不拆。多字詞的圖檔名會帶空格，index.html 用 encodeURIComponent 處理。
    // ─────────────────────────────────────────────────────────────────────

    // Unit 1 Things to Eat：L1 Snacks ＋ L2 Vegetables 開頭
    { id:"2026-09-14", title:"9 / 14", sub:"星期一 · U1 零食", words:[
      {w:"gum",           pos:"n.", zh:"口香糖",  emoji:"🍬", chunks:"g-um"},
      {w:"popcorn",       pos:"n.", zh:"爆米花",  emoji:"🍿", chunks:"pop-corn"},
      {w:"peanuts",       pos:"n.", zh:"花生",    emoji:"🥜", chunks:"pea-nuts"},
      // chocolate 唸起來只有兩個音節（choc-late），但拼起來多一個 o。
      // 切成 choc-o-late 會教錯發音，留空讓老師當面示範。
      {w:"chocolate",     pos:"n.", zh:"巧克力",  emoji:"🍫", chunks:""},
      {w:"potato chips",  pos:"n.", zh:"洋芋片",  emoji:"🍟", chunks:""},
      {w:"soda",          pos:"n.", zh:"汽水",    emoji:"🥤", chunks:"so-da"},
      {w:"carrot",        pos:"n.", zh:"紅蘿蔔",  emoji:"🥕", chunks:"car-rot"},
      {w:"onion",         pos:"n.", zh:"洋蔥",    emoji:"🧅", chunks:"on-ion"}
    ]},

    // Unit 1：L2 Vegetables 剩下 ＋ L4 Cooking
    { id:"2026-09-15", title:"9 / 15", sub:"星期二 · U1 蔬菜與料理", words:[
      {w:"pepper",      pos:"n.", zh:"甜椒",        emoji:"🫑", chunks:"pep-per"},
      {w:"cabbage",     pos:"n.", zh:"高麗菜",      emoji:"🥬", chunks:"cab-bage"},
      {w:"potato",      pos:"n.", zh:"馬鈴薯",      emoji:"🥔", chunks:"po-ta-to"},
      {w:"tomato",      pos:"n.", zh:"番茄",        emoji:"🍅", chunks:"to-ma-to"},
      // 實際唸 /ˈɑm-lət/ 兩個音節，中間的 e 輕到幾乎消失。切成 om-e-let 會教成
      // 「om-ee-let」，跟 chocolate 同一個毛病，所以不拆。（太一 2026-09-13 指出）
      {w:"omelet",      pos:"n.", zh:"歐姆蛋",      emoji:"🍳", chunks:""},
      {w:"smoothie",    pos:"n.", zh:"果昔",        emoji:"🥤", chunks:"smooth-ie"},
      {w:"fruit salad", pos:"n.", zh:"水果沙拉",    emoji:"🥗", chunks:""},
      {w:"milkshake",   pos:"n.", zh:"奶昔",        emoji:"🥛", chunks:"milk-shake"}
    ]},

    // Unit 2 Around Town：L1 Places to Go ＋ L2 前兩個動詞
    { id:"2026-09-16", title:"9 / 16", sub:"星期三 · U2 城裡的地方", words:[
      {w:"park",             pos:"n.", zh:"公園",       emoji:"🌳", chunks:"p-ark"},
      {w:"movie theater",    pos:"n.", zh:"電影院",     emoji:"🎬", chunks:""},
      {w:"supermarket",      pos:"n.", zh:"超級市場",   emoji:"🛒", chunks:"su-per-mar-ket"},
      {w:"post office",      pos:"n.", zh:"郵局",       emoji:"📮", chunks:""},
      {w:"department store", pos:"n.", zh:"百貨公司",   emoji:"🏬", chunks:""},
      {w:"library",          pos:"n.", zh:"圖書館",     emoji:"📚", chunks:"li-brar-y"},
      {w:"shop",             pos:"v.", zh:"買東西",     emoji:"🛍️", chunks:"sh-op"},
      // 課本是 watch a movie，只收關鍵動詞 watch
      {w:"watch",            pos:"v.", zh:"看（電影）", emoji:"📺", chunks:"w-atch"}
    ]},

    // Unit 2：L2 Things to Do 剩下的動詞 ＋ L4 Activities（美術）
    { id:"2026-09-17", title:"9 / 17", sub:"星期四 · U2 做什麼事", words:[
      {w:"borrow", pos:"v.", zh:"借（書）", emoji:"📖", chunks:"bor-row"},
      {w:"mail",   pos:"v.", zh:"寄（信）", emoji:"✉️", chunks:"m-ail"},
      {w:"buy",    pos:"v.", zh:"買",       emoji:"💰", chunks:"b-uy"},
      {w:"kick",   pos:"v.", zh:"踢",       emoji:"⚽", chunks:"k-ick"},
      {w:"color",  pos:"v.", zh:"著色",     emoji:"🖍️", chunks:"col-or"},
      {w:"cut",    pos:"v.", zh:"剪",       emoji:"✂️", chunks:"c-ut"},
      {w:"glue",   pos:"v.", zh:"黏貼",     emoji:"🧴", chunks:"gl-ue"},
      {w:"fold",   pos:"v.", zh:"摺",       emoji:"📄", chunks:"f-old"}
    ]},

    // Unit 3 People in Town：L1 Occupations ＋ L2 的 cook、bus driver
    { id:"2026-09-18", title:"9 / 18", sub:"星期五 · U3 職業", words:[
      {w:"cashier",       pos:"n.", zh:"收銀員",   emoji:"💵", chunks:"cash-ier"},
      // librarian 四個音節，重音在 brar，切不準；留空讓老師唸給他聽。
      {w:"librarian",     pos:"n.", zh:"圖書館員", emoji:"📚", chunks:""},
      {w:"postal worker", pos:"n.", zh:"郵差",     emoji:"📮", chunks:""},
      {w:"salesperson",   pos:"n.", zh:"店員",     emoji:"🏷️", chunks:"sales-per-son"},
      {w:"server",        pos:"n.", zh:"服務生",   emoji:"🍽️", chunks:"serv-er"},
      {w:"vet",           pos:"n.", zh:"獸醫",     emoji:"🐕", chunks:"v-et"},
      {w:"cook",          pos:"n.", zh:"廚師",     emoji:"👨‍🍳", chunks:"c-ook"},
      {w:"bus driver",    pos:"n.", zh:"公車司機", emoji:"🚌", chunks:""}
    ]},

    // Unit 3：L2 What People Do（課本是 make food／sell things…，只收關鍵動詞）
    { id:"2026-09-21", title:"9 / 21", sub:"星期一 · U3 工作在做什麼", words:[
      {w:"pilot",       pos:"n.", zh:"飛行員",     emoji:"✈️", chunks:"pi-lot"},
      {w:"firefighter", pos:"n.", zh:"消防員",     emoji:"🚒", chunks:"fire-fight-er"},
      {w:"make",        pos:"v.", zh:"做（食物）", emoji:"🍳", chunks:"m-ake"},
      {w:"sell",        pos:"v.", zh:"賣",         emoji:"🏷️", chunks:"s-ell"},
      {w:"help",        pos:"v.", zh:"幫忙",       emoji:"🤝", chunks:"h-elp"},
      {w:"drive",       pos:"v.", zh:"開（車）",   emoji:"🚌", chunks:"dr-ive"},
      {w:"fly",         pos:"v.", zh:"開（飛機）", emoji:"✈️", chunks:"fl-y"},
      // ⚠️ 原本照「只收關鍵字」拆成 fight，中文卻寫「撲滅（火）」——等於把 fight
      // 這個字教成「滅火」。課本原文是 fight fires，整個收才不會教錯。
      // （太一 2026-09-13 抓到）複合詞不拆音塊，跟 potato chips 一樣。
      {w:"fight fires", pos:"v.", zh:"滅火",       emoji:"🔥", chunks:""}
    ]},

    // Unit 3 L4 Illnesses ＋ Unit 4 L1 Family
    { id:"2026-09-23", title:"9 / 23", sub:"星期三 · U3 生病 · U4 家人", words:[
      // 課本 L4 教的是生病，但 cold 更常用的是「冷的」，兩個意思都給。
      {w:"cold",         pos:"n./adj.", zh:"感冒；冷的", emoji:"🤧", chunks:"c-old"},
      {w:"fever",        pos:"n.", zh:"發燒",       emoji:"🌡️", chunks:"fe-ver"},
      {w:"stomachache",  pos:"n.", zh:"肚子痛",     emoji:"🤢", chunks:"stom-ach-ache"},
      {w:"headache",     pos:"n.", zh:"頭痛",       emoji:"🤕", chunks:"head-ache"},
      {w:"parents",      pos:"n.", zh:"爸爸媽媽",   emoji:"👨‍👩‍👧", chunks:"par-ents"},
      {w:"grandparents", pos:"n.", zh:"爺爺奶奶",   emoji:"👴", chunks:"grand-par-ents"},
      // au 在這裡唸 /æ/，跟 autumn／August 的 /ɔ/ 不一樣（例外，老師要示範）。
      {w:"aunt",         pos:"n.", zh:"阿姨、姑姑", emoji:"👩", chunks:"au-nt"},
      {w:"uncle",        pos:"n.", zh:"叔叔、舅舅", emoji:"👨", chunks:"un-cle"}
    ]},

    // Unit 4 Getting Together：L1 剩下 ＋ L2 Things on the Table ＋ L4 第一國
    { id:"2026-09-25", title:"9 / 25", sub:"星期五 · U4 餐桌上的東西", words:[
      // ou 在這裡唸 /ʌ/（跟 could／house 都不同），例外，老師要示範。
      {w:"cousin", pos:"n.", zh:"表（堂）兄弟姊妹", emoji:"👦", chunks:"cou-sin"},
      {w:"fork",   pos:"n.", zh:"叉子",             emoji:"🍴", chunks:"f-ork"},
      // k 不發音 —— silent 欄位會把那個字母畫淡，字仍然是完整的。
      {w:"knife",  pos:"n.", zh:"刀子",             emoji:"🔪", chunks:"kn-ife", silent:"k"},
      {w:"spoon",  pos:"n.", zh:"湯匙",             emoji:"🥄", chunks:"sp-oon"},
      {w:"plate",  pos:"n.", zh:"盤子",             emoji:"🍽️", chunks:"pl-ate"},
      {w:"bowl",   pos:"n.", zh:"碗",               emoji:"🥣", chunks:"b-owl"},
      {w:"cup",    pos:"n.", zh:"杯子",             emoji:"🥤", chunks:"c-up"},
      {w:"Mexico", pos:"n.", zh:"墨西哥",           emoji:"🇲🇽", chunks:"Mex-i-co"}
    ]},

    // Unit 4 L4 Countries 剩下 ＋ Unit 5 L1 Adjectives
    { id:"2026-09-27", title:"9 / 27", sub:"星期日 · U4 國家 · U5 形容詞", words:[
      {w:"Japan",   pos:"n.",   zh:"日本",         emoji:"🇯🇵", chunks:"Ja-pan"},
      {w:"Russia",  pos:"n.",   zh:"俄羅斯",       emoji:"🇷🇺", chunks:"Rus-sia"},
      // Türkiye 是土耳其 2022 年起的正式國名寫法，課本用這個拼法，ü 上面兩點不能省。
      {w:"Türkiye", pos:"n.",   zh:"土耳其",       emoji:"🇹🇷", chunks:"Tür-ki-ye"},
      {w:"tall",    pos:"adj.", zh:"高的",         emoji:"📏", chunks:"t-all"},
      {w:"short",   pos:"adj.", zh:"矮的、短的",   emoji:"📐", chunks:"sh-ort"},
      {w:"old",     pos:"adj.", zh:"年紀大的、舊的", emoji:"👴", chunks:"o-ld"},
      {w:"young",   pos:"adj.", zh:"年輕的",       emoji:"👶", chunks:"y-oung"},
      {w:"quick",   pos:"adj.", zh:"快的",         emoji:"⚡", chunks:"qu-ick"}
    ]},

    // Unit 5：L1 剩下 ＋ 人物 ＋ L2 Adjectives 開頭
    { id:"2026-09-28", title:"9 / 28", sub:"星期一 · U5 人物與形容詞", words:[
      {w:"slow",  pos:"adj.", zh:"慢的",       emoji:"🐢", chunks:"sl-ow"},
      {w:"man",   pos:"n.",   zh:"男人",       emoji:"👨", chunks:"m-an"},
      {w:"woman", pos:"n.",   zh:"女人",       emoji:"👩", chunks:"wom-an"},
      {w:"boy",   pos:"n.",   zh:"男孩",       emoji:"👦", chunks:"b-oy"},
      {w:"girl",  pos:"n.",   zh:"女孩",       emoji:"👧", chunks:"g-irl"},
      {w:"thick", pos:"adj.", zh:"厚的",       emoji:"📚", chunks:"th-ick"},
      {w:"thin",  pos:"adj.", zh:"薄的、瘦的", emoji:"📄", chunks:"th-in"},
      // clean 在課本出現兩次：U5L2 是形容詞「乾淨的」，寫作本 U2 是動詞「打掃」。
      // 同一個拼字、同一個進度紀錄，中文兩義一起給，不另外開一筆。
      {w:"clean", pos:"adj.", zh:"乾淨的；打掃", emoji:"🧹", chunks:"cl-ean"}
    ]},

    // Unit 5：L2 剩下 ＋ L4 Adjectives（科學）＋ 寫作本 U1 味道
    { id:"2026-09-30", title:"9 / 30", sub:"星期三 · U5 形容詞 · 寫作本味道", words:[
      {w:"dirty", pos:"adj.", zh:"髒的",   emoji:"🧦", chunks:"dir-ty"},
      {w:"baggy", pos:"adj.", zh:"寬鬆的", emoji:"👖", chunks:"bag-gy"},
      {w:"tight", pos:"adj.", zh:"緊的",   emoji:"👖", chunks:"t-ight"},
      {w:"hard",  pos:"adj.", zh:"硬的",   emoji:"🪨", chunks:"h-ard"},
      {w:"soft",  pos:"adj.", zh:"軟的",   emoji:"🧸", chunks:"s-oft"},
      {w:"heavy", pos:"adj.", zh:"重的",   emoji:"🏋️", chunks:"heav-y"},
      {w:"light", pos:"adj.", zh:"輕的",   emoji:"🪶", chunks:"l-ight"},
      {w:"sweet", pos:"adj.", zh:"甜的",   emoji:"🍭", chunks:"sw-eet"}
    ]},

    // 寫作本 Seedlings U1 My Strange Pizza（味道）＋ U3 A Messy Bedroom 開頭
    { id:"2026-10-02", title:"10 / 2", sub:"星期五 · 寫作本 味道與房間", words:[
      {w:"sour",   pos:"adj.", zh:"酸的",   emoji:"🍋", chunks:"s-our"},
      {w:"salty",  pos:"adj.", zh:"鹹的",   emoji:"🧂", chunks:"salt-y"},
      {w:"bitter", pos:"adj.", zh:"苦的",   emoji:"🍫", chunks:"bit-ter"},
      {w:"spicy",  pos:"adj.", zh:"辣的",   emoji:"🌶️", chunks:"spi-cy"},
      {w:"greasy", pos:"adj.", zh:"油膩的", emoji:"🍔", chunks:"greas-y"},
      {w:"bed",    pos:"n.",   zh:"床",     emoji:"🛏️", chunks:"b-ed"},
      {w:"desk",   pos:"n.",   zh:"書桌",   emoji:"🪑", chunks:"d-esk"},
      {w:"lamp",   pos:"n.",   zh:"檯燈",   emoji:"💡", chunks:"l-amp"}
    ]},

    // 寫作本 U3 剩下 ＋ U2 Weekly Activities（片語只收關鍵字）
    { id:"2026-10-04", title:"10 / 4", sub:"星期日 · 寫作本 房間與每週活動", words:[
      {w:"dresser",    pos:"n.", zh:"五斗櫃", emoji:"🗄️", chunks:"dress-er"},
      {w:"bookcase",   pos:"n.", zh:"書櫃",   emoji:"📚", chunks:"book-case"},
      {w:"mirror",     pos:"n.", zh:"鏡子",   emoji:"🪞", chunks:"mir-ror"},
      // 課本是 have an art lesson，複合名詞整個留
      {w:"art lesson", pos:"n.", zh:"美術課", emoji:"🎨", chunks:""},
      // ride my bike → 取 bike；go swimming → 取 swim；do puzzles → 取 puzzle
      {w:"bike",       pos:"n.", zh:"腳踏車", emoji:"🚲", chunks:"b-ike"},
      {w:"swim",       pos:"v.", zh:"游泳",   emoji:"🏊", chunks:"sw-im"},
      {w:"puzzle",     pos:"n.", zh:"拼圖",   emoji:"🧩", chunks:"puz-zle"},
      {w:"yoga",       pos:"n.", zh:"瑜珈",   emoji:"🧘", chunks:"yo-ga"}
    ]}
  ]
};
