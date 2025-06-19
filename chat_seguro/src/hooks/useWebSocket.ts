import { useState, useEffect, useCallback } from "react";
import { decrypt, encrypt } from "../services/cryptoService";

export const useWebSocket = (
  url: string,
  onMessage: (message: any) => void
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      setSocket(null);
    };

    ws.onmessage = (event) => {
      try {
        // Tentar descriptografar a mensagem
        const decryptedMessage = decrypt(event.data);
        const message = JSON.parse(decryptedMessage);
        onMessage(message);
      } catch (error) {
        console.error("Error decrypting/parsing message:", error);
        // Se falhar, tentar tratar como mensagem não criptografada (apenas para desenvolvimento)
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (parseError) {
          console.error("Error parsing unencrypted message:", parseError);
        }
      }
    };

    return ws;
  }, [url, onMessage]);

  useEffect(() => {
    const ws = connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (message: any) => {
      if (socket && isConnected) {
        try {
          const messageString = JSON.stringify(message);
          const encryptedMessage = encrypt(messageString);
          socket.send(encryptedMessage);
        } catch (error) {
          console.error("Error encrypting/sending message:", error);
        }
      }
    },
    [socket, isConnected]
  );

  return { socket, isConnected, sendMessage };
};
