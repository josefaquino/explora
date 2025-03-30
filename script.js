const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

async function processTopic() {
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput.value;
    const outputArea = document.querySelector('.output-area');
    outputArea.textContent = 'Buscando informações...'; // Mensagem enquanto a API responde

    const model = 'gemini-2.0-flash';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Explique o tópico: ${topic}. Inclua também um breve resumo dos principais pontos.` }] // Pedindo o resumo
                }]
            })
        });

        const data = await response.json();
        console.log('Resposta da API:', data);

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            const respostaCompletaIA = data.candidates[0].content.parts[0].text;
            const outputArea = document.querySelector('.output-area');
            const summaryDiv = document.getElementById('aiSummary');
            const responseDiv = document.getElementById('aiResponse');

            // Vamos tentar separar o resumo da resposta principal (assumindo que o resumo vem no início)
            const parts = respostaCompletaIA.split('\n\n');

            summaryDiv.innerHTML = '';
            responseDiv.innerHTML = '';

            if (parts.length > 0) {
                summaryDiv.innerHTML = '<h3>Resumo:</h3><p>' + parts[0] + '</p>'; // Exibe o primeiro bloco como resumo
                if (parts.length > 1) {
                    responseDiv.innerHTML = '<h3>Explicação:</h3>' + parts.slice(1).join('<p></p>'); // Exibe o restante como explicação
                } else {
                    responseDiv.innerHTML = '<h3>Explicação:</h3><p>' + parts[0] + '</p>'; // Se só houver um bloco, considera como explicação
                }
            } else {
                responseDiv.innerHTML = '<p>' + respostaCompletaIA + '</p>'; // Se não conseguir separar, exibe tudo como explicação
            }
        } else {
            outputArea.textContent = 'Não foi possível obter uma resposta da IA.';
        }

    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        outputArea.textContent = 'Ocorreu um erro ao buscar a resposta.';
    }
}