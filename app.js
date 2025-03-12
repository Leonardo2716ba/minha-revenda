import express from 'express';
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
    const usuario = req.headers.authorization;  // Obtém o usuário do cabeçalho

    if (!usuario) {
        return res.status(400).send('Usuário não especificado');
    }

    console.log("Usuário recebido:", usuario);

    try {
        const db = await initDatabase();
        const perfil = await db.get(
            `SELECT id, nome, usuario, endereco, bairro, cidade, telefone FROM revendedores WHERE usuario = ?`,
            [usuario]
        );
        console.log("Perfil recebido:", perfil);

        if (perfil) {
            res.status(200).json(perfil);
        } else {
            console.log("Perfil não encontrado para o usuário:", usuario);
            res.status(404).send('Perfil não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.put('/editar-perfil', async (req, res) => {
    const usuario = req.headers.authorization; // Obtém o usuário do cabeçalho
    const { nome, endereco, bairro, cidade, telefone, senha } = req.body;

    console.log("Usuário recebido:", usuario);
    console.log("Dados recebidos:", req.body);

    if (!usuario) {
        return res.status(400).send('Usuário não especificado');
    }

    try {
        const db = await initDatabase();
        
        // Buscar o usuário antes de atualizar
        const usuarioExiste = await db.get(`SELECT senha FROM revendedores WHERE usuario = ?`, [usuario]);

        if (!usuarioExiste) {
            return res.status(404).send('Usuário não encontrado.');
        }

        // Se a senha for vazia, manter a senha antiga
        const novaSenha = senha ? senha : usuarioExiste.senha;

        const result = await db.run(
            `UPDATE revendedores SET nome = ?, endereco = ?, bairro = ?, cidade = ?, telefone = ?, senha = ? WHERE usuario = ?`,
            [nome, endereco, bairro, cidade, telefone, novaSenha, usuario]
        );

        console.log("Linhas afetadas:", result.changes);

        if (result.changes > 0) {
            res.status(200).send('Perfil atualizado com sucesso!');
        } else {
            res.status(404).send('Usuário não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao editar perfil:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});




// Servir os arquivos estáticos do frontend
app.use(express.static('src'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});