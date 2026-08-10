/**
* SIT725 – 5.3D Validation Tests (MANDATORY TEMPLATE)
*
* HOW TO RUN: (Node.js 18+ is required)
* 1. Start MongoDB
* 2. Start your server (npm start)
* 3. node validation-tests.js
*
* DO NOT MODIFY:
* - Output format (TEST|, SUMMARY|, COVERAGE|)
* - test() function signature
* - Exit behaviour
* - coverageTracker object
* - Logging structure
*
* YOU MUST:
* - Modify makeValidBook() to satisfy your schema rules
* - Add sufficient tests to meet coverage requirements
*/

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
CREATE_FAIL: 0,
UPDATE_FAIL: 0,
TYPE: 0,
REQUIRED: 0,
BOUNDARY: 0,
LENGTH: 0,
TEMPORAL: 0,
UNKNOWN_CREATE: 0,
UNKNOWN_UPDATE: 0,
IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
console.log("SIT725_VALIDATION_TESTS");
console.log(`BASE_URL=${BASE_URL}`);
console.log(`API_BASE=${API_BASE}`);
console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
console.log(
`TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
);
}

function logSummary() {
const failed = results.filter(r => !r.pass).length;
console.log(
`SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
);
return failed === 0;
}

function logCoverage() {
console.log(
`COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
`|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
`|TYPE=${coverageTracker.TYPE}` +
`|REQUIRED=${coverageTracker.REQUIRED}` +
`|BOUNDARY=${coverageTracker.BOUNDARY}` +
`|LENGTH=${coverageTracker.LENGTH}` +
`|TEMPORAL=${coverageTracker.TEMPORAL}` +
`|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
`|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
`|IMMUTABLE=${coverageTracker.IMMUTABLE}`
);
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
const res = await fetch(`${BASE_URL}${path}`, {
method,
headers: { "Content-Type": "application/json" },
body: body ? JSON.stringify(body) : undefined,
});

const text = await res.text();
return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

const { status } = await http(method, path, body);
const pass = status === expected;

const result = { id, name, method, path, expected, actual: status, pass };
results.push(result);
logResult(result);

const safeTags = Array.isArray(tags) ? tags : [];

safeTags.forEach(tag => {
if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
coverageTracker[tag]++;
}
});
}

// =============================
// STUDENT MUST MODIFY THESE
// (values below match models/book.model.js:
//  id: /^[A-Za-z0-9-]{1,40}$/, immutable
//  title: 1-150 chars, author: 2-100 chars
//  year: integer 1450-current year
//  genre: 2-50 chars, summary: 10-1000 chars
//  price: Decimal128, >= 0)
// =============================

function makeValidBook(id) {
return {
id,
title: "Test Driven Development",
author: "Kent Beck",
year: 2002,
genre: "Technology",
summary: "A practical guide to writing tests before code to improve design and confidence.",
price: "39.99"
};
}

function makeValidUpdate() {
return {
title: "Test Driven Development (Updated)",
author: "Kent Beck",
year: 2003,
genre: "Technology",
summary: "An updated practical guide to writing tests before code to improve design.",
price: "42.50"
};
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

const uniqueId = `b${Date.now()}`;
logHeader(uniqueId);

const createPath = API_BASE;
const updatePath = (id) => `${API_BASE}/${id}`;

// ---- T01 Valid CREATE ----
await test({
id: "T01",
name: "Valid create",
method: "POST",
path: createPath,
expected: 201,
body: makeValidBook(uniqueId),
tags: []
});

// ---- T02 Duplicate ID ----
await test({
id: "T02",
name: "Duplicate ID",
method: "POST",
path: createPath,
expected: 409,
body: makeValidBook(uniqueId),
tags: ["CREATE_FAIL"]
});

// ---- T03 Immutable ID ----
await test({
id: "T03",
name: "Immutable ID on update",
method: "PUT",
path: updatePath(uniqueId),
expected: 400,
body: { ...makeValidUpdate(), id: "b999" },
tags: ["UPDATE_FAIL", "IMMUTABLE"]
});

// ---- T04 Unknown field CREATE ----
await test({
id: "T04",
name: "Unknown field CREATE",
method: "POST",
path: createPath,
expected: 400,
body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
});

// ---- T05 Unknown field UPDATE ----
await test({
id: "T05",
name: "Unknown field UPDATE",
method: "PUT",
path: updatePath(uniqueId),
expected: 400,
body: { ...makeValidUpdate(), hack: true },
tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
});

// =====================================
// ADDITIONAL TESTS (added by student)
// =====================================

// ---- T06 REQUIRED: missing title on CREATE ----
{
const body = makeValidBook(`b${Date.now()+2}`);
delete body.title;
await test({
id: "T06",
name: "Missing required field (title) on create",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "REQUIRED"]
});
}

// ---- T07 REQUIRED: empty author on UPDATE ----
{
const id7 = `b${Date.now()+3}`;
await test({ id: "SETUP07", name: "seed for T07", method: "POST", path: createPath, expected: 201, body: makeValidBook(id7), tags: [] });
await test({
id: "T07",
name: "Empty required field (author) on update",
method: "PUT",
path: updatePath(id7),
expected: 400,
body: { ...makeValidUpdate(), author: "" },
tags: ["UPDATE_FAIL", "REQUIRED"]
});
}

// ---- T08 TYPE: non-numeric year on CREATE ----
{
const body = makeValidBook(`b${Date.now()+4}`);
body.year = "not-a-number";
await test({
id: "T08",
name: "Non-numeric year rejected on create",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "TYPE"]
});
}

// ---- T09 TYPE: non-numeric price on UPDATE ----
{
const id9 = `b${Date.now()+5}`;
await test({ id: "SETUP09", name: "seed for T09", method: "POST", path: createPath, expected: 201, body: makeValidBook(id9), tags: [] });
await test({
id: "T09",
name: "Non-numeric price rejected on update",
method: "PUT",
path: updatePath(id9),
expected: 400,
body: { ...makeValidUpdate(), price: "not-a-price" },
tags: ["UPDATE_FAIL", "TYPE"]
});
}

// ---- T10 BOUNDARY: negative price rejected ----
{
const body = makeValidBook(`b${Date.now()+6}`);
body.price = "-0.01";
await test({
id: "T10",
name: "Negative price rejected (below minimum 0)",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "BOUNDARY"]
});
}

// ---- T11 BOUNDARY: year below minimum (1450) rejected ----
{
const body = makeValidBook(`b${Date.now()+7}`);
body.year = 1449;
await test({
id: "T11",
name: "Year below minimum (1450) rejected",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "BOUNDARY"]
});
}

// ---- T12 BOUNDARY: year at minimum (1450) accepted ----
{
const body = makeValidBook(`b${Date.now()+8}`);
body.year = 1450;
await test({
id: "T12",
name: "Year at minimum boundary (1450) accepted",
method: "POST",
path: createPath,
expected: 201,
body,
tags: ["BOUNDARY"]
});
}

// ---- T13 LENGTH: summary below minimum (10 chars) ----
{
const body = makeValidBook(`b${Date.now()+9}`);
body.summary = "short";
await test({
id: "T13",
name: "Summary below minimum length (10) rejected",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "LENGTH"]
});
}

// ---- T14 LENGTH: title exceeding maximum (150 chars) ----
{
const body = makeValidBook(`b${Date.now()+10}`);
body.title = "x".repeat(151);
await test({
id: "T14",
name: "Title exceeding maximum length (150) rejected",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "LENGTH"]
});
}

// ---- T15 LENGTH: id exceeding maximum (40 chars) ----
{
const body = makeValidBook("a".repeat(41));
await test({
id: "T15",
name: "id exceeding maximum length (40) rejected",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "LENGTH"]
});
}

// ---- T16 LENGTH: author below minimum (2 chars) ----
{
const body = makeValidBook(`b${Date.now()+11}`);
body.author = "A";
await test({
id: "T16",
name: "Author below minimum length (2) rejected",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "LENGTH"]
});
}

// ---- T17 LENGTH: genre below minimum (2 chars) ----
{
const body = makeValidBook(`b${Date.now()+12}`);
body.genre = "A";
await test({
id: "T17",
name: "Genre below minimum length (2) rejected",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "LENGTH"]
});
}

// ---- T18 TEMPORAL: future year rejected ----
{
const body = makeValidBook(`b${Date.now()+13}`);
body.year = new Date().getFullYear() + 5;
await test({
id: "T18",
name: "Future year rejected",
method: "POST",
path: createPath,
expected: 400,
body,
tags: ["CREATE_FAIL", "TEMPORAL"]
});
}

// ---- T19 UPDATE_FAIL: update non-existent book returns 404 ----
await test({
id: "T19",
name: "Update non-existent book returns 404",
method: "PUT",
path: updatePath("does-not-exist-xyz"),
expected: 404,
body: makeValidUpdate(),
tags: ["UPDATE_FAIL"]
});

// ---- T20 UPDATE_FAIL + LENGTH: summary too short on update ----
{
const id20 = `b${Date.now()+14}`;
await test({ id: "SETUP20", name: "seed for T20", method: "POST", path: createPath, expected: 201, body: makeValidBook(id20), tags: [] });
await test({
id: "T20",
name: "Summary below minimum length rejected on update",
method: "PUT",
path: updatePath(id20),
expected: 400,
body: { ...makeValidUpdate(), summary: "short" },
tags: ["UPDATE_FAIL", "LENGTH"]
});
}

const pass = logSummary();
logCoverage();

process.exit(pass ? 0 : 1);
}

run().catch(err => {
console.error("ERROR", err);
process.exit(2);
});
