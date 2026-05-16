import { getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { currentDeck } from "./index.js";
import { modal } from "./modal.js";

/** @type {HTMLElement} - The home section view container. */
const homeSection = document.querySelector("#home");

/** @type {HTMLElement} - The detailed deck view section container. */
const deckViewSection = document.querySelector("#deck-view");

/** @type {HTMLElement} - The interactive flashcard carousel section container. */
const carouselSection = document.querySelector("#carousel");

/** @type {HTMLElement} - The error page or fallback section container. */
const notFoundSection = document.querySelector("#not-found");

/** @type {HTMLElement} - The main page body container enclosing all content. */
const pageEl = document.querySelector(".page__main-content");

/** @type {any[]} - Cache storage array containing retrieved deck objects. */
let fetchedDecks = [];

/** @type {HTMLElement|null} - Tracks the currently targeted card DOM element, if any. */
let currentCardEl = null;

/** @type {HTMLElement} - The modal overlay element for confirming dangerous actions. */
const confirmationModalEl = document.querySelector("#confirmation-modal");

/**
 * Handles toggling visibility layout styles across different view elements.
 *
 * @param {HTMLElement} section - The container element to make active.
 * @param {string} display - The CSS display mode property value (e.g., "block", "flex").
 */
function showView(section, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  section.style.display = display;
}

/**
 * Renders the full deck layout including the listing grid of individual flashcards.
 * Falls back to an alternative layout view if the target source dataset is empty.
 *
 * @param {string|number} deckId - The tracking index or ID signature of the target deck.
 */
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

  /**
   * Instantiates a single flashcard DOM element fragment from an existing template markup.
   * Attaches event listeners for clicking to reveal/hide answers and triggering deletion confirmation.
   *
   * @param {Object} item - The individual card data item profile.
   * @param {string} item.question - The question side contents.
   * @param {string} item.answer - The answer side contents.
   * @returns {HTMLElement} A fully configured card DOM clone node.
   */
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

  /**
   * Generates a structural flashcard element block and inserts it at the beginning of the container.
   *
   * @param {Object} item - The explicit details dataset configuration for a specific card entry.
   */
  function renderCardEl(item) {
    const result = createCardEl(item);
    cardContainerEl.prepend(result);
  }

  currentDeck.cards.forEach(renderCardEl);
}

export { renderDeckView, fetchedDecks };
