import React, { useEffect, useRef, useState } from "react";

const App: React.FC = () => {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Conectado ao WebSocket");
    };

    socket.onmessage = (event) => {
      setMensagens((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("Conexão encerrada");
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const enviarMensagem = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(mensagem);
      setMensagem("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Chat WebSocket
        </h2>

        <div className="flex mb-4">
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={enviarMensagem}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition"
          >
            Enviar
          </button>
        </div>

        <div className="overflow-y-auto max-h-80 border rounded-lg p-4 bg-gray-50">
          <h4 className="text-gray-600 font-semibold mb-2">Mensagens:</h4>
          <ul className="space-y-2">
            {mensagens.map((msg, index) => (
              <li
                key={index}
                className="bg-white p-2 rounded shadow text-gray-800"
              >
                {msg}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
