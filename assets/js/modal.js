const confirmationModalEl = document.querySelector("#confirmation-modal");

function modal() {
  const cancelButtonEl = document.querySelector(".modal__btn_type_cancel");
  const confirmButtonEl = document.querySelector(".modal__btn_type_confirm");

  function handleCancel() {
    confirmationModalEl.classList.remove("modal_visible");
    cleanup();
  }

  function handleConfirm() {
    confirmationModalEl.classList.remove("modal_visible");
    cleanup();
  }

  function cleanup() {
    cancelButtonEl.removeEventListener("click", handleCancel);
    confirmButtonEl.removeEventListener("click", handleConfirm);
  }

  cancelButtonEl.addEventListener("click", handleCancel);
  confirmButtonEl.addEventListener("click", handleConfirm);
}

export { modal };
