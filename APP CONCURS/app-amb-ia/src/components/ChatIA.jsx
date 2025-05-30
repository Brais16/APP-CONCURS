import React, { useState } from "react";
import axios from "axios";

function ChatIA() {
  const [input, setInput] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo", // Pots provar també: "mistralai/mistral-7b-instruct"
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            "Authorization": "Bearer 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", // ⛔️ Substitueix això
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.choices?.length > 0) {
        setResposta(data.choices[0].message.content);
      } else {
        setResposta("🤖 No he pogut entendre la pregunta.");
      }
    } catch (err) {
      console.error(err);
      setResposta("❌ Error en la resposta de la IA.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Xat amb IA (OpenRouter)</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Pregunta el que vulguis..."
        style={{ width: "80%", padding: 7, marginRight: 3 }}
      />
      <button onClick={handleEnviar} style={{ padding: 10, marginLeft: 600, background: "red", marginTop: 23,   }}>
        Enviar
      </button>
      {loading ? <p>⏳ Pensant...</p> : <p><strong>Resposta:</strong> {resposta}</p>}
    </div>
  );
}

export default ChatIA;
