import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3000;

// Middleware to parse JSON data from POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to initialize the database and table
async function initDatabase() {
    const db = await open({
        filename: './database/minha-revenda.db',
        driver: sqlite3.Database,
    });

    await db.exec(`CREATE TABLE IF NOT EXISTS revendedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        bairro TEXT NOT NULL,
        cidade TEXT NOT NULL,
        telefone TEXT NOT NULL,
        senha TEXT NOT NULL,
    )`);

    console.log('Tabela criada/verificada no banco de dados.');
    return db;
}

// Endpoint to handle form submissions
app.post('/cadastrar', async (req, res) => {
    const { nome, bairro, cidade, telefone, senha = req.body;

    try {
        const db = await initDatabase();
        await db.run(`INSERT INTO revendedores (nome, bairro, cidade, telefone, senha) VALUES (?, ?, ?, ?, ?)`, [
            nome, bairro, cidade, telefone, senha,
        ]);
        res.status(201).send('Revendedor cadastrado com sucesso!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar o revendedor.');
    }
});

// Serve the frontend files
app.use(express.static('src'));

// Start the server
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

