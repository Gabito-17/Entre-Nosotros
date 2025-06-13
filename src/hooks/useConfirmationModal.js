import { useCallback, useState } from "react";
import ConfirmationModal from "../components/Modals/ConfirmationModal";

export default function useConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const open = useCallback((title, message, onConfirm) => {
    setConfig({ title, message, onConfirm });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const Modal = isOpen ? (
    <ConfirmationModal
      onClose={close}
      onConfirm={() => {
        config.onConfirm?.();
        close();
      }}
      title={config.title}
      message={config.message}
    />
  ) : null;

  return { openConfirmation: open, ConfirmationModalComponent: Modal };
}
