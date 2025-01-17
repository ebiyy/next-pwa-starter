# huskyのTypeScriptチェック問題の解決

## 概要
huskyのpre-commitフックでTypeScriptのパスエイリアス解決が失敗する問題の解決
- パスエイリアス（@/*）を使用したTypeScriptのインポートがpre-commitフックで失敗する
- lint-stagedでのTypeScriptチェックが実行環境の違いにより失敗する
- 開発者の作業効率を低下させる問題の解決が必要

## 実装フェーズ

### 1. 問題の特定
- [ ] エラー内容の確認
  - コミット: `fix: TypeScriptパスエイリアス解決の問題を調査`
  - 対象ファイル:
    - src/lib/mock-data/*.ts
    - tsconfig.json
    - package.json
    - .husky/pre-commit
  - 検証項目:
    - TypeScriptのエラーメッセージを確認
    - パスエイリアスの設定を確認
    - lint-stagedの設定を確認
  - ロールバック:
    - 変更を加えない調査フェーズのため不要

### 2. 一時的な対応
- [ ] git commit --no-verifyの使用
  - コミット: `chore: 一時的にpre-commitフックをスキップ`
  - 検証項目:
    - コミットが正常に完了することを確認
  - ロールバック:
    - git reset --hard HEAD^

### 3. 恒久的な解決策
- [ ] lint-stagedの設定修正
  - コミット: `fix: lint-stagedの設定を修正`
  - 対象ファイル:
    - package.json
  - 検証項目:
    - pre-commitフックが正常に動作することを確認
    - TypeScriptのチェックが正しく行われることを確認
  - ロールバック:
    - package.jsonのlint-staged設定を元に戻す
    - git stashを使用して変更を退避

## メンテナンス
### 定期的な確認
- huskyのpre-commitフックの動作確認
- TypeScriptのパスエイリアス設定の確認
- lint-stagedの設定の見直し

## ロールバック戦略
### 設定の復元
- package.jsonのlint-staged設定を元に戻す
- git stashを使用して変更を退避

## 注意事項
- pre-commitフックでのTypeScriptチェックは重要だが、開発効率とのバランスを考慮する必要がある
- パスエイリアスの解決は開発環境とCI環境で同じように動作する必要がある
- 一時的な対応と恒久的な解決策を明確に区別する

## 解決策の候補
1. tsconfig.jsonのbaseUrlとpathsの設定を見直す
2. lint-stagedでのTypeScriptチェックを開発環境に合わせて調整する
3. プロジェクトのルートディレクトリを考慮したパス解決の仕組みを導入する