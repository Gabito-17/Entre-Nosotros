import { CheckIcon } from "@heroicons/react/24/outline";

const SuccessModal = ({ onClose, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="modal-box p-6 rounded-lg shadow-lg text-center bg-white">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          className="btn btn-circle btn-sm btn-primary p-1"
          onClick={onClose}
        >
          <CheckIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
