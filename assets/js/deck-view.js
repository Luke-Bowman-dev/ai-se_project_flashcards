import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { currentDeck } from "./index.js";
import { modal } from "./modal.js";
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const pageEl = document.querySelector(".page__main-content");
let currentCardEl = null;
const confirmationModalEl = document.querySelector("#confirmation-modal");
function showView(section, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  section.style.display = display;
}
function renderDeckView(deckId) {
  if (!currentDeck) {
    renderNotFoundView();
    return;
  }

  const deckTitleEl = deckViewSection.querySelector(".gallery__title");
  deckTitleEl.textContent = currentDeck.name;
  const cardTemplateEl = document.querySelector("#card-template");
  const cardContainerEl = deckViewSection.querySelector(".gallery__list");
  cardContainerEl.innerHTML = "";
  const pageGradientEl = document.querySelector(".page");
  pageGradientEl.classList.remove("page_no-mobile-bar");
  function createCardEl(item) {
    const cardEl = cardTemplateEl.content
      .querySelector(".card")
      .cloneNode(true);
    const cardTitleEl = cardEl.querySelector(".card__title");
    cardTitleEl.textContent = item.question;
    const color = hexToString(currentDeck.color);
    removeColorClasses(cardEl);
    cardEl.classList.add(`card_color_${color}`);
    const flipBtn = cardEl.querySelector(".card__btn_type_flip");
    flipBtn.addEventListener("click", () => {
      if (cardTitleEl.textContent === item.question) {
        cardTitleEl.textContent = item.answer;
      } else {
        cardTitleEl.textContent = item.question;
      }
    });
    const deleteBtn = cardEl.querySelector(".card__delete-button");
    deleteBtn.addEventListener("click", () => {
      confirmationModalEl.classList.add("modal_visible");
      modal(cardEl);
    });
    return cardEl;
  }
  function renderCardEl(item) {
    const result = createCardEl(item);
    cardContainerEl.prepend(result);
  }
  currentDeck.cards.forEach(renderCardEl);
}

export { renderDeckView };
