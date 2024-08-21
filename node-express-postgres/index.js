const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
	user: 'postgres',
	password: '12345678',
	host: 'localhost',
	port: '5432',
	database: 'crud',
});

module.exports=client;