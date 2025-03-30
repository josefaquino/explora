const apiKey = 'YOUR_API_KEY'; // Substitua pela sua chave de API real

async function processTopic() {
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput.value;
    const outputArea = document.querySelector('.output-area');
    outputArea.textContent = 'Buscando informações...';

    const model = 'gemini-2.0-flash';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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