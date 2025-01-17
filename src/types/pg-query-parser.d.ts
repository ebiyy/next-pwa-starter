declare module "pg-query-parser" {
  interface PgValue {
    String?: { str: string };
    Integer?: { ival: number };
  }

  interface PgConst {
    A_Const: {
      val: PgValue;
    };
  }

  interface ResTarget {
    ResTarget: {
      name: string;
    };
  }

  interface InsertStmt {
    InsertStmt: {
      relation: {
        relname: string;
      };
      cols: ResTarget[];
      selectStmt: {
        ValuesLists: (PgConst | null)[][];
      };
    };
  }

  interface RawStmt {
    RawStmt: {
      stmt: {
        InsertStmt?: InsertStmt["InsertStmt"];
      };
    };
  }

  interface ParseResult {
    query: RawStmt[];
  }

  export function parse(sql: string): ParseResult;
}
