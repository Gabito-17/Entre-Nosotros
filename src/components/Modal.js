import React from "react";

const Modal = () => {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        enviar sugerencia
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Ooops!</h3>
          <p className="py-4">Intentalo mañana tal vez funcione. </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
