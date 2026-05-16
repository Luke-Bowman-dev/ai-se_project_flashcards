import { getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView, fetchedDecks } from "./deck-view.js";
import { modal } from "./modal.js";
import {
  disableSubmitBtn,
  newDeckForm,
  newDeckSubmitBtn,
  newDeckTextarea,
  showError,
} from "./new-deck-view.js";
import { getDecks, deleteDeck, addDeck } from "./api.js";

/** @type {HTMLElement} - The homepage view layout container. */
const homeSection = document.querySelector("#home");

/** @type {HTMLElement} - The detail grid view section container for single decks. */
const deckViewSection = document.querySelector("#deck-view");

/** @type {HTMLElement} - The flashcard sliding carousel screen container. */
const carouselSection = document.querySelector("#carousel");

/** @type {HTMLElement} - The fallback error layout view container. */
const notFoundSection = document.querySelector("#not-found");

/** @type {HTMLElement} - The initialization screen layout for creating decks. */
const newDeckViewSection = document.querySelector("#new-deck-view");

/** @type {HTMLElement} - The information text or app details summary view container. */
const aboutViewSection = document.querySelector("#about-view");

/** @type {HTMLElement} - The main master layout body wrapper enclosing content views. */
const pageEl = document.querySelector(".page__main-content");

/** @type {Object|null} - Tracks the active deck item data configuration currently being viewed. */
let currentDeck = null;

/** @type {HTMLElement|null} - Tracks the specific interactive card template instance targeted for modification. */
let currentCardEl = null;

/** @type {HTMLElement} - The action validation overlay interface for confirmed items. */
const confirmationModalEl = document.querySelector("#confirmation-modal");

/** @type {HTMLElement} - The popup notice display modal used to output system errors. */
const errorModalEl = document.querySelector("#error-modal");

/** @type {HTMLElement} - The interactive button used to close out the error display modal. */
const errorModalDismissBtn = errorModalEl.querySelector(".error-modal__close");

/** @type {HTMLTemplateElement} - The base markup layout blueprint used to construct deck components. */
const deckTemplateEl = document.querySelector("#deck-template");

/** @type {HTMLElement} - The grid display container element where cards and decks render. */
const deckContainerEl = homeSection.querySelector(".gallery__list");

deckContainerEl.innerHTML = "";

errorModalDismissBtn.addEventListener("click", () => {
  errorModalEl.classList.remove("modal_visible");
});

/**
 * Resets the global view structure layout, isolating visibility to only the target layer.
 *
 * @param {HTMLElement} section - The specific layout layout container element to be exposed.
 * @param {string} display - The explicit CSS rule layout string to handle target mapping (e.g., "flex", "block").
 */
function showView(section, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckViewSection.style.display = "none";
  aboutViewSection.style.display = "none";
  section.style.display = display;
}

/**
 * Transitions layout components into the default dashboard index profile state.
 */
function renderHomeView() {
  showView(homeSection, "flex");
  pageEl.classList.remove("page__main-content_carousel");
  const pageGradientEl = document.querySelector(".page");
  pageGradientEl.classList.remove("page_no-mobile-bar");
}

/**
 * Fallback route processor triggered during lookup failure parameters.
 */
function renderNotFoundView() {
  showView(notFoundSection, "flex");
  pageEl.classList.remove("page__main-content_carousel");
  const pageGradientEl = document.querySelector(".page");
  pageGradientEl.classList.remove("page_no-mobile-bar");
}

/**
 * Generates an individual deck node structure clone from the target template blueprint.
 * Binds deletion event processes that interact with network endpoints.
 *
 * @param {Object} item - The explicit data context for the targeted deck payload item.
 * @param {string} item._id - The database indexing ID tag configuration signature.
 * @param {string} item.name - The explicit title display definition for the item.
 * @param {string} item.color - The hexadecimal configuration color property tag.
 * @param {Object[]} item.cards - The complete listing of flashcard detail payload items inside the deck.
 * @returns {HTMLElement} A fully parameterized and cloned deck container DOM fragment.
 */
function createDeckEl(item) {
  const deckTemplateEl = document.querySelector("#deck-template");
  const deckEl = deckTemplateEl.content.querySelector(".card").cloneNode(true);
  const deckTitleEl = deckEl.querySelector(".card__title");
  deckTitleEl.textContent = item.name;

  const deckLinkEl = deckEl.querySelector(".card__link");
  deckLinkEl.href = `#deck-view/${item._id}`;

  const color = hexToString(item.color);
  removeColorClasses(deckEl);
  deckEl.classList.add(`card_color_${color}`);

  const deckCountEl = deckEl.querySelector(".card__count");
  deckCountEl.textContent = `${item.cards.length} cards`;

  const deleteBtn = deckEl.querySelector(".card__delete-button");
  deleteBtn.addEventListener("click", () => {
    confirmationModalEl.classList.add("modal_visible");
    modal();

    const modalConfirmBtn = confirmationModalEl.querySelector(
      ".modal__btn_type_confirm",
    );

    modalConfirmBtn.onclick = () => {
      deleteDeck(item._id)
        .then(() => {
          const deckIndex = fetchedDecks.findIndex((d) => d._id === item._id);
          if (deckIndex !== -1) {
            fetchedDecks.splice(deckIndex, 1);
          }
          deckEl.remove();
        })
        .catch(showError);
    };
  });

  return deckEl;
}

/**
 * Higher-level layout function passing deck data to a factory and mounting it directly inside the main gallery.
 *
 * @param {Object} item - The individual dataset metadata parameters describing a deck entity.
 */
function renderDeckEl(item) {
  const result = createDeckEl(item);
  deckContainerEl.prepend(result);
}

/**
 * Evaluates the window navigation hash route location and dispatches rendering functions to match the layout.
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("carousel/")) {
    showView(carouselSection, "flex");
    pageEl.classList.add("page__main-content_carousel");
    const deckId = hash.split("/")[1];
    currentDeck = getDeckByID(deckId);
    renderCarouselView(currentDeck);
  } else if (hash.startsWith("deck-view/")) {
    const deckId = hash.split("/")[1];
    showView(deckViewSection, "flex");
    pageEl.classList.remove("page__main-content_carousel");
    currentDeck = getDeckByID(deckId);
    renderDeckView(deckId);
  } else if (hash === "new-deck-view") {
    showView(newDeckViewSection, "flex");
    pageEl.classList.remove("page__main-content_carousel");
    disableSubmitBtn(newDeckSubmitBtn);
  } else if (hash === "about") {
    showView(aboutViewSection, "flex");
    pageEl.classList.remove("page__main-content_carousel");
  } else {
    renderNotFoundView();
  }
}

/** @type {HTMLElement} - The button used to initiate the slide viewer mode for the loaded deck. */
const practiceButtonEl = document.querySelector(".gallery__practice-button");
practiceButtonEl.addEventListener("click", () => {
  let currentDeckId = currentDeck._id;
  window.location.hash = `#carousel/${currentDeckId}`;
});

/** @type {HTMLElement} - The landing page action interface used to invoke creation form views. */
const newDeckViewButtonEl = document.querySelector(
  "#home .gallery__new-card-button",
);
newDeckViewButtonEl.addEventListener("click", () => {
  window.location.hash = `#new-deck-view`;
});

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      decks.forEach(renderDeckEl);
      fetchedDecks.push(...decks);
    })
    .catch(showError)
    .finally(router);
});

window.addEventListener("hashchange", router);

export { currentDeck };
