const input = document.querySelector('#input');
const chartcontainer = document.querySelector('#chart-container');
const sendBtn = document.querySelector('#sendBtn');

input?.addEventListener('keyup', handleEnter);
sendBtn?.addEventListener('click', sendMessage);

// Loading element
function createLoading() {
  const loading = document.createElement('div');
  loading.textContent = 'Thinking...';
  loading.className = 'text-gray-400 my-6 animate-pulse';
  return loading;
}

// Generate message
async function generate(text) {

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit';
  userMsg.textContent = text;
  chartcontainer.appendChild(userMsg);

  input.value = '';

  // Loading
  const loading = createLoading();
  chartcontainer.appendChild(loading);

  // Auto scroll
  chartcontainer.scrollTop = chartcontainer.scrollHeight;

  try {
    const assistantMessage = await callServer(text);

    // Bot message
    const botMsg = document.createElement('div');
    botMsg.className = 'my-6 bg-gray-800 p-3 rounded-xl mr-auto max-w-fit';
    botMsg.textContent = assistantMessage;

    chartcontainer.appendChild(botMsg);

  } catch (error) {
    console.error("Error:", error);

    const errorMsg = document.createElement('div');
    errorMsg.className = 'my-6 bg-red-600 p-3 rounded-xl mr-auto max-w-fit';
    errorMsg.textContent = 'Something went wrong...';

    chartcontainer.appendChild(errorMsg);

  } finally {
    loading.remove();
    chartcontainer.scrollTop = chartcontainer.scrollHeight;
  }
}

// API call
async function callServer(inputText) {
  const response = await fetch('http://localhost:3001/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: inputText,
      threadId: "user1" // important fix
    })
  });

  if (!response.ok) {
    throw new Error("Error generating the response");
  }

  const result = await response.json();
  return result.message;
}

// Send button
async function sendMessage() {
  const text = input?.value.trim();
  if (!text) return;

  await generate(text);
}

// Enter key
async function handleEnter(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    await sendMessage();
  }
}