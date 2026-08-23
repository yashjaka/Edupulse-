import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : ({ query: async () => ({ rows: [] }) } as any);

export const db = process.env.DATABASE_URL ? drizzle(pool, { schema }) : (null as any);

export * from "./schema";
export * from "./mongodb";
