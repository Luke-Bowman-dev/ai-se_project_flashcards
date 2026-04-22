import { decks, getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";
const homeSection = document.querySelector("#home");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const pageEl = document.querySelector(".page__main-content");
function renderHomeView() {
  homeSection.style.display = "flex";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  pageEl.classList.remove("page__main-content_carousel");
  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = document.querySelector(".decks__list");
  deckContainerEl.innerHTML = "";

  function createDeckEl(item) {
    const deckEl = deckTemplateEl.content
      .querySelector(".deck")
      .cloneNode(true);
    const deckTitleEl = deckEl.querySelector(".deck__title");
    deckTitleEl.textContent = item.name;
    const deckLinkEl = deckEl.querySelector(".deck__link");
    deckLinkEl.href = `#carousel/${item.id}`;
    const color = hexToString(item.color);
    deckEl.classList.add(`deck_color_${color}`);
    const deckCountEl = deckEl.querySelector(".deck__count");
    deckCountEl.textContent = `${item.cards.length} cards`;
    const deleteBtn = deckEl.querySelector(".deck__delete-button");
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
    carouselSection.style.display = "flex";
    notFoundSection.style.display = "none";
    pageEl.classList.add("page__main-content_carousel");
    const deckId = hash.split("/")[1];
    const currentDeck = getDeckByID(deckId);
    renderCarouselView(currentDeck);
  } else {
    renderNotFoundView();
  }
}
window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
