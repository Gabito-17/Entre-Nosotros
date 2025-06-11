const ConfirmationModal = ({ onClose, onConfirm, title, message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box w-full max-w-md">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-outline btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-error text-white" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
