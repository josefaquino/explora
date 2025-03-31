document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse');
    const searchInput = document.getElementById('searchInput');
    const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

    if (searchButton && searchResponseDiv && searchInput) {
        searchButton.addEventListener('click', processSearch);

        // Adiciona funcionalidade para o Enter no campo de pesquisa
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                processSearch();
            }
        });
    } else {
        console.error('Elementos não encontrados.');
    }

    function processSearch() {
        const topic = searchInput.value;
        if (!topic.trim()) {
            searchResponseDiv.textContent = 'Por favor, digite algo para pesquisar.';
            return;
        }

        searchResponseDiv.textContent = 'Carregando...';
        searchInput.value = 'Carregando ...'; // Mostra "Carregando ..." no campo de pesquisa

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const body = JSON.stringify({
            "contents": [{
                "parts": [{"text": `Explique o tópico: ${topic}. Inclua também uma lista de 2 ou 3 palavras-chave importantes para exploração adicional, marcadas com asteriscos.`}]
            }]
        });

        fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta da API:', data);
            searchInput.value = topic; // Restaura o tópico no campo de pesquisa

            if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                let aiResponseText = data.candidates[0].content.parts[0].text;

                // Encontra palavras-chave marcadas com asteriscos
                const keywords = aiResponseText.match(/\*(.*?)\*/g);

                if (keywords) {
                    keywords.forEach(keyword => {
                        const cleanKeyword = keyword.replace(/\*/g, '').trim();
                        const link = `<a href="#" onclick="startNewSearch('${cleanKeyword}')">${cleanKeyword}</a>`;
                        aiResponseText = aiResponseText.replace(keyword, link);
                    });
                }

                searchResponseDiv.innerHTML = '<pre>' + aiResponseText + '</pre>';
            } else {
                searchResponseDiv.textContent = 'Resposta da API em formato inesperado.';
            }
        })
        .catch(error => {
            console.error('Erro ao executar a pesquisa:', error);
            searchResponseDiv.textContent = `Erro: ${error.message}`;
            searchInput.value = topic; // Restaura o tópico em caso de erro
        });
    }
});

function startNewSearch(topic) {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse');

    if (searchInput && searchButton && searchResponseDiv) {
        searchInput.value = 'Carregando ...'; // Mostra "Carregando ..." no campo de pesquisa
        searchResponseDiv.textContent = ''; // Limpa a resposta anterior
        searchInput.value = topic; // Define o novo tópico no campo de pesquisa
        // Simula o clique no botão de pesquisa (agora a função processSearch será chamada)
        searchButton.click();
    } else {
        console.error('Elementos de pesquisa não encontrados para pesquisar novamente.');
    }
}