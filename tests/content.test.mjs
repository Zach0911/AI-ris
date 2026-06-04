import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("uses the updated cross-market radar naming", () => {
  assert.match(html, /<title>AI-ris<\/title>/);
  assert.match(html, /<h1>AI-ris<\/h1>/);
  assert.match(html, /追踪跨市主题，发现ETF线索/);
  assert.match(html, /data-page-tab="radar" type="button">跨市雷达<\/button>/);
});

test("removes the old eyebrow label", () => {
  assert.doesNotMatch(html, /美股主题到A股ETF映射/);
});
