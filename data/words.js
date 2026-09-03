// 單字大冒險 ── 單字資料
// 資料來源：示範用種子資料（安親班單字表拿到後用 build_words.py 覆蓋）
//
// ⚠️ 兩種單元不要混在一起，這是整個設計的關鍵：
//   type:"phonics" 拼讀單元 —— 用字族（-at、-op）練「見字讀音」。字族內的字長得極像，
//                              **刻意不考中文意思**，因為形狀相似的字放同組記意思會嚴重互相干擾
//                              （Tinkham 1993/1997、Waring 1997、Nation 的 avoid interference 原則）。
//   type:"vocab"   詞彙單元 —— 記意思用。同一組的字要**刻意挑彼此不像的**：不同開頭字母、
//                              不同字族、不同詞性，環繞一個情境（thematic cluster）而不是同類清單。
//
// pos = 詞性（抄寫單要寫進練習本：英文／詞性／中文）
// sight:true = 不規則字，拼讀規則救不了，要整個字記起來（App 會標出來提醒）
window.EN_WORDS = {
  version: "seed-2026-09-04",
  units: [
    {
      id: 1, type: "phonics", title: "-at ／ -an 家族", sub: "短母音 a ‧ 練唸不練意思", source: "示範單元",
      words: [
        {w:"cat", pos:"n.",  zh:"貓",     chunks:"c-at",  family:"-at"},
        {w:"hat", pos:"n.",  zh:"帽子",   chunks:"h-at",  family:"-at"},
        {w:"bat", pos:"n.",  zh:"蝙蝠",   chunks:"b-at",  family:"-at"},
        {w:"mat", pos:"n.",  zh:"墊子",   chunks:"m-at",  family:"-at"},
        {w:"rat", pos:"n.",  zh:"老鼠",   chunks:"r-at",  family:"-at"},
        {w:"sat", pos:"v.",  zh:"坐（過去式）", chunks:"s-at", family:"-at"},
        {w:"can", pos:"aux.",  zh:"能夠",   chunks:"c-an",  family:"-an"},
        {w:"man", pos:"n.",  zh:"男人",   chunks:"m-an",  family:"-an"},
        {w:"fan", pos:"n.",  zh:"電風扇", chunks:"f-an",  family:"-an"},
        {w:"pan", pos:"n.",  zh:"平底鍋", chunks:"p-an",  family:"-an"},
        {w:"ran", pos:"v.",  zh:"跑（過去式）", chunks:"r-an", family:"-an"},
        {w:"van", pos:"n.",  zh:"廂型車", chunks:"v-an",  family:"-an"}
      ]
    },
    {
      id: 2, type: "phonics", title: "-ig ／ -op ／ -en 家族", sub: "短母音 i、o、e ‧ 練唸不練意思", source: "示範單元",
      words: [
        {w:"big", pos:"adj.",  zh:"大的",   chunks:"b-ig",  family:"-ig"},
        {w:"pig", pos:"n.",  zh:"豬",     chunks:"p-ig",  family:"-ig"},
        {w:"dig", pos:"v.",  zh:"挖",     chunks:"d-ig",  family:"-ig"},
        {w:"wig", pos:"n.",  zh:"假髮",   chunks:"w-ig",  family:"-ig"},
        {w:"top", pos:"n.",  zh:"上面",   chunks:"t-op",  family:"-op"},
        {w:"hop", pos:"v.",  zh:"單腳跳", chunks:"h-op",  family:"-op"},
        {w:"mop", pos:"n.",  zh:"拖把",   chunks:"m-op",  family:"-op"},
        {w:"stop", pos:"v.", zh:"停止",   chunks:"st-op", family:"-op"},
        {w:"pen", pos:"n.",  zh:"筆",     chunks:"p-en",  family:"-en"},
        {w:"ten", pos:"num.",  zh:"十",     chunks:"t-en",  family:"-en"},
        {w:"hen", pos:"n.",  zh:"母雞",   chunks:"h-en",  family:"-en"},
        {w:"men", pos:"n.",  zh:"男人（複數）", chunks:"m-en", family:"-en"}
      ]
    },
    {
      id: 3, type: "vocab", title: "學校的一天", sub: "情境組 ‧ 刻意挑彼此不像的字", source: "示範單元",
      // 12 個字的開頭字母全部不同、字族不重複、名詞/動詞/形容詞混合 —— 這是詞彙單元該長的樣子。
      // 對照組（不要這樣編）：pencil / pen / ruler / eraser / marker / crayon 全是筆狀文具，會互相干擾。
      words: [
        {w:"book", pos:"n.",   zh:"書",     chunks:"b-oo-k",   family:"", sent:"This book is new.",       sentZh:"這本書是新的。"},
        {w:"write", pos:"v.",  zh:"寫",     chunks:"",         family:"", sight:true,
                                                                sent:"I write my name.",        sentZh:"我寫我的名字。"},
        {w:"desk", pos:"n.",   zh:"書桌",   chunks:"d-e-sk",   family:"", sent:"Put it on the desk.",     sentZh:"把它放在書桌上。"},
        {w:"open", pos:"v.",   zh:"打開",   chunks:"o-pen",    family:"", sent:"Open your book.",         sentZh:"打開你的書。"},
        {w:"new", pos:"adj.",    zh:"新的",   chunks:"n-ew",     family:"", sent:"I have a new bag.",       sentZh:"我有一個新書包。"},
        {w:"chair", pos:"n.",  zh:"椅子",   chunks:"ch-air",   family:"", sent:"Sit on the chair.",       sentZh:"坐在椅子上。"},
        {w:"read", pos:"v.",   zh:"讀",     chunks:"r-ea-d",   family:"", sent:"We read together.",       sentZh:"我們一起讀。"},
        {w:"friend", pos:"n.", zh:"朋友",   chunks:"",         family:"", sight:true,
                                                                sent:"He is my friend.",        sentZh:"他是我的朋友。"},
        {w:"happy", pos:"adj.",  zh:"快樂的", chunks:"hap-py",   family:"", sent:"I am happy today.",       sentZh:"我今天很快樂。"},
        {w:"lunch", pos:"n.",  zh:"午餐",   chunks:"l-un-ch",  family:"", sent:"Lunch is at twelve.",     sentZh:"午餐是十二點。"},
        {w:"eat", pos:"v.",    zh:"吃",     chunks:"ea-t",     family:"", sent:"We eat lunch here.",      sentZh:"我們在這裡吃午餐。"},
        {w:"tired", pos:"adj.",  zh:"累的",   chunks:"ti-red",   family:"", sent:"I am tired now.",         sentZh:"我現在很累。"}
      ]
    }
  ]
};
