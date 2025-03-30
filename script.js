function processTopic() {
  // Vamos adicionar a lógica aqui
  const topicInput = document.getElementById('topicInput');
  const topic = topicInput.value;

  console.log('O tema digitado foi:', topic);

  // Por enquanto, vamos apenas exibir o tema no output-area
  const outputArea = document.querySelector('.output-area');
  outputArea.textContent = `Você digitou: ${topic}`;
}