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
        usuario VARCHAR(30) NOT NULL UNIQUE,
        endereco VARCHAR(100) NOT NULL, 
        bairro TEXT NOT NULL,
        cidade TEXT NOT NULL,
        telefone TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        foto TEXT
    )`);
    
    await db.exec(`CREATE TABLE IF NOT EXISTS descricao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_revendedor INTEGER NOT NULL,
        sobre TEXT,
        horario_funcionamento TEXT,
        formas_pagamento TEXT,
        FOREIGN KEY(id_revendedor) REFERENCES revendedores(id)
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        iddono INTEGER NOT NULL,
        preco REAL NOT NULL,
        quantidade INTEGER NOT NULL,
        descricao TEXT NOT NULL,
        foto BLOB NOT NULL,
        FOREIGN KEY(iddono) REFERENCES revendedores(id)
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS cidades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cidadei TEXT NOT NULL
        )`)

    console.log('Tabelas criadas/verificadas no banco de dados.');
    return db;
}

// Função para inserir revendedores
export async function inserirRevendedor(nome, usuario, endereco, bairro, cidade, telefone, senha) {
    const db = await initDatabase();
    await db.run(
        `INSERT INTO revendedores (nome, usuario, endereco, bairro, cidade, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nome, usuario, endereco, bairro, cidade, telefone, senha]
    );
}

// Função para inserir descrição do revendedor
export async function inserirDescricaoRevendedor(id_revendedor, sobre, horario_funcionamento, formas_pagamento) {
    const db = await initDatabase();
    await db.run(
        `INSERT INTO descricao (id_revendedor, sobre, horario_funcionamento, formas_pagamento) VALUES (?, ?, ?, ?)`,
        [id_revendedor, sobre, horario_funcionamento, formas_pagamento]
    );
}

export async function verificarUsuario(usuario, senha) {
    const db = await initDatabase();
    console.log('Iniciando verificação de usuario');
    const result = await db.get(
        `SELECT nome FROM revendedores WHERE usuario = ? AND senha = ?`,
        [usuario, senha]
    );

    return result ? result.nome : null;
}

// Função para obter descrição do revendedor
export async function obterDescricaoRevendedor(id_revendedor) {
    const db = await initDatabase();
    const result = await db.get(
        `SELECT * FROM descricao WHERE id_revendedor = ?`,
        [id_revendedor]
    );
    return result;
}