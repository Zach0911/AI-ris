import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const appJs = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

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
  assert.match(appJs, /handlePersonImageError/);
});

test("people radar removes review-rejected filter and sort controls", () => {
  assert.doesNotMatch(appJs, /data-person-filter/);
  assert.doesNotMatch(appJs, /data-person-sort/);
  assert.doesNotMatch(appJs, /person_filter/);
  assert.doesNotMatch(appJs, /person_sort/);
  assert.doesNotMatch(appJs, /renderPersonFilters/);
});

test("people radar removes redundant hero labels and tag chips", () => {
  assert.doesNotMatch(appJs, /关键人物主页/);
  assert.doesNotMatch(appJs, /<p class="eyebrow">人物雷达<\/p>/);
  assert.doesNotMatch(appJs, /person-tags/);
  assert.doesNotMatch(css, /\.person-tags/);
});

test("people radar uses person-specific concept company heading and source-linked events", () => {
  assert.match(appJs, /\$\{person\.name\}概念/);
  assert.match(appJs, /class="event-link"/);
  assert.doesNotMatch(appJs, /\$\{person\.name\}概念公司/);
  assert.doesNotMatch(appJs, /当前人物喊单公司/);
  assert.doesNotMatch(appJs, /<small>\$\{event\.notes\}<\/small>/);
});

test("people radar applies latest copy and removes person-tab returns", () => {
  assert.match(appJs, /从影响力人物发声中发现市场信号/);
  assert.doesNotMatch(appJs, /跟着大人物看交易线索/);
  assert.doesNotMatch(appJs, /<em class="\$\{bestReturn/);
});

test("people radar exposes voice disclosure and policy views", () => {
  assert.match(appJs, /发声影响/);
  assert.match(appJs, /披露交易/);
  assert.match(appJs, /政策关联/);
  assert.match(appJs, /renderEvidenceChain/);
  assert.match(appJs, /renderDisclosureView/);
  assert.match(appJs, /renderPolicyView/);
  assert.match(css, /\.person-view-tabs/);
  assert.match(css, /\.disclosure-grid/);
  assert.match(css, /\.policy-grid/);
});

test("people radar sends GA4 analytics for key interactions", () => {
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-B4PWH30B3G/);
  assert.match(appJs, /trackSectionView/);
  assert.match(appJs, /section_view/);
  assert.match(appJs, /source_click/);
  assert.match(appJs, /person_image_loaded/);
  assert.match(appJs, /person_image_fallback/);
  assert.match(appJs, /person_image_failed/);
});

test("summary strongest card is not highlighted as selected", () => {
  assert.doesNotMatch(appJs, /summary-card-accent/);
  assert.doesNotMatch(css, /\.summary-card-accent/);
});

test("people table uses fixed columns for aligned headers and rows", () => {
  assert.match(appJs, /<colgroup>/);
  assert.match(css, /\.person-table col\.person-col-company/);
  assert.match(css, /\.person-table th:nth-child\(4\),\s*\.person-table td:nth-child\(4\)/s);
});

test("keeps the theme ranking table header visible while scrolling", () => {
  assert.match(
    css,
    /\.theme-list-head\s*{[^}]*position:\s*sticky;[^}]*top:\s*0;[^}]*z-index:\s*4;/s,
  );
});

test("keeps the left ranking panel aligned with the detail panel", () => {
  assert.doesNotMatch(css, /\.theme-list-panel\s*{[^}]*position:\s*sticky;/s);
});

test("exposes a FAQ entry for metric calculation methods", () => {
  assert.doesNotMatch(html, /class="page-tab" data-page-tab="faq"/);
  assert.match(html, /class="faq-link" data-page-tab="faq" type="button">指标口径<\/button>/);
  assert.match(html, /class="faq-section hidden" data-page-panel="faq"/);
  assert.match(appJs, /renderFaqSection/);
  assert.match(appJs, /指标如何计算/);
  assert.match(appJs, /美股强度/);
  assert.match(appJs, /映射分/);
  assert.match(appJs, /共振、传导、背离/);
  assert.match(appJs, /喊单以来涨跌幅/);
  assert.match(css, /\.faq-section/);
  assert.match(css, /\.faq-link/);
  assert.match(css, /\.faq-grid/);
});
