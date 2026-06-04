import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const appJs = await readFile(new URL("../src/app.js", import.meta.url), "utf8");

test("uses the updated cross-market radar naming", () => {
  assert.match(html, /<title>AI-ris<\/title>/);
  assert.match(html, /<h1>AI-ris<\/h1>/);
  assert.match(html, /追踪跨市主题，发现ETF线索/);
  assert.match(html, /data-page-tab="radar" type="button">跨市雷达<\/button>/);
});

test("removes the old eyebrow label", () => {
  assert.doesNotMatch(html, /美股主题到A股ETF映射/);
});

test("exposes the people radar tab and render target", () => {
  assert.match(html, /data-page-tab="people" type="button">人物雷达<\/button>/);
  assert.match(html, /class="people-section hidden" data-page-panel="people"/);
});

test("app renders people radar controls and events", () => {
  assert.match(appJs, /peopleData/);
  assert.match(appJs, /renderPeopleSection/);
  assert.match(appJs, /data-person-id/);
  assert.match(appJs, /person_filter/);
  assert.match(appJs, /person_sort/);
});

test("people radar render includes PRD-required labels", () => {
  assert.match(appJs, /首次喊单时间/);
  assert.match(appJs, /喊单以来涨跌幅/);
  assert.match(appJs, /会议\/场景/);
  assert.match(appJs, /信息来源/);
  assert.match(appJs, /可信度/);
  assert.match(appJs, /不构成投资建议/);
});

test("people radar binds person tabs, filters, sorting, and image fallback", () => {
  assert.match(appJs, /bindPeopleEvents/);
  assert.match(appJs, /person_tab_change/);
  assert.match(appJs, /data-person-filter/);
  assert.match(appJs, /data-person-sort/);
  assert.match(appJs, /handlePersonImageError/);
});
