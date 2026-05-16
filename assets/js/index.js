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
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const newDeckViewSection = document.querySelector("#new-deck-view");
const aboutViewSection = document.querySelector("#about-view");
const pageEl = document.querySelector(".page__main-content");
let currentDeck = null;
let currentCardEl = null;
const confirmationModalEl = document.querySelector("#confirmation-modal");
const errorModalEl = document.querySelector("#error-modal");
const errorModalDismissBtn = errorModalEl.querySelector(".error-modal__close");
const deckTemplateEl = document.querySelector("#deck-template");
const deckContainerEl = homeSection.querySelector(".gallery__list");
deckContainerEl.innerHTML = "";
errorModalDismissBtn.addEventListener("click", () => {
  errorModalEl.classList.remove("modal_visible");
});

function showView(section, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  newDeckViewSection.style.display = "none";
  aboutViewSection.style.display = "none";
  section.style.display = display;
}
function renderHomeView() {
  showView(homeSection, "flex");
  pageEl.classList.remove("page__main-content_carousel");

  const pageGradientEl = document.querySelector(".page");
  pageGradientEl.classList.remove("page_no-mobile-bar");
}

function renderNotFoundView() {
  showView(notFoundSection, "flex");
  pageEl.classList.remove("page__main-content_carousel");
  const pageGradientEl = document.querySelector(".page");
  pageGradientEl.classList.remove("page_no-mobile-bar");
}

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
function renderDeckEl(item) {
  const result = createDeckEl(item);
  deckContainerEl.prepend(result);
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
const practiceButtonEl = document.querySelector(".gallery__practice-button");
practiceButtonEl.addEventListener("click", () => {
  let currentDeckId = currentDeck._id;
  window.location.hash = `#carousel/${currentDeckId}`;
});

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
