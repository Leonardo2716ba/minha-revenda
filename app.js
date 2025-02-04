import express from 'express';
import { initDatabase, inserirRevendedor, verificarUsuario } from './src/db.js';

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

app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const nome = await verificarUsuario(usuario, senha);

        if (nome) {
            res.status(200).json({ nome });
        } else {
            res.status(401).send('Usuário ou senha inválidos.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});


// Servir os arquivos estáticos do frontend
app.use(express.static('src'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

//atumalaca