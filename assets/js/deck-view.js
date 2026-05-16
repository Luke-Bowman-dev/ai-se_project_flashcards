import { getDeckByID } from "./decks.js";
import { stringToHex, hexToString, removeColorClasses } from "./colorMap.js";
import { currentDeck } from "./index.js";
import { modal } from "./modal.js";
import { addCard, deleteCard, updateCard } from "./api.js";

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

/** * Handles toggling visibility layout styles across different view elements.
 *  @param {HTMLElement} section - The container element to make active.
 *  @param {string} display - The CSS display mode property value (e.g., "block", "flex"). */

function showView(section, display) {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  section.style.display = display;
}

/** * Renders the full deck layout including the listing grid of individual flashcards.
 * Falls back to an alternative layout view if the target source dataset is empty.
 * @param {string|number} deckId - The tracking index or ID signature of the target deck. */

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

  /** * Instantiates a single flashcard DOM element fragment from an existing template markup.
   *  Attaches event listeners for clicking to reveal/hide answers and triggering deletion confirmation.
   *  @param {Object} item - The individual card data item profile.
   * @param {string} item.question - The question side contents.
   * @param {string} item.answer - The answer side contents.
   * @returns {HTMLElement} A fully configured card DOM clone node. */

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

      const modalConfirmBtn = confirmationModalEl.querySelector(
        ".modal__btn_type_confirm",
      );

      modalConfirmBtn.onclick = () => {
        deleteCard(item._id)
          .then(() => {
            const cardIndex = currentDeck.cards.findIndex(
              (c) => c._id === item._id,
            );
            if (cardIndex !== -1) {
              currentDeck.cards.splice(cardIndex, 1);
            }
            cardEl.remove();
          })
          .catch((err) => {
            console.error("Failed to delete card:", err);
            alert("Could not delete this card from the server.");
          });
      };
    });

    const editBtn = cardEl.querySelector(".card__edit-button");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        const editFormEl = createEditCardForm(item, true);
        cardEl.replaceWith(editFormEl);
      });
    }

    return cardEl;
  }

  /** * Generates a structural flashcard element block and inserts it at the beginning of the container.
   *  @param {Object} item - The explicit details dataset configuration for a specific card entry. */
  function renderCardEl(item) {
    const result = createCardEl(item);
    cardContainerEl.prepend(result);
  }

  currentDeck.cards.forEach(renderCardEl);
}

/** * Creates an interactive form component for a card currently being created or edited. * This satisfies the Figma requirement of a single <form> enclosing both sides. *
 * @param {Object} [initialData] - Optional existing card data if editing instead of creating.
 * @param {string} [initialData.question]
 *  @param {string} [initialData.answer]
 *  @param {boolean} [isEditing] - Toggles whether submission triggers a PUT or POST network request.
 *  @returns {HTMLFormElement} The configured form element ready for the DOM. */

function createEditCardForm(
  initialData = { question: "", answer: "" },
  isEditing = false,
) {
  const formEl = document.createElement("form");
  formEl.className = `card card-edit card_color_${hexToString(currentDeck.color)}`;

  let localShowingQuestion = true;

  formEl.innerHTML = ` 
    <div class="card__content"> 
      <input type="text" name="question" class="card__input" placeholder="Enter Question" value="${initialData.question}" required /> 
      <input type="text" name="answer" class="card__input" placeholder="Enter Answer" value="${initialData.answer}" required style="display: none;" /> 
    </div> 
    <div class="card__controls"> 
      <button type="button" class="card__btn_type_flip"><img src="./assets/images/flip.svg" /></button> 
      <button type="submit" class="card__btn_type_save"><img src="./assets/images/checkmark.svg" /></button> 
    </div> 
  `;

  const questionInput = formEl.querySelector('input[name="question"]');
  const answerInput = formEl.querySelector('input[name="answer"]');
  const flipBtn = formEl.querySelector(".card__btn_type_flip");

  setTimeout(() => questionInput.focus(), 0);

  flipBtn.addEventListener("click", () => {
    localShowingQuestion = !localShowingQuestion;
    if (localShowingQuestion) {
      formEl.className = `card card-edit card_color_${hexToString(currentDeck.color)}`;
      questionInput.style.display = "block";
      answerInput.style.display = "none";
      questionInput.focus();
    } else {
      formEl.className = "card card-edit card_color_white";
      questionInput.style.display = "none";
      answerInput.style.display = "block";
      answerInput.focus();
    }
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      question: questionInput.value.trim(),
      answer: answerInput.value.trim(),
    };

    if (isEditing) {
      updateCard(initialData._id, payload)
        .then((updatedCard) => {
          const cardIndex = currentDeck.cards.findIndex(
            (c) => c._id === initialData._id,
          );
          if (cardIndex !== -1) {
            currentDeck.cards[cardIndex] = updatedCard;
          }
          renderDeckView(currentDeck._id);
        })
        .catch((err) => {
          console.error("Failed to update card parameters:", err);
          alert("Could not update this card on the server.");
        });
    } else {
      addCard(currentDeck._id, payload)
        .then((newCard) => {
          currentDeck.cards.push(newCard);
          renderDeckView(currentDeck._id);
        })
        .catch((err) => {
          console.error("Failed to post card parameters:", err);
          alert("Could not save this card to the server.");
        });
    }
  });

  return formEl;
}

const newCardBtn = document.querySelector(
  ".gallery__new-card-btn_location_deck-view",
);

newCardBtn.addEventListener("click", () => {
  if (!currentDeck) return;
  const cardContainerEl = deckViewSection.querySelector(".gallery__list");
  const editableCardForm = createEditCardForm();
  cardContainerEl.prepend(editableCardForm);
});

export { renderDeckView, fetchedDecks };
