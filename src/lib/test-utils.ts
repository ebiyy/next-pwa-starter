import type { ReactElement } from "react";

/**
 * テスト用のdata-testid属性を生成する
 * @param id - テストID
 * @returns data-testid属性のオブジェクト
 */
export const testId = (id: string) => ({
  "data-testid": id,
});

/**
 * テスト用のdata-testid属性を持つ要素を取得する
 * @param id - テストID
 * @returns テスト用の要素セレクター
 */
export const getByTestId = (id: string) => {
  // ダブルクォートをエスケープ
  const escapedId = id.replace(/"/g, '\\"');
  return `[data-testid="${escapedId}"]`;
};

/**
 * ロールベースのセレクターを生成する
 * @param role - ARIA role
 * @param options - セレクターオプション
 * @returns ロールベースのセレクター
 */
export const byRole = (
  role: string,
  options: {
    name?: string;
    level?: number;
    selected?: boolean;
    checked?: boolean;
    pressed?: boolean;
    expanded?: boolean;
    hidden?: boolean;
  } = {}
) => {
  let selector = `[role="${role}"]`;

  if (options.name) {
    selector += `[aria-label="${options.name}"]`;
  }
  if (options.level) {
    selector += `[aria-level="${options.level}"]`;
  }
  if (options.selected !== undefined) {
    selector += `[aria-selected="${options.selected}"]`;
  }
  if (options.checked !== undefined) {
    selector += `[aria-checked="${options.checked}"]`;
  }
  if (options.pressed !== undefined) {
    selector += `[aria-pressed="${options.pressed}"]`;
  }
  if (options.expanded !== undefined) {
    selector += `[aria-expanded="${options.expanded}"]`;
  }
  if (options.hidden !== undefined) {
    selector += `[aria-hidden="${options.hidden}"]`;
  }

  return selector;
};

/**
 * スナップショットの差分を許容する範囲を設定する
 * @param element - Reactコンポーネント
 * @param options - スナップショットのオプション
 */
export const createSnapshot = (
  element: ReactElement,
  options: {
    threshold?: number;
    allowSizeDifference?: boolean;
  } = {}
) => {
  const { threshold = 0.1, allowSizeDifference = true } = options;
  return {
    element,
    threshold,
    allowSizeDifference,
  };
};

/**
 * キャッシュキーを生成する
 * @param prefix - キャッシュキーのプレフィックス
 * @param params - キャッシュキーに含めるパラメータ
 * @returns キャッシュキー
 */
export const createCacheKey = (
  prefix: string,
  params: Record<string, unknown>
) => {
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join("&");
  return `${prefix}:${sortedParams}`;
};
