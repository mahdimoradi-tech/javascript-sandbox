//* queries
const wordInput = document.getElementById("word-input");
const searchBtn = document.getElementById("search-btn");
const resultSection = document.querySelector(".result-section");
const flashcardList = document.getElementById("flashcard-list");
const deckCount = document.getElementById("deck-count");

//* Classes
class DictionaryAPI {
  static async fetchWord(word) {
    try {
      const result = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );
      const data = result.data[0];

      const wordText = data.word;

      const phoneticObj = data.phonetics.find((p) => p.text) || {};
      const phonetics = phoneticObj.text || "";

      const definition = data.meanings[0].definitions[0].definition;

      const audioObj = data.phonetics.find((obj) => obj.audio) || {};
      const audioUrl = audioObj.audio || "";

      return new Word(wordText, phonetics, definition, audioUrl);
    } catch (err) {
      alert("sorry, this word is not in dictionary!!!");
      return null;
    }
  }
}

class Word {
  constructor(wordText, phonetics, definition, audioUrl) {
    this.wordText = wordText;
    this.phonetics = phonetics;
    this.definition = definition;
    this.audioUrl = audioUrl;
  }

  playAudio() {
    if (this.audioUrl) return new Audio(this.audioUrl).play();
    else alert("Audio not available for this word.");
    return;
  }
}

class Deck {
  static saveToLocalStorage(flashcards) {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }

  static loadFromLocalStorage() {
    const flashcards = localStorage.getItem("flashcards");
    return flashcards ? JSON.parse(flashcards) : [];
  }

  static removeFromLocalStorage(cardName) {
    const flashcards = this.loadFromLocalStorage();
    const filteredFlashcards = flashcards.filter(
      (card) => card.wordText !== cardName,
    );
    this.saveToLocalStorage(filteredFlashcards);
  }
}

class UI {
  static renderWordData(wordData) {
    resultSection.innerHTML = "";

    return (resultSection.innerHTML = `
    <div class="word-card">
            <div class="word-header">
              <h2 id="word-title">${wordData.wordText}</h2>
              <button id="play-audio-btn">🔊</button>
            </div>
            <span class="phonetic">${wordData.phonetics}</span>
            <p class="definition">${wordData.definition}</p>
            <button id="add-to-deck-btn">➕ Add to Flashcards</button>
          </div>`);
  }

  static renderDeck() {
    const flashcards = Deck.loadFromLocalStorage();

    flashcardList.innerHTML = "";
    flashcards.forEach((card) => {
      flashcardList.innerHTML += `
      <li>
          <span><strong class ="card-title">${card.wordText}</strong>:
          ${card.definition}</span>

          <button class="remove-btn" data-word="${card.wordText}">❌</button>
      </li>`;
    });

    this.updateDeckCount();
  }

  static updateDeckCount() {
    const flashcards = Deck.loadFromLocalStorage();
    deckCount.innerHTML = `(${flashcards.length})`;
  }
}

//* Events
document.addEventListener("DOMContentLoaded", () => {
  UI.renderDeck();

  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-btn");
    const cardTitle = e.target.closest(".card-title");

    if (removeBtn){
      Deck.removeFromLocalStorage(removeBtn.dataset.word);
      UI.renderDeck();
    } 

    if (cardTitle) {
      const flashcards = Deck.loadFromLocalStorage();
      const selectedFlashcard = flashcards.find(
        (card) => card.wordText === cardTitle.innerHTML,
      );

      const selectedWord = new Word(
        selectedFlashcard.wordText,
        selectedFlashcard.phonetics,
        selectedFlashcard.definition,
        selectedFlashcard.audioUrl,
      );

      UI.renderWordData(selectedWord);
      const playAudio = document.getElementById("play-audio-btn");
      playAudio.addEventListener("click", () => selectedWord.playAudio());
    }
  });
});

searchBtn.addEventListener("click", async () => {
  const newWord = wordInput.value.toLowerCase().trim();
  if (!newWord) {
    alert("please enter your word");
    return;
  }

  const apiData = await DictionaryAPI.fetchWord(newWord);

  wordInput.value = "";
  UI.renderWordData(apiData);

  const playAudio = document.getElementById("play-audio-btn");
  const addToDeck = document.getElementById("add-to-deck-btn");

  playAudio.addEventListener("click", () => apiData.playAudio());

  addToDeck.addEventListener("click", () => {
    const flashCarts = Deck.loadFromLocalStorage();
    const repeatedValue = flashCarts.find(
      (cart) => cart.wordText === apiData.wordText,
    );
    if (repeatedValue) return alert("this cart is already added!");

    Deck.saveToLocalStorage([apiData, ...flashCarts]);

    UI.renderDeck();
  });
});
