document.getElementById('formLogin').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o recarregamento da página

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, senha }),
        });

        const mensagem = document.getElementById('mensagem');
        if (response.ok) {
            const data = await response.json();
            if (data.nome) {
                mensagem.textContent = `Bem-vindo, ${data.nome}!`;
                mensagem.style.color = 'green';
                localStorage.setItem('usuarioLogado', JSON.stringify({ nome: data.nome, logado: true }));
            } else {
                mensagem.textContent = 'Usuário ou senha inválidos.';
                mensagem.style.color = 'red';
            }
        } else {
            const errorText = await response.text();
            mensagem.textContent = `Erro: ${errorText}`;
            mensagem.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        const mensagem = document.getElementById('mensagem');
        mensagem.textContent = 'Erro ao conectar com o servidor.';
        mensagem.style.color = 'red';
    }
});
