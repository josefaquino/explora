document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse');
    const searchInput = document.getElementById('searchInput');
    const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

    if (searchButton && searchResponseDiv && searchInput) {
        searchButton.addEventListener('click', async function() {
            const topic = searchInput.value;
            if (!topic.trim()) {
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
                    "parts": [{"text": `Explique o tópico: ${topic}. Inclua também uma lista de 2 ou 3 palavras-chave importantes para exploração adicional, marcadas com asteriscos.`}]
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
                    let aiResponseText = data.candidates[0].content.parts[0].text;

                    // Encontra palavras-chave marcadas com asteriscos
                    const keywords = aiResponseText.match(/\*(.*?)\*/g);

                    if (keywords) {
                        keywords.forEach(keyword => {
                            const cleanKeyword = keyword.replace(/\*/g, '').trim();
                            const link = `<a href="#" onclick="searchAgain('${cleanKeyword}')">${cleanKeyword}</a>`;
                            aiResponseText = aiResponseText.replace(keyword, link);
                        });
                    }

                    searchResponseDiv.innerHTML = '<pre>' + aiResponseText + '</pre>';
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

function searchAgain(topic) {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse'); // Pegue também a div de resposta

    if (searchInput && searchButton && searchResponseDiv) {
        searchInput.value = ''; // Limpa o campo de busca
        searchResponseDiv.textContent = 'Carregando nova resposta...'; // Adiciona indicador visual com a mensagem desejada
        searchButton.click(); // Simula o clique no botão de pesquisa
    } else {
        console.error('Elementos de pesquisa não encontrados para pesquisar novamente.');
    }
}