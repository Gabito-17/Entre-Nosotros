const ConfirmationModal = ({ onClose, onConfirm, title, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mt-3 text-gray-600">{message}</p>
        <div className="mt-5 flex justify-end space-x-3">
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
