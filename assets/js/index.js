import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { modal } from "./modal.js";
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const pageEl = document.querySelector(".page__main-content");
let currentDeck = null;
let currentCardEl = null;
const confirmationModalEl = document.querySelector("#confirmation-modal");
function showView(section, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  section.style.display = display;
}
function renderHomeView() {
  showView(homeSection, "flex");
  pageEl.classList.remove("page__main-content_carousel");
  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = homeSection.querySelector(".gallery__list");
  deckContainerEl.innerHTML = "";
  const pageGradientEl = document.querySelector(".page");
  pageGradientEl.classList.remove("page_no-mobile-bar");
  function createDeckEl(item) {
    const deckEl = deckTemplateEl.content
      .querySelector(".card")
      .cloneNode(true);
    const deckTitleEl = deckEl.querySelector(".card__title");
    deckTitleEl.textContent = item.name;
    const deckLinkEl = deckEl.querySelector(".card__link");
    deckLinkEl.href = `#deck-view/${item.id}`;
    const color = hexToString(item.color);
    removeColorClasses(deckEl);
    deckEl.classList.add(`card_color_${color}`);
    const deckCountEl = deckEl.querySelector(".card__count");
    deckCountEl.textContent = `${item.cards.length} cards`;
    const deleteBtn = deckEl.querySelector(".card__delete-button");
    deleteBtn.addEventListener("click", () => {
      confirmationModalEl.classList.add("modal_visible");
      modal(deckEl);
    });
    return deckEl;
  }
  function renderDeckEl(item) {
    const result = createDeckEl(item);
    deckContainerEl.prepend(result);
  }
  decks.forEach(renderDeckEl);
}

function renderNotFoundView() {
  showView(notFoundSection, "flex");
  pageEl.classList.remove("page__main-content_carousel");
  const pageGradientEl = document.querySelector(".page");
  pageGradientEl.classList.remove("page_no-mobile-bar");
}

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
  } else {
    renderNotFoundView();
  }
}
const practiceButtonEl = document.querySelector(".gallery__practice-button");
practiceButtonEl.addEventListener("click", () => {
  let currentDeckId = currentDeck.id;
  window.location.hash = `#carousel/${currentDeckId}`;
});

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
export { currentDeck };
