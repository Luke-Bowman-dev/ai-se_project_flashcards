import { fetchedDecks } from "./deck-view.js";

/**
 * Retrieves a deck object by its ID from the decks array.
 *
 * @param {string} deckId - The unique identifier of the deck to retrieve
 * @returns {object|undefined} The deck object if found, undefined otherwise
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

export { decks, getDeckByID };
