import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegistering) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(userCred.user);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        onLogin(userCred.user);
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-extrabold mb-6 text-center">{isRegistering ? "Registrar-se" : "Inicia sessió"}</h2>

        <div className="space-y-6">
          <input
            className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
            type="email"
            placeholder="📧 Correu electrònic"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
            type="password"
            placeholder="🔒 Contrasenya"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 transition-all transform hover:scale-105 p-3 rounded-lg font-bold shadow-lg"
          >
            {isRegistering ? "Registrar-se" : "Iniciar sessió"}
          </button>

          <p className="text-sm text-center">
            {isRegistering ? "Ja tens compte?" : "No tens compte?"}{" "}
            <button
              className="text-indigo-300 hover:text-indigo-200 underline transition-all"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Inicia sessió" : "Registra't"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
