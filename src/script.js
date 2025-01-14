// Aguarda o envio do formulário
document.getElementById('formCadastro').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o comportamento padrão do envio do formulário

    // Coleta os dados do formulário
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        // Envia os dados para o servidor
        const response = await fetch('http://localhost:3000/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Exibe uma mensagem de sucesso ou erro
        const messageElement = document.createElement('p');
        if (response.ok) {
            messageElement.textContent = 'Revendedor cadastrado com sucesso!';
            messageElement.style.color = 'green';
            event.target.reset(); // Limpa o formulário
        } else {
            const errorText = await response.text();
            messageElement.textContent = `Erro ao cadastrar: ${errorText}`;
            messageElement.style.color = 'red';
        }

        // Adiciona a mensagem na página
        document.querySelector('.container').appendChild(messageElement);
    } catch (error) {
        // Exibe uma mensagem de erro de conexão
        const messageElement = document.createElement('p');
        messageElement.textContent = `Erro ao conectar ao servidor: ${error.message}`;
        messageElement.style.color = 'red';
        document.querySelector('.container').appendChild(messageElement);
    }
});

