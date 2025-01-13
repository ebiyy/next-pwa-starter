/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import { afterAll, beforeAll, describe } from "bun:test";

// グローバル設定
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// テストセットアップのユーティリティ
export const setupTest = () => {
  beforeAll(() => {
    // テスト前の共通セットアップ
  });

  afterAll(() => {
    // テスト後のクリーンアップ
  });
};

export { expect, test, describe };
