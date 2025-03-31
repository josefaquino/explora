document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse');
    const searchInput = document.getElementById('searchInput');
    const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

    if (searchButton && searchResponseDiv && searchInput) {
        searchButton.addEventListener('click', async function() {
            const query = searchInput.value;
            if (!query.trim()) {
                searchResponseDiv.textContent = 'Por favor, digite algo para pesquisar.';
                return;
            }

            searchResponseDiv.textContent = 'Carregando...';

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const headers = {
                'Content-Type': 'application/json'
            };
            const body = JSON.stringify({
                "contents": [{
                    "parts": [{"text": query}]
                }]
            });

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: body
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }

                const data = await response.json();
                console.log('Resposta da API:', data);

                if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                    searchResponseDiv.innerHTML = '<pre>' + data.candidates[0].content.parts[0].text + '</pre>';
                } else {
                    searchResponseDiv.textContent = 'Resposta da API em formato inesperado.';
                }

            } catch (error) {
                console.error('Erro ao executar a pesquisa:', error);
                searchResponseDiv.textContent = `Erro: ${error.message}`;
            }
        });
    } else {
        console.error('Elementos não encontrados.');
    }
});