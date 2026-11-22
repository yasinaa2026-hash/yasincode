import test from "node:test";
import assert from "node:assert/strict";
import { parseYasin, compileToHtml } from "../src/engine.js";

test("parses English commands", () => {
  const result = parseYasin('site "Demo"\nheading "Hello"\ntext "World"\nbutton "Go"');
  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.instructions.map((item) => item.type), ["site", "heading", "text", "button"]);
});

test("parses Arabic commands", () => {
  const result = parseYasin('موقع "تجربة"\nعنوان "مرحباً"\nنص "أهلاً"\nزر "ابدأ"');
  assert.equal(result.errors.length, 0);
  assert.equal(result.instructions.length, 4);
});

test("requires one site command", () => {
  const result = parseYasin('heading "Hello"');
  assert.ok(result.errors.some((error) => error.message.includes("needs a site command")));
});

test("escapes HTML entered as text", () => {
  const result = compileToHtml('site "Demo"\nheading "<script>alert(1)</script>"');
  assert.equal(result.errors.length, 0);
  assert.ok(result.html.includes("&lt;script&gt;"));
  assert.ok(!result.html.includes("<script>alert(1)</script>"));
});

test("rejects an unsafe background value", () => {
  const result = compileToHtml('site "Demo"\nbackground "red; color: red"');
  assert.ok(result.errors.length > 0);
});
