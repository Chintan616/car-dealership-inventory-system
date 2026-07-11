import { pool } from './src/config/db';

async function migrate() {
  try {
    await pool.query('ALTER TABLE vehicles ADD COLUMN image_url VARCHAR(255);');
    console.log('Successfully added image_url column to vehicles table.');
    process.exit(0);
  } catch (error: any) {
    // If it already exists, that's fine
    if (error.code === '42701') {
      console.log('Column image_url already exists.');
      process.exit(0);
    }
    console.error('Failed to run migration:', error);
    process.exit(1);
  }
}

migrate();
