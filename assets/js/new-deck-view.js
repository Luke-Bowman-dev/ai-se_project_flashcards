import { decks } from "./decks.js";
const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;
const errorModalEl = document.querySelector("#error-modal");
const errorModalMsg = errorModalEl.querySelector(".error-modal__error");
/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

const newDeckForm = document.querySelector(".new-deck-view__form");
const newDeckSubmitBtn = document.querySelector(
  ".new-deck-view__form__submit-btn",
);
const newDeckTextarea = document.querySelector(".new-deck-view_form_input");

function disableSubmitBtn(btn) {
  btn.disabled = false;
}

function showError(message) {
  errorModalMsg.textContent = message;
  errorModalEl.classList.add("modal_visible");
}

function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

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

  const newDeck = {
    id: `${slugify(jsonData.name)}-${Date.now()}`,
    color: normalizeColor(values.color),
    cards: jsonData.cards,
    name: jsonData.name,
  };
  decks.push(newDeck);
  window.location.hash = "deck-view/" + newDeck.id;
});

export { disableSubmitBtn, newDeckForm, newDeckSubmitBtn, newDeckTextarea };
