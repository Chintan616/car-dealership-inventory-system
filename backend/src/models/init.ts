import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running database initialization...');
    await pool.query(schemaSql);
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  } finally {
    await pool.end();
  }
};

initDb();
