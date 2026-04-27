import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const pageEl = document.querySelector(".page__main-content");
let currentDeck = null;
function renderHomeView() {
  homeSection.style.display = "flex";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  pageEl.classList.remove("page__main-content_carousel");
  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = homeSection.querySelector(".gallery__list");
  deckContainerEl.innerHTML = "";

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
      deckEl.remove();
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
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "flex";
  pageEl.classList.remove("page__main-content_carousel");
}

function router() {
  const hash = window.location.hash.slice(1) || "home";

  if (hash === "home" || hash === "") {
    renderHomeView();
  } else if (hash.startsWith("carousel/")) {
    homeSection.style.display = "none";
    deckViewSection.style.display = "none";
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";
    pageEl.classList.add("page__main-content_carousel");
    const deckId = hash.split("/")[1];
    currentDeck = getDeckByID(deckId);
    renderCarouselView(currentDeck);
  } else if (hash.startsWith("deck-view/")) {
    const deckId = hash.split("/")[1];
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
