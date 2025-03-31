const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

async function processTopic() {
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput.value;
    const outputArea = document.querySelector('.output-area');
    outputArea.textContent = 'Buscando informações...';

    const model = 'gemini-2.0-flash';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/<span class="math-inline">\{model\}\:generateContent?key\=</span>{apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Explique o tópico: ${topic}.` }]
                }]
            })
        });

        const data = await response.json();
        console.log('Resposta da API:', data);

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            const aiResponseText = data.candidates[0].content.parts[0].text;
            const responseDiv = document.getElementById('aiResponse');
            responseDiv.innerHTML = '<p>' + aiResponseText.replace(/\n/g, '<br>') + '</p>';
            document.getElementById('aiSummary').innerHTML = ''; // Limpa a área de resumo
            document.getElementById('relatedLinks').innerHTML = ''; // Limpa a área de links relacionados
        } else {
            outputArea.textContent = 'Não foi possível obter uma resposta da IA.';
        }

    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        outputArea.textContent = 'Ocorreu um erro ao buscar a resposta.';
    }
}

async function testApi() {
    const outputArea = document.querySelector('.output-area');
    outputArea.textContent = 'Testando a API...';

    const model = 'gemini-2.0-flash';
    const query = "Explain how AI works";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/<span class="math-inline">\{model\}\:generateContent?key\=</span>{apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: query }]
                }]
            })
        });

        const data = await response.json();
        console.log('Resposta da API (Teste):', data);

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            const aiResponseText = data.candidates[0].content.parts[0].text;
            const responseDiv = document.getElementById('aiResponse');
            responseDiv.innerHTML = '<p><b>Teste da API (Curl):</b><br>' + aiResponseText.replace(/\n/g, '<br>') + '</p>';
            document.getElementById('aiSummary').innerHTML = ''; // Limpa a área de resumo
            document.getElementById('relatedLinks').innerHTML = ''; // Limpa a área de links relacionados
        } else {
            outputArea.textContent = 'Falha ao testar a API.';
        }

    } catch (error) {
        console.error('Erro ao testar a API:', error);
        outputArea.textContent = 'Erro ao testar a API.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const exploreButton = document.getElementById('exploreButton');
    if (exploreButton) {
        exploreButton.addEventListener('click', processTopic);
    } else {
        console.error('Botão "Explorar" não encontrado!');
    }

    const testApiButton = document.getElementById('testApiButton');
    if (testApiButton) {
        testApiButton.addEventListener('click', testApi);
    } else {
        console.error('Botão "Testar API (Curl)" não encontrado!');
    }
});