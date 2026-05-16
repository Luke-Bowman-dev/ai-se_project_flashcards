import { addDeck } from "./api.js";
import { fetchedDecks } from "./deck-view.js";

/** @type {RegExp} - Regex pattern verifying standard 6-digit hexadecimal format. */
const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/** @type {HTMLElement} - The modal overlay component housing technical issue text. */
const errorModalEl = document.querySelector("#error-modal");

/** @type {HTMLElement} - The exact DOM textual node container where problem alerts populate. */
const errorModalMsg = errorModalEl.querySelector(".error-modal__error");

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

/** @type {HTMLFormElement} - The form wrapper monitoring the creation parameters of new card decks. */
const newDeckForm = document.querySelector(".new-deck-view__form");

/** @type {HTMLButtonElement} - The control button used to submit configuration forms. */
const newDeckSubmitBtn = document.querySelector(
  ".new-deck-view__form__submit-btn",
);

/** @type {HTMLTextAreaElement} - The textarea entry box designated for raw JSON dataset input. */
const newDeckTextarea = document.querySelector(".new-deck-view_form_input");

/**
 * Adjusts structural activity statuses to allow button form processing.
 *
 * @param {HTMLButtonElement} btn - The target button reference elements.
 */
function disableSubmitBtn(btn) {
  btn.disabled = false;
}

/**
 * Controls the visibility overlay parameters for tracking and revealing warning popups.
 *
 * @param {string} message - The contextual explanation text to render.
 */
function showError(message) {
  errorModalMsg.textContent = message;
  errorModalEl.classList.add("modal_visible");
}

/**
 * Verifies if a given deck title adheres to string type properties and length restrictions.
 *
 * @param {any} name - The targeted asset parameter evaluated for string compliance.
 * @returns {string|null} The verified name string on success, or null if validation fails.
 */
function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

/**
 * Attempts to parse a raw string signature profile into a valid JavaScript Object layout safely.
 *
 * @param {string} jsonString - The original string payload monitored for notation parsing.
 * @returns {Object|null} The cleanly structured layout representation on success, or null.
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

newDeckForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const jsonData = parseJSON(values.deckName);

  if (jsonData === null) {
    showError("JSON parsing failed.");
    return;
  }

  const name = validateName(jsonData.name);
  if (name === null) {
    showError("Name must be a string between 2 and 80 characters.");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("Cards must be an array.");
    return;
  }

  if (jsonData.color !== undefined) {
    if (typeof jsonData.color !== "string") {
      showError("JSON object's color must be a string.");
      return;
    }
    if (normalizeColor(values.color) !== normalizeColor(jsonData.color)) {
      showError("JSON object's color must match selected color.");
      return;
    }
  }

  const color = normalizeColor(values.color);

  addDeck({
    name: jsonData.name,
    cards: jsonData.cards,
    color: color,
  })
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      window.location.hash = "deck-view/" + newDeck._id;
    })
    .catch((err) => {
      showError("Failed to save the new deck to the server.");
    });
});

export {
  disableSubmitBtn,
  newDeckForm,
  newDeckSubmitBtn,
  newDeckTextarea,
  showError,
};
