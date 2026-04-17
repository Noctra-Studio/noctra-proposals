"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => Promise<void>;
  loading: boolean;
}

export function AcceptModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: ModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[2rem] p-8 md:p-12 max-w-lg w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-8">
          <h2 className="font-serif text-3xl font-medium leading-tight text-black">
            ¡Perfecto! Vamos a trabajar juntos 🎉
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Al aceptar esta propuesta confirmas que estás de acuerdo con los
          servicios, alcances y costos descritos. El siguiente paso será firmar
          el contrato de servicios.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
              Tu nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre para confirmar"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-black"
              required
            />
          </div>

          <button
            onClick={() => onConfirm({ client_signed_name: name })}
            disabled={loading || !name.trim()}
            className="w-full bg-white text-black border border-gray-200 font-bold py-5 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Confirmar aceptación"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeedbackModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  type,
}: ModalProps & { type: "changes_requested" | "rejected" }) {
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const config = {
    changes_requested: {
      title: "Cuéntanos qué necesitas ajustar",
      text: "Describe con detalle los cambios o la información adicional que necesitas antes de tomar una decisión.",
      label: "¿Qué cambios o dudas tienes?",
      button: "Enviar solicitud de cambios",
      color: "border-black",
      bgButton: "bg-black text-white",
    },
    rejected: {
      title: "Entendemos tu decisión",
      text: "Tu feedback es muy valioso para nosotros. ¿Podrías compartirnos el motivo?",
      label: "¿Por qué no es el momento adecuado?",
      button: "Enviar respuesta",
      color: "border-red-500",
      bgButton: "bg-red-600 text-white",
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[2rem] p-8 md:p-12 max-w-lg w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-8">
          <h2 className="font-serif text-3xl font-medium leading-tight text-black">
            {config.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">{config.text}</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
              {config.label}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Escribe tus comentarios aquí..."
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none text-black"
              required
            />
            <p className="text-right text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
              Mínimo 20 caracteres • {comments.length}/20
            </p>
          </div>

          <button
            onClick={() => onConfirm({ comments })}
            disabled={loading || comments.trim().length < 20}
            className={`w-full ${config.bgButton} font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2`}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              config.button
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
