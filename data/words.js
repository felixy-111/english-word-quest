// 單字大冒險 ── 單字資料
//
// 單元＝日期，一天 5 個字，全部都要寫。提案是週一到週五，所以只排平日。
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
  version: "cs3-2026-09-14",
  units: [
    // 來源：安親班 CS3（9/7，Lily 老師）指定的拼字考單字。主題 Save the Earth。
    { id:"2026-09-14", title:"9 / 14", sub:"星期一", words:[
      // 這課的作業是 Write 6 ways to save the earth，「plant trees（種樹）」是標準答案，
      // 所以用動詞「種植」而不是名詞「植物」——ARASAAC 抓到的圖也正是動手種下去那張。
      {w:"plant",   pos:"v.", zh:"種植", emoji:"🌱", chunks:"pl-ant"},
      {w:"paper",   pos:"n.", zh:"紙",   emoji:"📄", chunks:"pa-per"},
      {w:"plastic", pos:"n.", zh:"塑膠", emoji:"🥤", chunks:"plas-tic"},
      {w:"recycle", pos:"v.", zh:"回收", emoji:"♻️", chunks:"re-cy-cle"},
      // 老師寫的是大寫 Earth（地球，專有名詞），拼字考要大寫，別改成小寫。
      // 不切音塊的理由：ear 在 hear／near／year 唸 /ɪr/，但 earth／early／learn 唸 /ɜr/。
      // 對小三來說這是例外，切成 ear-th 會教他唸成「eer-th」，所以整個記。
      {w:"Earth",   pos:"n.", zh:"地球", emoji:"🌍", chunks:"", sight:true}
    ]}
  ]
};
