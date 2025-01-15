import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Função para inicializar o banco de dados
export async function initDatabase() {
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

// Função para inserir revendedores
export async function inserirRevendedor(nome, bairro, cidade, telefone, senha) {
    const db = await initDatabase();
    await db.run(
        `INSERT INTO revendedores (nome, bairro, cidade, telefone, senha) VALUES (?, ?, ?, ?, ?)`,
        [nome, bairro, cidade, telefone, senha]
    );
}

