document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect'); // Obtém o elemento select
    const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

    // Mapeamento de categorias para prefixos de prompt
    const categoryPrompts = {
        'geral': 'Responda à seguinte pergunta da melhor forma possível: ',
        'python': 'Responda à seguinte pergunta com foco em Python, fornecendo exemplos de código quando apropriado: ',
        'node': 'Responda à seguinte pergunta com foco em Node.js e JavaScript: ',
        'go': 'Responda à seguinte pergunta com foco na linguagem de programação Go: ',
        'astro': 'Responda à seguinte pergunta no contexto do framework web Astro: ',
        'gemini-api': 'Responda à seguinte pergunta no contexto da utilização da Gemini API: ',
        'flutter': 'Responda à seguinte pergunta com foco no framework Flutter: ',
        'nextjs': 'Responda à seguinte pergunta no contexto do framework Next.js: ',
        'angular': 'Responda à seguinte pergunta com foco no framework Angular: ',
        'biologia': 'Responda à seguinte pergunta de forma clara e concisa, como se estivesse explicando um conceito de biologia: ',
        'outro1': 'Responda à seguinte pergunta focando neste tópico: ',
        'outro2': 'Responda à seguinte pergunta focando neste tópico: ',
        'outro3': 'Responda à seguinte pergunta focando neste tópico: ',
        'outro4': 'Responda à seguinte pergunta focando neste tópico: ',
        'outro5': 'Responda à seguinte pergunta focando neste tópico: '
    };

    if (searchButton && searchResponseDiv && searchInput && categorySelect) {
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
        const category = categorySelect.value; // Obtém a categoria selecionada

        if (!topic.trim()) {
            searchResponseDiv.textContent = 'Por favor, digite algo para pesquisar.';
            return;
        }

        searchResponseDiv.textContent = 'Carregando...';
        searchInput.value = 'Carregando ...'; // Mostra "Carregando ..." no campo de pesquisa

        // Constrói o prompt com base na categoria selecionada
        const promptPrefix = categoryPrompts[category] || categoryPrompts['geral']; // Usa 'geral' como fallback
        const fullPrompt = promptPrefix + topic;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const body = JSON.stringify({
            "contents": [{
                "parts": [{"text": fullPrompt}]
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
});