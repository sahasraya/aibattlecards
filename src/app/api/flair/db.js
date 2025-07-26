import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.user from src/app/api/.env.user explicitly
dotenv.config({ path: path.resolve(process.cwd(), 'src/app/api/flair/.env.flair') });

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

export default pool;
