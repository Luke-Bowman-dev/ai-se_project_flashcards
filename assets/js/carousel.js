import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;
  const carouselEl = document.querySelector(".carousel");
  const leftBtn = carouselEl.querySelector(".carousel__btn_type_left");
  const rightBtn = carouselEl.querySelector(".carousel__btn_type_right");
  const carouselTitleEl = carouselEl.querySelector(".carousel__title");
  const carouselCardEl = carouselEl.querySelector(".carousel__card");
  const carouselCardTextEl = carouselEl.querySelector(".carousel__card-text");
  const flipBtn = carouselEl.querySelector(".carousel__flip");
  removeColorClasses(carouselCardEl);
  const color = hexToString(deck.color);
  carouselCardEl.classList.add(`carousel__card_color_${color}`);
  function disableButton(buttonEl) {
    buttonEl.classList.add("carousel__btn_disabled");
    buttonEl.disabled = true;
  }
  function enableButton(buttonEl) {
    buttonEl.classList.remove("carousel__btn_disabled");
    buttonEl.removeAttribute("disabled");
  }

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
  function getDeckNameAndCount(deck, currentIndex) {
    return `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
  }
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
