const micButton = document.getElementById('micButton');
const sourceText = document.getElementById('sourceText');

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    micButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sourceText.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
    };
} else {
    micButton.disabled = true;
    micButton.textContent = '🎤 (Not Supported)';
}

// Replace with your actual Gemini API key
const API_KEY = 'AIzaSyC1np92VvHP_c3sOho4TDFtcxflseSgIyM';

async function translateText() {
    const sourceTextValue = document.getElementById('sourceText').value;
    const sourceLanguage = document.getElementById('sourceLanguage').value;
    const targetLanguage = document.getElementById('targetLanguage').value;
    const translatedTextArea = document.getElementById('translatedText');
    const errorDiv = document.getElementById('error');
    const translateButton = document.querySelector('.button-container button');

    errorDiv.textContent = '';

    if (!sourceTextValue) {
        errorDiv.textContent = 'Please enter text to translate';
        return;
    }

    try {
        translateButton.disabled = true;
        translateButton.textContent = 'Translating...';
        translatedTextArea.value = 'Translating...';

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Translate the following text from ${sourceLanguage} to ${targetLanguage}: ${sourceTextValue}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            translatedTextArea.value = data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        errorDiv.textContent = 'Error during translation. Please try again.';
        translatedTextArea.value = '';
        console.error('Translation error:', error);
    } finally {
        translateButton.disabled = false;
        translateButton.textContent = 'Translate';
    }
}

document.getElementById('sourceText').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        translateText();
    }
});
