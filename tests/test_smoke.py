#!/usr/bin/env python3
"""六芒星の村サイトのスモークテスト（依存なし・標準ライブラリのみ）。
   実行: python3 tests/test_smoke.py  /  exit 0 = 全合格"""
import os, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

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

# --- 紙芝居 / 構造 ---
ok("8場面のSCENES", len(re.findall(r"au:'audio/s\d\.mp3'", html)) == 8)
ok("本人声 audio 参照", "audio/s0.mp3" in html and "audio/s7.mp3" in html)
ok("パース×BIM トグル", 'class="bimcol pb"' in html and 'data-m="bim"' in html)
ok("BIM 一体(村全体)", "u-100-sps7g2ip" in html)
ok("BIM 個別(1棟)", "u-house-bje402lx" in html)
ok("i18n 言語トグル", "data-en" in html and 'id="langToggle"' in html)
ok("法務ゲート明記", "簡易宿所" in html and "自然公園法" in html)

# --- 同梱アセット存在 ---
for rel in ["img/hero.png","img/cabin.png","img/festival.png","img/dome.png",
            "img/room.png","img/onsen.png","img/arrival.png",
            "audio/s0.mp3","audio/s7.mp3","favicon.svg","robots.txt","sitemap.xml"]:
    ok(f"ファイル存在 {rel}", os.path.exists(os.path.join(ROOT, rel)))

passed = sum(1 for _, c in checks if c)
for name, c in checks:
    print(("  ok  " if c else "FAIL  ") + name)
print(f"\n{passed}/{len(checks)} passed")
sys.exit(0 if passed == len(checks) else 1)
