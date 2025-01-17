/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test";
import React from "react";
import {
  byRole,
  createCacheKey,
  createSnapshot,
  getByTestId,
  testId,
} from "../../src/lib/test-utils";

describe("test-utils", () => {
  describe("testId", () => {
    test("generates correct data-testid attribute", () => {
      const id = "test-button";
      const result = testId(id);
      expect(result).toEqual({ "data-testid": "test-button" });
    });

    test("handles special characters in ID", () => {
      const id = "test:button@2.0";
      const result = testId(id);
      expect(result).toEqual({ "data-testid": "test:button@2.0" });
    });
  });

  describe("getByTestId", () => {
    test("generates correct selector", () => {
      const id = "test-button";
      const result = getByTestId(id);
      expect(result).toBe('[data-testid="test-button"]');
    });

    test("escapes special characters in selector", () => {
      const id = 'test"button';
      const result = getByTestId(id);
      expect(result).toBe('[data-testid="test\\"button"]');
    });
  });

  describe("byRole", () => {
    test("generates basic role selector", () => {
      const result = byRole("button");
      expect(result).toBe('[role="button"]');
    });

    test("includes aria-label when name is provided", () => {
      const result = byRole("button", { name: "Submit" });
      expect(result).toBe('[role="button"][aria-label="Submit"]');
    });

    test("includes aria-level when level is provided", () => {
      const result = byRole("heading", { level: 1 });
      expect(result).toBe('[role="heading"][aria-level="1"]');
    });

    test("includes aria-selected when selected is provided", () => {
      const result = byRole("tab", { selected: true });
      expect(result).toBe('[role="tab"][aria-selected="true"]');
    });

    test("includes aria-checked when checked is provided", () => {
      const result = byRole("checkbox", { checked: false });
      expect(result).toBe('[role="checkbox"][aria-checked="false"]');
    });

    test("includes aria-pressed when pressed is provided", () => {
      const result = byRole("button", { pressed: true });
      expect(result).toBe('[role="button"][aria-pressed="true"]');
    });

    test("includes aria-expanded when expanded is provided", () => {
      const result = byRole("button", { expanded: false });
      expect(result).toBe('[role="button"][aria-expanded="false"]');
    });

    test("includes aria-hidden when hidden is provided", () => {
      const result = byRole("region", { hidden: true });
      expect(result).toBe('[role="region"][aria-hidden="true"]');
    });

    test("combines multiple options correctly", () => {
      const result = byRole("button", {
        name: "Menu",
        expanded: true,
        hidden: false,
      });
      expect(result).toBe(
        '[role="button"][aria-label="Menu"][aria-expanded="true"][aria-hidden="false"]'
      );
    });

    test("ignores undefined options", () => {
      const result = byRole("button", {
        name: "Submit",
        expanded: undefined,
        hidden: undefined,
      });
      expect(result).toBe('[role="button"][aria-label="Submit"]');
    });
  });

  describe("createSnapshot", () => {
    test("sets default options", () => {
      const element = React.createElement("div", null, "Test Element");
      const result = createSnapshot(element);
      expect(result).toEqual({
        element,
        threshold: 0.1,
        allowSizeDifference: true,
      });
    });

    test("accepts custom options", () => {
      const element = React.createElement("div", null, "Test Element");
      const result = createSnapshot(element, {
        threshold: 0.2,
        allowSizeDifference: false,
      });
      expect(result).toEqual({
        element,
        threshold: 0.2,
        allowSizeDifference: false,
      });
    });

    test("handles empty element", () => {
      const element = React.createElement(React.Fragment);
      const result = createSnapshot(element);
      expect(result).toEqual({
        element,
        threshold: 0.1,
        allowSizeDifference: true,
      });
    });
  });

  describe("createCacheKey", () => {
    test("generates consistent keys", () => {
      const prefix = "test";
      const params = {
        b: 2,
        a: 1,
        c: { nested: true },
      };
      const result = createCacheKey(prefix, params);
      const expected = 'test:a=1&b=2&c={"nested":true}';
      expect(result).toBe(expected);
    });

    test("handles empty params", () => {
      const prefix = "test";
      const params = {};
      const result = createCacheKey(prefix, params);
      expect(result).toBe("test:");
    });

    test("handles complex nested objects", () => {
      const prefix = "test";
      const params = {
        array: [1, 2, { nested: true }],
        object: { a: 1, b: { c: 3 } },
        null: null,
        undefined: undefined,
      };
      const result = createCacheKey(prefix, params);
      expect(result).toBe(
        'test:array=[1,2,{"nested":true}]&null=null&object={"a":1,"b":{"c":3}}&undefined=undefined'
      );
    });

    test("handles special characters in prefix and values", () => {
      const prefix = "test:prefix";
      const params = {
        "key:with:colon": "value:with:colon",
        "key@with@at": "value@with@at",
      };
      const result = createCacheKey(prefix, params);
      expect(result).toBe(
        'test:prefix:key:with:colon="value:with:colon"&key@with@at="value@with@at"'
      );
    });
  });
});
