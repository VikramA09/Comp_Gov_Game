import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
};

export function Modal({ open, onClose, title, children, wide }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="modal-title"
            className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-regime-mid p-5 shadow-2xl ${wide ? "max-w-2xl" : "max-w-lg"}`}
            initial={{ y: 40, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 id="modal-title" className="font-display text-xl font-bold">
                {title}
              </h2>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-2 py-1 text-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
              )}
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
