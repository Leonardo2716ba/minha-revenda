import express from 'express';
import multer from "multer";
import fs from "fs";
import path from "path";

import { initDatabase, verificarUsuario } from './src/db.js';

const app = express();
const port = 3000;

// Middleware para interpretar JSON e dados enviados pelo formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para cadastrar revendedores
app.post('/cadastrar', async (req, res) => {
    console.log('body -> ', req.body);
    const { nome, usuario, endereco, bairro, cidade, telefone, senha } = req.body;
    
    try {
        const db = await initDatabase();
        await db.run(
            `INSERT INTO revendedores (nome, usuario, endereco, bairro, cidade, telefone, senha) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nome, usuario, endereco, bairro, cidade, telefone, senha]
        );
        console.log('Cadastro realizado com sucesso:', req.body); // Log do cadastro
        res.status(201).send('Revendedor cadastrado com sucesso!\nRetorne para o menu e faça o login');
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).send('O número de telefone/nome de usuário já está cadastrado.');
        } else {
            res.status(500).send('ao cadastrar o revendedor.');
        }
    } 
});

app.post('/cadastrar-produto', async (req, res) => {
    const {nome, iddono, preco, quantidade, descricao, foto} = req.body
    console.log('body ->');
    console.log('nome ->', nome);
    console.log('iddono ->', iddono);
    console.log('preco ->', preco);
    console.log('quantidade ->', quantidade);
    console.log('foto ->', foto);
    console.log('passou');

    try {
        const db = await initDatabase();
        await db.run(
            `INSERT INTO produtos (nome, iddono, preco, quantidade, descricao, foto) VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, iddono, preco, quantidade, descricao, foto]
        );
        res.status(201).send('Produto cadastrado com sucesso!');
    } catch (error){
        console.error('Erro ao cadastrar:', error);
    }
})

app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const nome = await verificarUsuario(usuario, senha);

        if (nome) {
            res.status(200).json({ nome, usuario });
        } else {
            res.status(401).send('Usuário ou senha inválidos.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

app.get('/perfil', async (req, res) => {
    const usuario = req.headers.authorization;

    try {
        const db = await initDatabase();
        
        // 1. Buscar informações básicas
        const perfil = await db.get(
            `SELECT id, nome, usuario, endereco, bairro, cidade, telefone 
             FROM revendedores WHERE usuario = ?`, 
            [usuario]
        );

        if (!perfil) {
            return res.status(404).json({ 
                error: 'Perfil não encontrado' 
            });
        }

        // 2. Buscar descrição
        const descricao = await db.get(
            `SELECT sobre, horario_funcionamento, formas_pagamento 
             FROM descricao WHERE id_revendedor = ?`,
            [perfil.id]
        );

        // 3. Combinar resultados
        const resultado = {
            ...perfil,
            ...(descricao || {}) // Retorna campos vazios se não houver descrição
        };

        res.status(200).json(resultado);

    } catch (error) {
        console.error('Erro no endpoint /perfil:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            details: error.message 
        });
    }
});

app.put('/editar-perfil', async (req, res) => {
    const usuario = req.headers.authorization;
    const { 
        nome, endereco, bairro, cidade, telefone, senha, sobre, horario_funcionamento, formas_pagamento 
    } = req.body;

    if (!usuario) {
        return res.status(400).send('Usuário não especificado');
    }

    try {
        const db = await initDatabase();
        const revendedor = await db.get(
            `SELECT id, senha, foto FROM revendedores WHERE usuario = ?`, 
            [usuario]
        );

        if (!revendedor) {
            return res.status(404).send('Usuário não encontrado');
        }

        const novaSenha = senha || revendedor.senha;

        await db.run(
            `UPDATE revendedores SET 
                nome = ?, endereco = ?, bairro = ?, cidade = ?, telefone = ?, senha = ? 
             WHERE usuario = ?`,
            [nome, endereco, bairro, cidade, telefone, novaSenha, usuario]
        );

        const descricaoExistente = await db.get(
            `SELECT id FROM descricao WHERE id_revendedor = ?`,
            [revendedor.id]
        );

        if (descricaoExistente) {
            await db.run(
                `UPDATE descricao SET 
                    sobre = ?, horario_funcionamento = ?, formas_pagamento = ?
                 WHERE id_revendedor = ?`,
                [sobre, horario_funcionamento, formas_pagamento, revendedor.id]
            );
        } else {
            await db.run(
                `INSERT INTO descricao (id_revendedor, sobre, horario_funcionamento, formas_pagamento) 
                 VALUES (?, ?, ?, ?)`,
                [revendedor.id, sobre, horario_funcionamento, formas_pagamento]
            );
        }

        res.status(200).send('Perfil atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao editar perfil:', error);
        res.status(500).send('Erro interno do servidor');
    }
});


// Servir os arquivos estáticos do frontend
app.use(express.static('src'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

const upload = multer({ dest: "../images/" });

app.post("/upload-foto", upload.single("foto"), async (req, res) => {
    const usuario = req.body.usuario;
    if (!usuario || !req.file) {
        return res.status(400).json({ mensagem: "Usuário ou arquivo não especificado!" });
    }

    const fotoNova = path.join(process.cwd(), `src/images/${usuario}.png`);
    if (fs.existsSync(fotoNova)) {
        fs.unlinkSync(fotoNova);
    }
    fs.renameSync(req.file.path, fotoNova);

    try {
        const db = await initDatabase();
        await db.run("UPDATE revendedores SET foto = ? WHERE usuario = ?", [fotoNova, usuario]);
        res.status(200).json({ mensagem: "Foto enviada com sucesso!", foto: `/images/${usuario}.png` });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao salvar no banco de dados" });
    }
});

app.delete("/remover-foto", (req, res) => {
    const usuario = req.headers.authorization;
    const caminhoFoto = path.join(process.cwd(), `src/images/${usuario}.png`);

    if (fs.existsSync(caminhoFoto)) {
        fs.unlinkSync(caminhoFoto);
        return res.status(200).json({ mensagem: "Foto removida com sucesso!" });
    }

    res.status(404).json({ mensagem: "Foto não encontrada!" });
});

