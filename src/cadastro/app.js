import express from 'express';
import { initDatabase, inserirRevendedor } from './src/cadastro/db.js';

const app = express();
const port = 3000;

// Middleware para interpretar JSON e dados enviados pelo formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para cadastrar revendedores
app.post('/cadastrar', async (req, res) => {
    const { nome, bairro, cidade, telefone, senha } = req.body;

    try {
        await inserirRevendedor(nome, bairro, cidade, telefone, senha);
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

