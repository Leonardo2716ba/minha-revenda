document.addEventListener("DOMContentLoaded", async function () {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado || !usuarioLogado.logado) {
        window.location.href = "../login/index.html";
        return;
    }

    const mensagem = document.getElementById("mensagem");
    const fotoPerfil = document.getElementById("fotoPerfil");

    async function carregarPerfil() {
        try {
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
            document.getElementById("nome").value = dados.nome || "";
            document.getElementById("telefone").value = dados.telefone || "";
            document.getElementById("endereco").value = dados.endereco || "";
            document.getElementById("bairro").value = dados.bairro || "";
            document.getElementById("cidade").value = dados.cidade || "";
            document.getElementById("sobre").value = dados.sobre || "";
            document.getElementById("horario_funcionamento").value = dados.horario_funcionamento || "";
            document.getElementById("formas_pagamento").value = dados.formas_pagamento || "";

            if (dados.foto) {
                fotoPerfil.src = dados.foto;
            }
        } catch (erro) {
            mensagem.innerHTML = "<p style='color: red;'>Erro ao carregar perfil.</p>";
            console.error(erro);
        }
    }

    carregarPerfil();

    document.getElementById("btnEnviarFoto").addEventListener("click", async function () {
        const inputFoto = document.getElementById("foto");
        if (!inputFoto.files.length) {
            mensagem.innerHTML = "<p style='color: red;'>Selecione uma foto primeiro!</p>";
            return;
        }

        const formData = new FormData();
        formData.append("foto", inputFoto.files[0]);
        formData.append("usuario", usuarioLogado.usuario);

        try {
            const resposta = await fetch("/upload-foto", {
                method: "POST",
                body: formData
            });

            const resultado = await resposta.json();
            fotoPerfil.src = resultado.foto;
            mensagem.innerHTML = "<p style='color: green;'>Foto atualizada com sucesso!</p>";
        } catch (erro) {
        }
    });

    document.getElementById("btnRemoverFoto").addEventListener("click", async function () {
        try {
            const resposta = await fetch("/remover-foto", {
                method: "DELETE",
                headers: {
                    "Authorization": usuarioLogado.usuario
                }
            });

            if (!resposta.ok) {
                throw new Error("Erro ao remover foto.");
            }

            fotoPerfil.src = "default.png";
            mensagem.innerHTML = "<p style='color: green;'>Foto removida com sucesso!</p>";
        } catch (erro) {
            mensagem.innerHTML = "<p style='color: red;'>Erro ao remover foto.</p>";
            console.error(erro);
        }
    });
});