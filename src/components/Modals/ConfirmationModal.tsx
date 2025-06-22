import { useUiStore } from "../../stores/useUiStore.ts";

const ConfirmationModal = () => {
  const confirmationModal = useUiStore((state) => state.confirmationModal);
  const closeConfirmationModal = useUiStore(
    (state) => state.closeConfirmationModal
  );

  if (!confirmationModal) return null;

  const { title, message, onConfirm, actions } = confirmationModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="modal-box w-full max-w-md p-6"
        style={{ minWidth: 300, maxWidth: 420 }}
      >
        <h3 className="font-bold text-center text-lg mb-2">{title}</h3>
        <p className="py-4 mb-4 text-center">{message}</p>
        <div className="modal-action flex flex-col gap-2 w-full !items-stretch p-0 m-0">
          {actions && Array.isArray(actions) && actions.length > 0 ? (
            actions.map((action, idx) => (
              <button
                key={idx}
                className={`btn btn-sm w-full text-center ${
                  action.className || "btn"
                }`}
                style={{
                  minWidth: 120,
                  margin: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  justifyContent: "center",
                }}
                onClick={async () => {
                  await action.onClick?.();
                  closeConfirmationModal();
                }}
              >
                {action.label}
              </button>
            ))
          ) : (
            <>
              <button
                className="btn btn-error btn-sm w-full text-center"
                onClick={async () => {
                  await onConfirm?.();
                  closeConfirmationModal();
                }}
                style={{
                  minWidth: 120,
                  margin: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  justifyContent: "center",
                }}
              >
                Sí
              </button>
              <button
                className="btn btn-secondary btn-sm w-full text-center"
                onClick={closeConfirmationModal}
                style={{
                  minWidth: 120,
                  margin: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  justifyContent: "center",
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
