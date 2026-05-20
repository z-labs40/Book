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

    // Query Users
    const users = await client.query("SELECT id, name, email, role FROM \"user\";");
    console.log("\n--- USERS ---");
    console.log(JSON.stringify(users.rows, null, 2));

    // Query Books
    const books = await client.query("SELECT id, title, available, \"sellerId\" FROM \"book\";");
    console.log("\n--- BOOKS ---");
    console.log(JSON.stringify(books.rows, null, 2));

    // Query Cart Items
    const cart = await client.query("SELECT * FROM \"cart_item\";");
    console.log("\n--- CART ITEMS ---");
    console.log(JSON.stringify(cart.rows, null, 2));

    // Query Orders
    const orders = await client.query("SELECT * FROM \"order\";");
    console.log("\n--- ORDERS ---");
    console.log(JSON.stringify(orders.rows, null, 2));

  } catch (err) {
    console.error("Database query failed:", err.message);
  } finally {
    await client.end();
  }
}

run();
