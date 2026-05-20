const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log("Connected to database successfully!");

    // Delete orders related to the book to clean up
    await client.query("DELETE FROM \"order_item\" WHERE \"bookId\" = 'f8a5a960-66cd-4f5b-b283-3fe62a9b4506';");
    await client.query("DELETE FROM \"order\" WHERE \"bookId\" = 'f8a5a960-66cd-4f5b-b283-3fe62a9b4506';");
    console.log("Deleted old test orders.");

    // Update book to be available
    await client.query("UPDATE \"book\" SET \"available\" = true, \"status\" = 'active' WHERE id = 'f8a5a960-66cd-4f5b-b283-3fe62a9b4506';");
    console.log("Updated Operating System Projects book to be available = true.");

  } catch (err) {
    console.error("Database query failed:", err.message);
  } finally {
    await client.end();
  }
}

run();
