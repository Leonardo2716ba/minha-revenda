import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

async function criarTabelaRevendedores(id, nome, bairro, cidade, telefone){
    const db = await open({
        filename: './database/minha-revenda.db',
        driver: sqlite3.Database,
    });

    db.run(`CREATE TABLE IF NOT EXISTS revendedores (id INTEGER PRIMARY KEY, nome TEXT, bairro TEXT, cidade TEXT, telefone TEXT)`)
}

criarTabelaRevendedores();
