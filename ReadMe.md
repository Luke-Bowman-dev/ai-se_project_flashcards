# Flashcard App

This repository is a project for the Software Developer Course at TripleTen. It is a dynamic web application that allows users to create, manage, and view flashcard decks for the purpose of learning any subject they desire.

## Features

- **Interactive Decks**: Flashcard decks are clearly titled and color-coded. Clicking a deck opens its detailed gallery view.
- **Flashcard Actions**: The cards display questions on the front side and flip seamlessly to reveal answers on a white background when the flip button is clicked.
- **Practice Mode**: A focus-driven carousel mode that isolates one card at a time to optimize study sessions.
- **Custom Deck Creation**: Create new decks from the dashboard by submitting organized card structures and assigning custom theme colors.
- **Inline Card Editing & Creation**: Add new cards locally or rewrite existing ones using seamless, inline form inputs before syncing changes.
- **System Safeguards**: Destructive actions (like deleting a deck or an individual card) require confirmation via an overlay system layout modal.
- **Responsive Design**: Includes a fully optimized layout built intentionally for clean mobile-device browser execution.

## Advanced Features & Integration

- **Remote API Database Syncing**: The interface interacts with a persistent remote database. Actions like creating decks, fetching card data, editing text fields, and running deletions dynamically update the server via RESTful API architecture (`GET`, `POST`, `PUT`, `DELETE`).
- **Robust Error Handling**: Network or data parsing issues are intercepted and gracefully managed by capturing the status rules and displaying clear, readable alert messages to the user via a centralized notification modal layout.
- **Fully Documented Codebase**: Complete structural visibility is maintained through thorough JSDoc documentation applied across variables, view layout systems, event controllers, and modular endpoints.

## Technologies Used

- HTML5, CSS3, and JavaScript (ES6 Modules)
- Local development compiled using VS Code
- Remote REST API Integration via Fetch API

## Deployed Site

Check Out [this site](https://luke-bowman-dev.github.io/ai-se_project_flashcards/) on GitHub Pages.

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1dnVCmVIQHOCMEkKEOhpLHV7azpEdUUtI/view?usp=sharing), where I describe my project and some challenges I faced while building it.
