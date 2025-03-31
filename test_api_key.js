const fetch = require('node-fetch');

async function testApiKey(apiKey) {
  const model = 'gemini-2.0-flash'; // Or any other model you want to test with
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
            role: "user",
            parts: [{ text: "This is a test prompt." }],
            }],
        }),

    });

    if (response.status === 400) {
      const data = await response.json();
      if (data.error && data.error.message.includes('API key not valid')) {
        console.log('API key is INVALID.');
        return;
      }
    }

    if (response.ok) {
      console.log('API key is VALID.');
    } else {
      console.log(`API request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error testing API key:', error);
  }
}

// Replace 'YOUR_ACTUAL_API_KEY' with your actual API key
const yourApiKey = 'AIzaSyCg6VKxU887z4QTfLBbNorlWx0asVUQmp0';
testApiKey(yourApiKey);