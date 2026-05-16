/**
 * @file API service for managing flashcard decks.
 */

const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019e2e3c-e067-751d-8b9e-bb94024950c7",
};

/**
 * Validates the network response, parsing JSON on success or rejecting on failure.
 *
 * @param {Response} res - The Fetch API Response object.
 * @returns {Promise<any>} A promise that resolves with the parsed JSON data.
 * @throws {Promise<string>} A rejected promise with an error message containing the status code.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Fetches all available flashcard decks from the server.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of deck objects.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, {
    headers,
  }).then((res) => {
    return processResponse(res);
  });
}

/**
 * Deletes a specific flashcard deck by its unique identifier.
 *
 * @param {string|number} deckId - The unique ID of the deck to delete.
 * @returns {Promise<any>} A promise that resolves with the server response verification.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then((res) => processResponse(res));
}

/**
 * Creates a new flashcard deck on the server.
 *
 * @param {Object} deckData - The configuration object for the new deck.
 * @param {string} deckData.name - The display name of the deck.
 * @param {string} deckData.color - The theme color (e.g., hex code or name) of the deck.
 * @param {any[]} deckData.cards - An array of card objects to include in the deck.
 * @returns {Promise<any>} A promise that resolves to the newly created deck object.
 */
function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, color, cards }),
  }).then((res) => processResponse(res));
}

export { getDecks, deleteDeck, addDeck };
