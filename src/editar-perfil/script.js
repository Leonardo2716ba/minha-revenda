document.addEventListener("DOMContentLoaded", async function () {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado || !usuarioLogado.logado) {
        window.location.href = "../login/index.html";
        return;
    }

    const mensagem = document.getElementById("mensagem");

    // Função para carregar os dados do perfil
    async function carregarPerfil() {
        try {
            console.log("Solicitando perfil para usuário:", usuarioLogado.usuario);
            const resposta = await fetch("/perfil", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": usuarioLogado.usuario
                }
            });

            if (!resposta.ok) {
                throw new Error("Erro ao carregar perfil.");
            }

            const dados = await resposta.json();

            console.log("Dados recebidos do servidor:", dados);

            document.getElementById("nome").value = dados.nome;
            document.getElementById("telefone").value = dados.telefone;
            document.getElementById("endereco").value = dados.endereco;
            document.getElementById("bairro").value = dados.bairro;
            document.getElementById("cidade").value = dados.cidade;
        } catch (erro) {
            console.error("Erro ao buscar perfil:", erro);
            mensagem.innerHTML = "<p style='color: red;'>Erro ao carregar perfil.</p>";
        }
    }

    carregarPerfil();

    document.getElementById("formEditarPerfil").addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;
        const bairro = document.getElementById("bairro").value;
        const cidade = document.getElementById("cidade").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;

        if (senha && senha !== confirmarSenha) {
            mensagem.innerHTML = "<p style='color: red;'>As senhas não coincidem!</p>";
            return;
        }

        const dadosAtualizados = { nome, telefone, endereco, bairro, cidade };
        if (senha) {
            dadosAtualizados.senha = senha;
        }

        console.log("Enviando dados para atualização:", dadosAtualizados);
        console.log("Usuário enviado no cabeçalho:", usuarioLogado.usuario);

        try {
            const resposta = await fetch("/editar-perfil", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": usuarioLogado.usuario
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao atualizar perfil.");
            }

            mensagem.innerHTML = "<p style='color: green;'>Perfil atualizado com sucesso!</p>";
        } catch (erro) {
            console.error("Erro ao atualizar perfil:", erro);
            mensagem.innerHTML = "<p style='color: red;'>Erro ao atualizar perfil.</p>";
        }
    });
});
