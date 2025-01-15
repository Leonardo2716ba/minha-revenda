import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 3000;

// Middleware para interpretar JSON e dados enviados pelo formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para inicializar o banco de dados
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
        telefone TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    )`);

    console.log('Tabela criada/verificada no banco de dados.');
    return db;
}

// Endpoint para cadastrar revendedores
app.post('/cadastrar', async (req, res) => {
    const { nome, bairro, cidade, telefone, senha } = req.body;

    try {
        const db = await initDatabase();
        await db.run(
            `INSERT INTO revendedores (nome, bairro, cidade, telefone, senha) VALUES (?, ?, ?, ?, ?)`,
            [nome, bairro, cidade, telefone, senha]
        );
        res.status(201).send('Revendedor cadastrado com sucesso!');
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).send('Erro: O número de telefone já está cadastrado.');
        } else {
            console.error(error);
            res.status(500).send('Erro ao cadastrar o revendedor.');
        }
    }
});

// Servir os arquivos estáticos do frontend
app.use(express.static('src'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

