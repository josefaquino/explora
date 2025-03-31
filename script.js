document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse');
    const searchInput = document.getElementById('searchInput');
    const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

    if (searchButton && searchResponseDiv && searchInput) {
        searchButton.addEventListener('click', processTopic); // Chame processTopic diretamente

        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                processTopic(); // Chama processTopic ao pressionar Enter
            }
        });
    } else {
        console.error('Elementos não encontrados.');
    }

    window.searchAgain = async function(topic) { // Tornando searchAgain acessível globalmente
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        if (searchInput && searchButton) {
            searchInput.value = 'Carregando ...'; // Mostrar "Carregando ..." no campo de pesquisa
            searchInput.value = topic; // Define o tópico para a nova pesquisa
            searchButton.click(); // Simula o clique no botão de pesquisa
        } else {
            console.error('Elementos de pesquisa não encontrados para pesquisar novamente.');
        }
    };

    async function processTopic() {
        const topicInput = document.getElementById('searchInput'); // Use searchInput aqui
        const topic = topicInput.value;
        const outputArea = document.getElementById('searchResponse'); // Use searchResponseDiv aqui
        outputArea.textContent = 'Buscando informações...'; // Mensagem inicial na área de resposta

        const model = 'gemini-2.0-flash';

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `Explique o tópico: ${topic}. Inclua também uma lista de 2 ou 3 palavras-chave importantes para exploração adicional, marcadas com asteriscos.` }]
                    }]
                })
            });

            const data = await response.json();
            console.log('Resposta da API:', data);

            if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                let aiResponseText = data.candidates[0].content.parts[0].text;

                // Encontra palavras-chave marcadas com asteriscos
                const keywords = aiResponseText.match(/\*(.*?)\*/g);

                if (keywords) {
                    keywords.forEach(keyword => {
                        const cleanKeyword = keyword.replace(/\*/g, '').trim();
                        const link = `<a href="#" onclick="window.searchAgain('${cleanKeyword}')">${cleanKeyword}</a>`;
                        aiResponseText = aiResponseText.replace(keyword, link);
                    });
                }

                outputArea.innerHTML = '<pre>' + aiResponseText + '</pre>';
            } else {
                outputArea.textContent = 'Resposta da API em formato inesperado.';
            }

        } catch (error) {
            console.error('Erro ao executar a pesquisa:', error);
            outputArea.textContent = `Erro: ${error.message}`;
        }
    }
});