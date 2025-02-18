document.addEventListener('DOMContentLoaded', async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado || !usuarioLogado.logado) {
        window.location.href = '../login/index.html';
        return;
    }

    try {
        const response = await fetch('/perfil', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': usuarioLogado.usuario  // Envia o usuário no cabeçalho
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar perfil");
        }

        const perfil = await response.json();

        // Atualiza a página com os dados recebidos do servidor
        document.getElementById('nome').textContent = perfil.nome;
        document.getElementById('usuario').textContent = perfil.usuario;
        document.getElementById('endereco').textContent = perfil.endereco;
        document.getElementById('bairro').textContent = perfil.bairro;
        document.getElementById('cidade').textContent = perfil.cidade;
        document.getElementById('telefone').textContent = perfil.telefone;
    } catch (error) {
        console.error('Erro:', error);
    }
});