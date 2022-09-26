import { parseCsv } from "./main";

test("parses single unquoted row without line terminator", () => {
  expect(parseCsv("")).toEqual([[]]);
  expect(parseCsv(" ")).toEqual([[" "]]);
  expect(parseCsv("a,b")).toEqual([["a", "b"]]);
});

test("parses multiple unquoted rows", () => {
  expect(parseCsv("a,b\nc,d")).toEqual([
    ["a", "b"],
    ["c", "d"],
  ]);
});

test("considers CRLF as one line terminator", () => {
  expect(parseCsv("a,b\r\nc,d")).toEqual([
    ["a", "b"],
    ["c", "d"],
  ]);
});

test("handles empty rows", () => {
  expect(parseCsv("a,b\r\n\r\r\n\nc,d")).toEqual([
    ["a", "b"],
    [],
    [],
    [],
    ["c", "d"],
  ]);
});

test("handles a mix of line terminator formats in a single file", () => {
  expect(parseCsv("a,b\r\nc\rd\ne")).toEqual([["a", "b"], ["c"], ["d"], ["e"]]);
});

test("does not skip over empty cells at the start, middle, or end of a row", () => {
  expect(parseCsv("a,,b\r\n,c\rd,\n")).toEqual([
    ["a", "", "b"],
    ["", "c"],
    ["d", ""],
    [],
  ]);
});

test("parses a cell as quoted if it starts with a quote", () => {
  expect(parseCsv('a,",b\r\n",c\rd,\n')).toEqual([
    ["a", ",b\r\n", "c"],
    ["d", ""],
    [],
  ]);
});

test("ends a cell at an ending quote, even if not followed by a comma", () => {
  expect(parseCsv('a,",b\r\n"c\rd,\n')).toEqual([
    ["a", ",b\r\n", "c"],
    ["d", ""],
    [],
  ]);
});

test("does not throw an exception if a quoted cell never ends", () => {
  expect(parseCsv('a,",b\r\n,c\rd,\n')).toEqual([["a", ",b\r\n,c\rd,\n"]]);
});

test("adds blank row if file ends with line terminator", () => {
  expect(parseCsv("\n")).toEqual([[], []]);
  expect(parseCsv(" \n")).toEqual([[" "], []]);
  expect(parseCsv("a,b\n")).toEqual([["a", "b"], []]);
});
