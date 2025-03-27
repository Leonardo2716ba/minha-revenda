document.addEventListener('DOMContentLoaded', async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Verificar autenticação
    if (!usuarioLogado || !usuarioLogado.logado) {
        window.location.href = '../login/index.html';
        return;
    }

    // Elementos do DOM
    const elements = {
        nome: document.getElementById('nome'),
        usuario: document.getElementById('usuario'),
        endereco: document.getElementById('endereco'),
        bairro: document.getElementById('bairro'),
        cidade: document.getElementById('cidade'),
        telefone: document.getElementById('telefone'),
        sobre: document.getElementById('sobre-texto'),
        horario: document.getElementById('horario-texto'),
        formasPagamento: document.getElementById('formas-texto'),
        fotoPerfil: document.getElementById('foto-perfil')
    };

    // Função para exibir erro
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<p>${message}</p>`;
        document.querySelector('main').prepend(errorDiv);
    }

    try {
        // Buscar dados do perfil
        const response = await fetch('/perfil', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': usuarioLogado.usuario
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao carregar perfil');
        }

        console.log('Dados recebidos:', data); // Para depuração

        // Preencher informações básicas
        elements.nome.textContent = data.nome || "Não informado";
        elements.usuario.textContent = data.usuario || "Não informado";
        elements.endereco.textContent = data.endereco || "Não informado";
        elements.bairro.textContent = data.bairro || "Não informado";
        elements.cidade.textContent = data.cidade || "Não informado";
        elements.telefone.textContent = data.telefone || "Não informado";

        // Preencher informações de descrição
        elements.sobre.textContent = data.sobre || "Nenhuma informação cadastrada";
        elements.horario.textContent = data.horario_funcionamento || "Não definido";
        elements.formasPagamento.textContent = data.formas_pagamento || "Não especificado";

        // Carregar foto de perfil
        const fotoUrl = `../images/${data.usuario}.png?${new Date().getTime()}`; // Cache buster
        const img = new Image();
        img.src = fotoUrl;
        
        img.onload = () => {
            elements.fotoPerfil.src = fotoUrl;
        };
        
        img.onerror = () => {
            elements.fotoPerfil.src = '../images/default.png';
        };

    } catch (error) {
        console.error('Erro:', error);
        showError(`Erro ao carregar perfil: ${error.message}`);
    }
});