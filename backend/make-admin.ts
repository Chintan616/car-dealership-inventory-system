import pool from './src/config/database';

async function makeEveryoneAdmin() {
  try {
    await pool.query("UPDATE users SET role = 'ADMIN'");
    console.log('Successfully updated all users to ADMIN role.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update users:', error);
    process.exit(1);
  }
}

makeEveryoneAdmin();
