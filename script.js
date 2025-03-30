const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave real

async function processTopic() {
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput.value.trim(); // Remove espaços desnecessários
    const outputArea = document.querySelector('.output-area');

    // Validação do input
    if (!topic) {
        outputArea.textContent = 'Por favor, digite um tema válido.';
        return;
    }

    outputArea.textContent = 'Buscando informações...';

    const model = 'gemini-2.0-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `Explique o tópico: ${topic}.`
            })
        });

        if (!response.ok) {
            throw new Error(`Erro da API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data);

        const aiResponse = data?.candidates?.[0]?.content || 'Não foi possível obter uma resposta da IA.';
        document.getElementById('aiResponse').innerHTML = `<p>${aiResponse.replace(/\n/g, '<br>')}</p>`;
        document.getElementById('aiSummary').innerHTML = ''; // Limpa o resumo
        document.getElementById('relatedLinks').innerHTML = ''; // Limpa os links

    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        outputArea.textContent = 'Ocorreu um erro ao buscar a resposta.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const exploreButton = document.getElementById('exploreButton');
    if (exploreButton) {
        exploreButton.addEventListener('click', processTopic);
    } else {
        console.error('Botão "Explorar" não encontrado!');
    }
});
