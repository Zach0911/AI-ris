import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { peopleData } from "../src/peopleData.js";

const peopleIds = new Set(peopleData.people.map((person) => person.id));
const today = new Date("2026-06-05T00:00:00+08:00");

test("people radar includes three required person homepages", () => {
  assert.deepEqual(
    peopleData.people.map((person) => person.name),
    ["特朗普", "黄仁勋", "马斯克"],
  );

  for (const person of peopleData.people) {
    assert.ok(person.id);
    assert.ok(person.title);
    assert.ok(person.subtitle);
    assert.ok(person.image.src);
    assert.match(person.image.src, /^\.\/assets\/people\/.+\.webp$/);
    assert.ok(existsSync(person.image.src.replace("./", "")), `${person.image.src} should exist`);
    assert.match(person.image.fallbackSrc, /^https:\/\/images\.weserv\.nl\/\?url=upload\.wikimedia\.org\//);
    assert.ok(person.image.alt.includes(person.name));
  }
});

test("each person has at least one verified computable event record", () => {
  assert.ok(peopleData.events.length >= 23);

  for (const person of peopleData.people) {
    const events = peopleData.events.filter((event) => event.personId === person.id);
    assert.ok(events.length >= 5, `${person.name} should have at least five events`);

    for (const event of events) {
      assert.ok(peopleIds.has(event.personId));
      assert.ok(event.company);
      assert.ok(event.ticker);
      assert.notEqual(event.ticker, "私有");
      assert.notEqual(event.ticker, "DOGE");
      assert.match(event.firstMentionedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(new Date(`${event.firstMentionedAt}T00:00:00+08:00`) <= today);
      assert.equal(typeof event.returnSinceMention, "number");
      assert.equal(typeof event.firstDayReturn, "number");
      assert.ok(event.location);
      assert.ok(event.event);
      assert.ok(event.eventType);
      assert.ok(event.sourceName);
      assert.match(event.sourceUrl, /^https?:\/\//);
      assert.ok(["高", "中", "低"].includes(event.confidence));
      assert.ok(event.notes);
      assert.ok(event.priceBasis);
      assert.match(event.priceBasis.basisDate, /^\d{4}-\d{2}-\d{2}$/);
      assert.match(event.priceBasis.previousDate, /^\d{4}-\d{2}-\d{2}$/);
      assert.match(event.priceBasis.latestDate, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(typeof event.priceBasis.basisClose, "number");
      assert.equal(typeof event.priceBasis.previousClose, "number");
      assert.equal(typeof event.priceBasis.latestClose, "number");
      assert.ok(["nasdaq", "finance-all-in-one:yfinance"].some((source) => event.priceBasis.source.startsWith(source)));
    }
  }
});

test("people radar does not ship unverifiable placeholder data", () => {
  const serialized = JSON.stringify(peopleData);
  assert.doesNotMatch(serialized, /待核验/);
  assert.ok(peopleData.events.every((event) => event.ticker !== "私有"));
  assert.ok(peopleData.events.every((event) => event.ticker !== "DOGE"));
  assert.ok(peopleData.events.every((event) => event.ticker !== "SIGL"));
  assert.ok(peopleData.events.every((event) => event.company !== "Dogecoin"));
});

test("events are grouped by person and sorted by latest mention first", () => {
  for (const person of peopleData.people) {
    const events = peopleData.events.filter((event) => event.personId === person.id);
    const dates = events.map((event) => event.firstMentionedAt);
    assert.deepEqual(dates, [...dates].sort().reverse(), `${person.name} events should be date-desc`);
  }
});

test("people radar includes disclosure sources and policy links", () => {
  assert.ok(peopleData.disclosureSources.length >= 5);
  assert.ok(peopleData.policyLinks.length >= 6);

  for (const source of peopleData.disclosureSources) {
    assert.ok(peopleIds.has(source.personId));
    assert.ok(source.name);
    assert.match(source.url, /^https?:\/\//);
    assert.ok(source.fields.length >= 3);
    assert.ok(source.status);
  }

  for (const link of peopleData.policyLinks) {
    assert.ok(peopleIds.has(link.personId));
    assert.ok(link.theme);
    assert.ok(link.tickers.length >= 1);
    assert.ok(link.relation);
    assert.ok(link.evidence);
  }
});
