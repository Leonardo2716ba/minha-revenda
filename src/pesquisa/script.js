
document.addEventListener("DOMContentLoaded", async() => {
// Obtém os parâmetros da URL
    const arg = getQuery();
    const Idcidade = getCityId();

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Search-Term': encodeURIComponent(arg),  // Passando o termo de pesquisa
        'City-Id': encodeURIComponent(Idcidade)    // Passando o ID da cidade
    });
    
    try {

        const response = await fetch('/pesquisa',{
            method: 'GET',
            headers: headers
        });
        if (!response.ok){
            throw new Error("Erro ao procurar produtos");
        }

        produtos = await response.json();
        preencherTabela(produtos);
        
    } catch (error) {
        console.error('Erro:', error);
    }
    
    
});

function getQuery(){
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q");
    return searchQuery;
}

function getCityId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("cidade");
}

document.getElementById('searchButton').addEventListener('click', function() {
    // Obtém o valor digitado no campo de pesquisa
    let searchQuery = document.getElementById('searchInput').value;
    const cityId = document.getElementById('citySelect').value;

    if (searchQuery === "") {
    alert("Digite algo para pesquisar!");
    return;
    }

    if (!cityId) {
    alert("Selecione uma cidade!");
    return;
}

    // Se o usuário digitou algo, redireciona para a página de pesquisa com o parâmetro
    if (searchQuery.trim() !== "") {
        window.location.href = `index.html?q=${encodeURIComponent(searchQuery)}&cidade=${cityId}`;
    }
});

function preencherTabela(produtos) {
    const tabelaBody = document.querySelector('#mytable'); 
    tabelaBody.innerHTML = '';

    produtos.forEach(produto => {
        
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td><img src="${produto.foto}" alt="${produto.nome}" onerror="this.src='../soap.png'" width="150" height="150"></td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.descricao}</td>
            <td>${produto.telefone}</td>   `;

        tabelaBody.appendChild(linha);
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    const selectCidade = document.getElementById("citySelect");

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
            citySelect.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar cidades:", error);
    }
    });
