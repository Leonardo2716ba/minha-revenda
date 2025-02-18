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
        console.log("Perfil recebido:", perfil);

        document.getElementById('formprod').addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita o recarregamento da página
            console.log("Perfil recebido:", perfil);

            const iddono = perfil.id;
            const nome = document.getElementById('nome').value;
            const preco = document.getElementById('preco').value;
            const quantidade = document.getElementById('quantidade').value;
            const descricao = document.getElementById('descricao').value;
            const fotoInput = document.getElementById('foto');
            const img = fotoInput.files[0];

            if (!img) {
                console.error("Nenhuma imagem selecionada.");
                return;
            }

            const reader = new FileReader();

            reader.onload = async function (event) {
                const fotoBase64 = event.target.result; // Base64 da imagem
            
                try {
                    const response = await fetch('/cadastrar-produto', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nome, iddono, preco, quantidade, descricao, foto: fotoBase64 }),
                    });

                    const mensagem = document.getElementById('mensagem');
                    if (response.ok) {
                        mensagem.textContent = 'Cadastro realizado com sucesso!';
                        mensagem.style.color = 'green';
                        document.getElementById('formprod').reset();
                    } else {
                        const errorText = await response.text();
                        mensagem.textContent = `Erro: ${errorText}`;
                        mensagem.style.color = 'red';
                    }
                } catch (error) {
                    console.error('Erro ao cadastrar:', error);
                    const mensagem = document.getElementById('mensagem');
                    mensagem.textContent = 'Erro ao conectar com o servidor.';
                    mensagem.style.color = 'red';
                }
            };

            reader.readAsDataURL(img);
        });

    } catch (error) {
        console.error('Erro:', error);
    }
});

// document.getElementById('formCadastro').addEventListener('submit', async (event) => {
//     event.preventDefault(); // Evita o recarregamento da página
    
//     const iddono = perfil.id;
//     const nome = document.getElementById('nome').value;
//     const preco = document.getElementById('preco').value;
//     const quantidade = document.getElementById('quantidade').value;
//     const descricao = document.getElementById('descricao').value;
//     const foto = document.getElementById('preco').value;


//     try {
//         const response = await fetch('/cadastrar', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ nome, iddono, preco, quantidade, descricao, foto}),
//         });

//         const mensagem = document.getElementById('mensagem');
//         if (response.ok) {
//             mensagem.textContent = 'Cadastro realizado com sucesso!';
//             mensagem.style.color = 'green';
//             document.getElementById('formCadastro').reset();
//         } else {
//             const errorText = await response.text();
//             mensagem.textContent = `Erro: ${errorText}`;
//             mensagem.style.color = 'red';
//         }
//     } catch (error) {
//         console.error('Erro ao cadastrar:', error);
//         const mensagem = document.getElementById('mensagem');
//         mensagem.textContent = 'Erro ao conectar com o servidor.';
//         mensagem.style.color = 'red';
//     }
// });

console.log("Perfil recebido:", perfil)
