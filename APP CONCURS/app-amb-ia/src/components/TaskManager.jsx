import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid"; // npm install uuid si no el tens

function TaskManager({ user }) {
  const [tasques, setTasques] = useState([]);
  const [novaTasca, setNovaTasca] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasques"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dades = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasques(dades);
    });

    return () => unsubscribe();
  }, [user]);

  const afegirTasca = async () => {
    if (!novaTasca.trim()) return;

    const nova = {
      text: novaTasca,
      completada: false,
      uid: user.uid,
    };

    setNovaTasca("");

    try {
      await addDoc(collection(db, "tasques"), nova);
    } catch (error) {
      console.error("Error afegint tasca:", error);
    }
  };

  const esborrarTasca = async (id) => {
    try {
      await deleteDoc(doc(db, "tasques", id));
    } catch (error) {
      console.error("Error esborrant tasca:", error);
    }
  };

  const marcarCompletada = async (id, estatActual) => {
    try {
      await updateDoc(doc(db, "tasques", id), {
        completada: !estatActual,
      });
    } catch (error) {
      console.error("Error marcant completada:", error);
    }
  };

  const editarTasca = async (id, nouText) => {
    try {
      await updateDoc(doc(db, "tasques", id), {
        text: nouText,
      });
    } catch (error) {
      console.error("Error editant tasca:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Gestor de Tasques</h2>

      <input
        value={novaTasca}
        onChange={(e) => setNovaTasca(e.target.value)}
        placeholder="Nova tasca..."
        style={{ padding: 8, marginRight: 10 }}
      />
      <button onClick={afegirTasca}>Afegir</button>

      <ul style={{ marginTop: 20 }}>
        {tasques.map((tasca) => (
          <li key={tasca.id} style={{ marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={tasca.completada}
              onChange={() => marcarCompletada(tasca.id, tasca.completada)}
            />
            <input
              type="text"
              value={tasca.text}
              onChange={(e) => editarTasca(tasca.id, e.target.value)}
              style={{
                marginLeft: 10,
                padding: 4,
                textDecoration: tasca.completada ? "line-through" : "none",
              }}
            />
            <button
              onClick={() => esborrarTasca(tasca.id)}
              style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}
            >
              Esborrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
