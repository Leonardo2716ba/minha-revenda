document.addEventListener("DOMContentLoaded", async function () {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado || !usuarioLogado.logado) {
        window.location.href = "../login/index.html";
        return;
    }

    const mensagem = document.getElementById("mensagem");

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

            // Preencher campos básicos
            document.getElementById("nome").value = dados.nome || "";
            document.getElementById("telefone").value = dados.telefone || "";
            document.getElementById("endereco").value = dados.endereco || "";
            document.getElementById("bairro").value = dados.bairro || "";
            document.getElementById("cidade").value = dados.cidade || "";
            
            // Preencher campos de descrição (se existirem)
            if (dados.sobre) document.getElementById("sobre").value = dados.sobre;
            if (dados.horario_funcionamento) document.getElementById("horario_funcionamento").value = dados.horario_funcionamento;
            if (dados.formas_pagamento) document.getElementById("formas_pagamento").value = dados.formas_pagamento;

        } catch (erro) {
            mensagem.innerHTML = "<p style='color: red;'>Erro ao carregar perfil.</p>";
            console.error(erro);
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
        const sobre = document.getElementById("sobre").value;
        const horario_funcionamento = document.getElementById("horario_funcionamento").value;
        const formas_pagamento = document.getElementById("formas_pagamento").value;

        if (senha && senha !== confirmarSenha) {
            mensagem.innerHTML = "<p style='color: red;'>As senhas não coincidem!</p>";
            return;
        }

        const dadosAtualizados = { 
            nome, 
            telefone, 
            endereco, 
            bairro, 
            cidade,
            sobre,
            horario_funcionamento,
            formas_pagamento
        };
        
        if (senha) {
            dadosAtualizados.senha = senha;
        }

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
            setTimeout(() => {
                window.location.href = "../perfil/index.html";
            }, 1500);
        } catch (erro) {
            mensagem.innerHTML = "<p style='color: red;'>Erro ao atualizar perfil.</p>";
            console.error(erro);
        }
    });

    // Upload de foto
    document.getElementById("btnEnviarFoto").addEventListener("click", async function () {
        const arquivo = document.getElementById("foto").files[0];
        if (!arquivo) {
            mensagem.innerHTML = "<p style='color: red;'>Nenhuma foto selecionada!</p>";
            return;
        }

        const formData = new FormData();
        formData.append("foto", arquivo);
        formData.append("usuario", usuarioLogado.usuario);

        try {
            const resposta = await fetch("/upload-foto", {
                method: "POST",
                body: formData
            });

            if (!resposta.ok) {
                throw new Error("Erro ao enviar foto.");
            }

            mensagem.innerHTML = "<p style='color: green;'>Foto de perfil atualizada!</p>";
        } catch (erro) {
            mensagem.innerHTML = "<p style='color: red;'>Erro ao enviar foto.</p>";
            console.error(erro);
        }
    });

    // Remoção de foto
    document.getElementById("btnRemoverFoto").addEventListener("click", async function () {
        if (!confirm("Tem certeza que deseja remover sua foto de perfil?")) {
            return;
        }

        try {
            const resposta = await fetch("/remover-foto", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": usuarioLogado.usuario
                }
            });

            if (!resposta.ok) {
                throw new Error("Erro ao remover foto.");
            }

            mensagem.innerHTML = "<p style='color: green;'>Foto removida com sucesso!</p>";
        } catch (erro) {
            mensagem.innerHTML = "<p style='color: red;'>Erro ao remover foto.</p>";
            console.error(erro);
        }
    });
});