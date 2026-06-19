#!/usr/bin/env python3
"""六芒星の村サイトのスモークテスト（依存なし・標準ライブラリのみ）。
   実行: python3 tests/test_smoke.py  /  exit 0 = 全合格"""
import os, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def read(p): return open(os.path.join(ROOT, p), encoding="utf-8").read()
html = read("index.html")
js   = read("app.js")
hdr  = read("_headers")

checks = []
def ok(name, cond): checks.append((name, bool(cond)))

# --- SEO / meta ---
ok("title あり", "<title>" in html and "六芒星" in html)
m = re.search(r'<meta name="description" content="([^"]+)"', html)
ok("description 50-160字", m and 50 <= len(m.group(1)) <= 160)
ok("canonical", 'rel="canonical"' in html)
ok("og:image", 'property="og:image"' in html)
ok("JSON-LD", 'application/ld+json' in html and 'schema.org' in html)
ok("hreflang (ja/en/x-default)", html.count('hreflang=') >= 3)
ok("favicon", 'favicon.svg' in html)
ok("URLは pages.dev に統一", "hexagram-village.pages.dev" in html and "yukihamada.github.io" not in html)

# --- 外部化 / CSP安全 ---
ok("CSS外部化", '<link rel="stylesheet" href="styles.css">' in html)
ok("JS外部化", '<script src="app.js"' in html)
ok("インライン<style>なし", "<style" not in html)
ok("インラインstyle属性なし", 'style="' not in html and "style='" not in html)
# 実行スクリプトは外部のみ（ld+json データブロックは可）
ok("実行インラインscriptなし", len(re.findall(r"<script(?![^>]*application/ld\+json)[^>]*>", html)) == 1)  # app.js の1本だけ

# --- _headers (Cloudflare) ---
ok("CSP (unsafe-inline/eval なし)", "Content-Security-Policy" in hdr and "unsafe-inline" not in hdr and "unsafe-eval" not in hdr)
ok("HSTS", "Strict-Transport-Security" in hdr)
ok("X-Content-Type-Options", "X-Content-Type-Options: nosniff" in hdr)
ok("X-Frame-Options", "X-Frame-Options" in hdr)
ok("Cache-Control", "Cache-Control" in hdr)
ok("frame-src bim.house 許可", "frame-src https://bim.house" in hdr)

# --- 紙芝居 / 構造 (app.js) ---
ok("9場面のSCENES", len(re.findall(r"au:'audio/s\d\.mp3'", js)) == 9)
ok("本人声 audio 参照", "audio/s0.mp3" in js and "audio/s7.mp3" in js and "audio/s8.mp3" in js)
ok("ハイブリッド場面(六角×六芒星)", "hybrid_aerial.png" in js and "六角" in js)
ok("MU FES 本人声3場面", all(f"audio/{x}.mp3" in js for x in ("f1","f2","f3")))
ok("MU FES セクション", 'id="mufes"' in html and "着る火" in html)
ok("i18n 言語トグル", "data-en" in html and 'id="langToggle"' in html and "applyLang" in js)
ok("パース×BIM トグル", 'class="bimcol pb"' in html and 'data-m="bim"' in html)
ok("BIM 一体(村全体16棟)", "u-100-sps7g2ip" in html)
ok("BIM 個別(1棟)", "u-house-bje402lx" in html)
ok("法務ゲート明記", "簡易宿所" in html and "自然公園法" in html)

# --- 同梱アセット存在 ---
for rel in ["styles.css","app.js","_headers","favicon.svg","robots.txt","sitemap.xml",
            "img/hero.png","img/cabin.png","img/village.png","img/festival.png","img/dome.png",
            "img/room.png","img/onsen.png","img/arrival.png","img/meaning.png",
            "audio/s0.mp3","audio/s7.mp3"]:
    ok(f"ファイル存在 {rel}", os.path.exists(os.path.join(ROOT, rel)))

passed = sum(1 for _, c in checks if c)
for name, c in checks:
    print(("  ok  " if c else "FAIL  ") + name)
print(f"\n{passed}/{len(checks)} passed")
sys.exit(0 if passed == len(checks) else 1)
