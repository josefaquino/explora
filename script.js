document.addEventListener('DOMContentLoaded', function() {
    const testCurlButton = document.getElementById('testCurlButton');
    const curlResponseDiv = document.getElementById('curlResponse');
    const apiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0'; // Substitua pela sua chave de API real

    if (testCurlButton && curlResponseDiv) {
        testCurlButton.addEventListener('click', async function() {
            curlResponseDiv.textContent = 'Carregando...';

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const headers = {
                'Content-Type': 'application/json'
            };
            const body = JSON.stringify({
                "contents": [{
                    "parts": [{"text": "Explain how AI works"}]
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
                    curlResponseDiv.innerHTML = '<pre>' + data.candidates[0].content.parts[0].text + '</pre>';
                } else {
                    curlResponseDiv.textContent = 'Resposta da API em formato inesperado.';
                }

            } catch (error) {
                console.error('Erro ao executar o teste Curl:', error);
                curlResponseDiv.textContent = `Erro: ${error.message}`;
            }
        });
    } else {
        console.error('Botão ou div de resposta não encontrados.');
    }
});