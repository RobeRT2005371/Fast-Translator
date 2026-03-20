document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const sourceLang = document.getElementById("sourceLang");
  const targetLang = document.getElementById("targetLang");
  const switchBtn = document.getElementById("switchBtn");

  let debounceTimer;

  // Translate automatically while typing (fast debounce)
  inputText.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(translateText, 300); // fast response
  });

  switchBtn.addEventListener("click", () => {
    let temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
    translateText();
  });

  function translateText() {
    const text = inputText.value.trim();
    if (!text) {
      outputText.value = "";
      return;
    }

    const langpair = `${sourceLang.value}|${targetLang.value}`;

    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`)
      .then(res => res.json())
      .then(data => {
        outputText.value = data.responseData.translatedText;
      })
      .catch(err => {
        outputText.value = "Error: Translation failed.";
        console.error(err);
      });
  }

  // Copy functionality
  document.getElementById("copyInput").addEventListener("click", () => {
    navigator.clipboard.writeText(inputText.value);
  });
  document.getElementById("copyOutput").addEventListener("click", () => {
    navigator.clipboard.writeText(outputText.value);
  });

  // Text-to-Speech with correct language voices
  document.getElementById("listenInput").addEventListener("click", () => {
    let speech = new SpeechSynthesisUtterance(inputText.value);
    speech.lang = sourceLang.value === "fr" ? "fr-FR" : "en-US";
    speechSynthesis.speak(speech);
  });

  document.getElementById("listenOutput").addEventListener("click", () => {
    let speech = new SpeechSynthesisUtterance(outputText.value);
    speech.lang = targetLang.value === "fr" ? "fr-FR" : "en-US";
    speechSynthesis.speak(speech);
  });
});