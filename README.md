# 六芒星の村 — 白から、組む。 / Hexagram Village

北海道・弟子屈・美留和に建てる**六芒星のリトリート村**の、本人の声で読む紙芝居＋販売資料。
A self-narrated kamishibai pitch + sales deck for a hexagram-shaped retreat village in Teshikaga, Hokkaido.

**Live:** https://yukihamada.github.io/hexagram-village/

## 意味 / The meaning
六芒星＝二つの三角。のぼる三角＝**体・頭・祭**（道場・AI・音楽フェス）、くだる三角＝**泊・食・癒**（宿・食堂・温泉）。中心に火と大ドーム道場。

## スケール / Scale
初期 1棟・約10人 → 将来 村全体・約100人（同型キャビンを増やすと、村がまた六芒星になる）。

## 中身 / Contents
- 8場面の本人声ナレーション紙芝居（Koe クローン声 / m5 Qwen-TTS）
- パース9点（Gemini 生成イメージ）＋暮らしギャラリー
- **パース × BIM** を同じ枠でトグル — bim.house 実モデル（一体＝村全体16棟 / 個別＝1棟）
  - 一体: https://bim.house/u-100-sps7g2ip （構造 PASS）
  - 個別: https://bim.house/u-house-bje402lx （houki・構造 PASS）

## ローカルで見る / Run locally
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## テスト / Test
```bash
python3 tests/test_smoke.py
```

## デプロイ / Deploy
`git push origin master` → GitHub Pages が自動ビルド（`fly deploy` 直叩きはしない方針）。

## 注記 / Note
パースは生成イメージ、BIM は bim.house 実データ。**本予約・公開の前に法務ゲート**（建築確認＋構造判定／旅館業 簡易宿所許可／自然公園法届出／森林法1ha）。
