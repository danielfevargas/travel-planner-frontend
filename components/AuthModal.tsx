"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Loader2, Plane, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isModalOpen, modalTab, closeAuthModal, signIn, signUp } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(modalTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Reset tab to the requested one each time the modal opens
  useEffect(() => {
    if (isModalOpen) setTab(modalTab);
  }, [isModalOpen, modalTab]);

  if (!isModalOpen) return null;

  const reset = () => {
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
    setConfirmationSent(false);
  };

  const handleTabSwitch = (newTab: "login" | "register") => {
    setTab(newTab);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      if (!name.trim()) {
        setError("El nombre es requerido");
        setLoading(false);
        return;
      }
      const { error, needsConfirmation } = await signUp(email, password, name);
      if (error) {
        setError(error);
      } else if (needsConfirmation) {
        setConfirmationSent(true);
      }
    }

    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) { reset(); closeAuthModal(); }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 p-6 text-white relative">
          <button
            onClick={() => { reset(); closeAuthModal(); }}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Plane className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg">TravelPlanner</span>
          </div>
          <h2 className="text-2xl font-black mb-1">
            {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <p className="text-green-200 text-sm">
            {tab === "login"
              ? "Bienvenido de vuelta"
              : "Únete y guarda tus itinerarios"}
          </p>
        </div>

        <div className="p-6">
          {confirmationSent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                ¡Revisa tu email!
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Te enviamos un enlace de confirmación a{" "}
                <strong className="text-gray-700">{email}</strong>. Confirma tu cuenta
                y vuelve a iniciar sesión.
              </p>
              <button
                onClick={() => handleTabSwitch("login")}
                className="mt-6 text-green-700 font-semibold text-sm hover:underline"
              >
                Ir a Iniciar sesión →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tab === "register" ? "Mínimo 6 caracteres" : "Tu contraseña"}
                    required
                    minLength={tab === "register" ? 6 : 1}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-800 to-green-600 text-white py-3.5 rounded-xl font-bold hover:from-green-700 hover:to-green-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {tab === "login" ? "Entrando..." : "Creando cuenta..."}
                  </>
                ) : tab === "login" ? (
                  "Iniciar sesión"
                ) : (
                  "Crear cuenta"
                )}
              </button>

              <div className="mt-2 border-t border-gray-100 pt-4 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  {tab === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                </p>
                <button
                  type="button"
                  onClick={() => handleTabSwitch(tab === "login" ? "register" : "login")}
                  className="w-full py-2.5 rounded-xl border-2 border-green-600 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
                >
                  {tab === "login" ? "Regístrate gratis" : "Iniciar sesión"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
