/** @type {HTMLElement} - The confirmation modal overlay element container. */
const confirmationModalEl = document.querySelector("#confirmation-modal");

/**
 * Initializes and manages the lifecycle event listeners for the confirmation modal.
 * Attaches handlers for both confirmation and cancellation actions, ensuring proper cleanup.
 */
function modal() {
  const cancelButtonEl = document.querySelector(".modal__btn_type_cancel");
  const confirmButtonEl = document.querySelector(".modal__btn_type_confirm");

  /**
   * Handles the cancel action by hiding the modal and tearing down listeners.
   */
  function handleCancel() {
    confirmationModalEl.classList.remove("modal_visible");
    cleanup();
  }

  /**
   * Handles the confirmation action by hiding the modal and tearing down listeners.
   */
  function handleConfirm() {
    confirmationModalEl.classList.remove("modal_visible");
    cleanup();
  }

  /**
   * Removes click event listeners from the modal buttons to prevent memory leaks and duplicate triggers.
   */
  function cleanup() {
    cancelButtonEl.removeEventListener("click", handleCancel);
    confirmButtonEl.removeEventListener("click", handleConfirm);
  }

  cancelButtonEl.addEventListener("click", handleCancel);
  confirmButtonEl.addEventListener("click", handleConfirm);
}

export { modal };
