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
                'Authorization': usuarioLogado.usuario
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar perfil");
        }

        const perfil = await response.json();

        document.getElementById('nome').textContent = perfil.nome;
        document.getElementById('usuario').textContent = perfil.usuario;
        document.getElementById('endereco').textContent = perfil.endereco;
        document.getElementById('bairro').textContent = perfil.bairro;
        document.getElementById('cidade').textContent = perfil.cidade;
        document.getElementById('telefone').textContent = perfil.telefone;

        // Definir a foto do usuário
        const fotoPerfil = document.getElementById('foto-perfil');
        const caminhoImagem = `../images/${perfil.usuario}.png`;
        console.log(caminhoImagem);

        fetch(caminhoImagem)
            .then(response => {
                if (response.ok) {
                    fotoPerfil.src = caminhoImagem;
                } else {
                    fotoPerfil.src = '../images/default.png';
                }
            })
            .catch(() => {
                fotoPerfil.src = '../images/default.png';
            });

    } catch (error) {
        console.error('Erro:', error);
    }
});
