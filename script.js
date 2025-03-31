document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchResponseDiv = document.getElementById('searchResponse');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const createCategoryButton = document.getElementById('createCategoryButton'); // Obtém o botão "Criar Categoria"
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
        'biologia': 'Responda à seguinte pergunta de forma clara e concisa, como se estivesse explicando um conceito de biologia: '
    };

    if (searchButton && searchResponseDiv && searchInput && categorySelect && createCategoryButton) {
        searchButton.addEventListener('click', processSearch);

        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                processSearch();
            }
        });

        // Adiciona funcionalidade ao botão "Criar Categoria"
        createCategoryButton.addEventListener('click', function() {
            const newCategoryName = prompt('Digite o nome da nova categoria:');
            if (newCategoryName && newCategoryName.trim() !== '') {
                const newOption = document.createElement('option');
                newOption.value = newCategoryName.toLowerCase().replace(/\s+/g, '-'); // Cria um valor (minúsculo, espaços viram hífens)
                newOption.textContent = newCategoryName;
                categorySelect.appendChild(newOption);

                // Opcional: Adicionar um prompt para a instrução da categoria
                // const newCategoryPrompt = prompt(`Digite a instrução para a categoria "${newCategoryName}":`);
                // if (newCategoryPrompt) {
                //     categoryPrompts[newOption.value] = newCategoryPrompt + ' ';
                // } else {
                //     categoryPrompts[newOption.value] = 'Responda à seguinte pergunta focando em ' + newCategoryName + ': ';
                // }
            }
        });
    } else {
        console.error('Elementos não encontrados.');
    }

    function processSearch() {
        const topic = searchInput.value;
        const category = categorySelect.value;

        if (!topic.trim()) {
            searchResponseDiv.textContent = 'Por favor, digite algo para pesquisar.';
            return;
        }

        searchResponseDiv.textContent = 'Carregando...';
        searchInput.value = 'Carregando ...';

        const promptPrefix = categoryPrompts[category] || categoryPrompts['geral'];
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
            searchInput.value = topic;

            if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                let aiResponseText = data.candidates[0].content.parts[0].text;

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
            searchInput.value = topic;
        });
    }

    function startNewSearch(topic) {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const searchResponseDiv = document.getElementById('searchResponse');

        if (searchInput && searchButton && searchResponseDiv) {
            searchInput.value = 'Carregando ...';
            searchResponseDiv.textContent = '';
            searchInput.value = topic;
            searchButton.click();
        } else {
            console.error('Elementos de pesquisa não encontrados para pesquisar novamente.');
        }
    }
});