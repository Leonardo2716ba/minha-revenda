document.getElementById('formCadastro').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o recarregamento da página

    const nome = document.getElementById('nome').value;
    const usuario = document.getElementById('usuario').value;
    const endereco = document.getElementById('endereco').value
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, usuario, endereco, bairro, cidade, telefone, senha }),
        });

        const mensagem = document.getElementById('mensagem');
        if (response.ok) {
            mensagem.textContent = 'Cadastro realizado com sucesso!';
            mensagem.style.color = 'green';
            document.getElementById('formCadastro').reset();
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
});

document.addEventListener("DOMContentLoaded", async function () {
    const selectCidade = document.getElementById("cidade");

    try {
        const response = await fetch('/buscacidade', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }); // Chamada à API
        const cidades = await response.json();

        cidades.forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade.id;  // O valor armazenado será o ID
            option.textContent = cidade.cidadei; // O nome será exibido no dropdown
            selectCidade.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar cidades:", error);
    }
});
