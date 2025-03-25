document.addEventListener('DOMContentLoaded', async () =>{
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
        console.log("Perfil recebidos:", perfil);

        try{
            const response = await fetch('/meus_produtos',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': perfil.id
                }}
            )

            if (!response.ok) {
                throw new Error("Erro ao carregar produtos");
            }

            const produtos = await response.json();
            console.log("produtos utos -> ", produtos);
            preencherTabela(produtos);
            

        } catch (error) {
            console.error('Erro:', error);
        }

    } catch (error) {
        console.error('Erro:', error);
    }
});

function preencherTabela(produtos) {
    const tabelaBody = document.querySelector('#mytable'); 
    tabelaBody.innerHTML = '';

    produtos.forEach(produto => {
        
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td><img src="${produto.foto}" alt="${produto.nome}" width="150" height="150"></td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.descricao}</td>
        `;

        tabelaBody.appendChild(linha);
    });
}