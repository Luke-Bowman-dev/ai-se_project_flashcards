import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";

/**
 * Renders and manages the interactive carousel view for a specific flashcard deck.
 * Handles navigation, card flipping, and DOM updates.
 *
 * @param {Object} deck - The flashcard deck object to display.
 * @param {string} deck.name - The name of the deck.
 * @param {string} deck.color - The hex color string representing the deck's theme.
 * @param {Object[]} deck.cards - The array of flashcards belonging to the deck.
 * @param {string} deck.cards[].question - The question text on the front of the card.
 * @param {string} deck.cards[].answer - The answer text on the back of the card.
 */
function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;

  const carouselEl = document.querySelector(".carousel");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const carouselTitleEl = carouselEl.querySelector(".carousel__title");
  const carouselCardEl = carouselEl.querySelector(".carousel__card");
  const carouselCardTextEl = carouselEl.querySelector(".carousel__card-text");
  const flipBtn = carouselEl.querySelector(".carousel__btn_type_flip");
  const pageGradientEl = document.querySelector(".page");

  pageGradientEl.classList.add("page_no-mobile-bar");
  removeColorClasses(carouselCardEl);

  const color = hexToString(deck.color);
  removeColorClasses(carouselCardEl);
  carouselCardEl.classList.add(`carousel__card_color_${color}`);

  /**
   * Disables a navigation button and updates its styling.
   *
   * @param {HTMLButtonElement} buttonEl - The button DOM element to disable.
   */
  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }

  /**
   * Enables a navigation button and removes its disabled styling.
   *
   * @param {HTMLButtonElement} buttonEl - The button DOM element to enable.
   */
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

  /**
   * Updates the states of the left and right navigation arrows based on the current index.
   */
  function updateArrows() {
    if (currentIndex === 0) {
      disableButton(leftBtn);
    } else {
      enableButton(leftBtn);
    }

    if (currentIndex === deck.cards.length - 1) {
      disableButton(rightBtn);
    } else {
      enableButton(rightBtn);
    }
  }

  /**
   * Formats and returns the title string showing the deck name and progress count.
   *
   * @param {Object} deck - The current flashcard deck object.
   * @param {number} currentIndex - The index of the active flashcard.
   * @returns {string} The formatted header string (e.g., "Deck Name · 1/10").
   */
  function getDeckNameAndCount(deck, currentIndex) {
    return `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
  }

  /**
   * Refreshes the DOM elements to display the active card text,
   * theme color, side state (question/answer), and updates button availability.
   */
  function updateDisplay() {
    const deckNameAndCount = getDeckNameAndCount(deck, currentIndex);
    carouselTitleEl.textContent = deckNameAndCount;

    const currentCard = deck.cards[currentIndex];

    if (showingQuestion === true) {
      carouselCardTextEl.textContent = currentCard.question;
      carouselCardEl.classList.remove("carousel__card_color_white");
    } else {
      carouselCardEl.classList.add("carousel__card_color_white");
      carouselCardTextEl.textContent = currentCard.answer;
    }
    updateArrows();
  }

  rightBtn.addEventListener("click", () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  });

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  updateDisplay();
}

export { renderCarouselView };
