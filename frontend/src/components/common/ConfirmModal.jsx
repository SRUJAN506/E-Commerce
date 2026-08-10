import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-950/50",
      btnClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-950/50",
      btnClass: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white"
    },
    info: {
      icon: AlertTriangle,
      iconColor: "text-primary dark:text-primary",
      iconBg: "bg-primary/10",
      btnClass: "bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground"
    }
  };

  const config = typeConfig[type] || typeConfig.danger;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex gap-4">
            {/* Warning icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-red-100 dark:bg-red-950/50 ${config.iconColor}`}>
              <Icon size={24} />
            </div>

            <div className="space-y-2 flex-grow">
              <h3 className="text-lg font-bold text-foreground pr-6">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 ${config.btnClass}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
