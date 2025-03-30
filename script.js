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
                    parts: [{ text: `Explique o tópico: ${topic}` }]
                }]
            })
        });

        const data = await response.json();
        console.log('Resposta da API:', data);

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            const respostaIA = data.candidates[0].content.parts[0].text;
            outputArea.textContent = respostaIA;
        } else {
            outputArea.textContent = 'Não foi possível obter uma resposta da IA.';
        }

    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        outputArea.textContent = 'Ocorreu um erro ao buscar a resposta.';
    }
}