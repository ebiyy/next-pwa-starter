#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "pg-query-parser";

interface TableData {
  name: string;
  columns: string[];
  values: any[][];
}

/**
 * SQLファイルからINSERT文を解析してデータを抽出
 */
function extractDataFromSQL(sqlContent: string): TableData[] {
  const tables: TableData[] = [];
  const ast = parse(sqlContent);

  for (const stmt of ast.query) {
    if (stmt.RawStmt.stmt.InsertStmt) {
      const insert = stmt.RawStmt.stmt.InsertStmt;
      const tableName = insert.relation.relname;

      // カラム名の抽出
      const columns = insert.cols.map((col: any) => col.ResTarget.name);

      // 値の抽出
      const values = insert.selectStmt.ValuesLists.map((valueList: any) =>
        valueList.map((value: any) => {
          if (value.A_Const) {
            return (
              value.A_Const.val.String?.str || value.A_Const.val.Integer?.ival
            );
          }
          return null;
        })
      );

      tables.push({ name: tableName, columns, values });
    }
  }

  return tables;
}

/**
 * 抽出したデータをTypeScriptのモックデータに変換
 */
function generateMockData(tables: TableData[]): Record<string, string> {
  const mockData: Record<string, string> = {};

  for (const table of tables) {
    const typeName = table.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    const dataName = `${table.name}Data`;

    const objects = table.values.map((valueList) => {
      const obj: Record<string, any> = {};
      table.columns.forEach((col, index) => {
        obj[col] = valueList[index];
      });
      return obj;
    });

    mockData[table.name] = `import type { ${typeName} } from "@/types/schema";

export const ${dataName}: ${typeName}[] = ${JSON.stringify(objects, null, 2)};
`;
  }

  return mockData;
}

/**
 * メイン処理
 */
async function main() {
  try {
    // 開発環境のシードデータを読み込み
    const sqlPath = resolve(process.cwd(), "supabase/seed.development.sql");
    const sqlContent = readFileSync(sqlPath, "utf-8");

    // データを抽出
    const tables = extractDataFromSQL(sqlContent);

    // モックデータを生成
    const mockData = generateMockData(tables);

    // ファイルに書き出し
    for (const [tableName, content] of Object.entries(mockData)) {
      const filePath = resolve(
        process.cwd(),
        "src/lib/mock-data",
        `${tableName}.ts`
      );
      writeFileSync(filePath, content);
      console.log(`Generated: ${filePath}`);
    }

    // インデックスファイルを生成
    const indexContent = Object.keys(mockData)
      .map((tableName) => `export * from "./${tableName}";`)
      .join("\n");

    const indexPath = resolve(process.cwd(), "src/lib/mock-data/index.ts");
    writeFileSync(indexPath, indexContent);
    console.log(`Generated: ${indexPath}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
