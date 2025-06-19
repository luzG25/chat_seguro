import React, { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import type { Message, Contact, UserSession } from "./models/types";
import { login, register, resumeSession } from "./services/authService";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ContactsList from "./components/ContactsList";
import Chat from "./components/Chat";
import "./styles.css";

const WS_URL = "ws://localhost:5099"; // Altere para o endereço do seu servidor

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [error, setError] = useState("");

  // Dentro do handleIncomingMessage no App.tsx
  const handleIncomingMessage = useCallback((message: Message) => {
    console.log("Message received:", message);

    // Tratar respostas de login/registro
    if (message.emissor === "LoginService") {
      if (
        message.tipo === "Login" ||
        message.tipo === "Incricao" ||
        message.tipo === "RetomarSessao"
      ) {
        if (message.token && !message.token.startsWith("00ERROR")) {
          // Login/registro bem-sucedido
          const userSession = {
            email: message.destino, // O serviço envia a resposta para o email do usuário
            nome: message.aux1 || "",
            token: message.token,
            deviceToken: message.token,
          };
          setCurrentUser(userSession);
          setError("");
          localStorage.setItem("userSession", JSON.stringify(userSession));

          // Carregar contatos após login
          sendMessage({
            tipo: "GET",
            emissor: message.destino, // email do usuário
            destino: "ROOT",
            msg: "GETCONTACTS",
            token: message.token,
          });
        } else {
          setError(message.token || "Erro desconhecido");
        }
      }
    }
    // Tratar resposta de GETCONTACTS
    else if (message.tipo === "GETCONTACTS") {
      // O servidor envia os contatos no campo msg, separados por ;
      const contactsData = message.msg
        .split(";")
        .filter((item) => item.trim() !== "")
        .map((item) => {
          const [email, nome, curso] = item.split(":");
          return { email, nome, curso };
        });
      setContacts(contactsData);
    }
    // Tratar mensagens de chat
    else if (message.tipo === "msg") {
      setMessages((prev) => [...prev, message]);
    }
  }, []);

  const { sendMessage } = useWebSocket(WS_URL, handleIncomingMessage);

  useEffect(() => {
    // Tentar retomar sessão ao carregar
    const savedSession = localStorage.getItem("userSession");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      sendMessage(resumeSession(session.email, session.deviceToken));
    }
  }, [sendMessage]);

  // No início do componente App
  useEffect(() => {
    // Verificar se há sessão salva ao carregar
    const savedSession = localStorage.getItem("userSession");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setCurrentUser(session);
      // Solicitar contatos
      sendMessage({
        tipo: "GET",
        emissor: session.email,
        destino: "ROOT",
        msg: "GETCONTACTS",
        token: session.token,
      });
    }
  }, [sendMessage]);

  const handleSendMessage = (messageText: string, destination: string) => {
    if (!currentUser) return;

    const message: Message = {
      tipo: "msg",
      emissor: currentUser.email,
      destino: destination,
      msg: messageText,
      token: currentUser.token,
    };

    sendMessage(message);
    // Adiciona a mensagem localmente imediatamente para feedback rápido
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        data: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleLogin = (loginMessage: Message) => {
    sendMessage(loginMessage);
  };

  const handleRegister = (registerMessage: Message) => {
    sendMessage(registerMessage);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMessages([]);
    setContacts([]);
    setSelectedContact(null);
    localStorage.removeItem("userSession");
  };

  if (!currentUser) {
    return (
      <div className="app auth-page">
        {isRegistering ? (
          <RegisterForm
            onRegister={handleRegister}
            onLoginClick={() => setIsRegistering(false)}
          />
        ) : (
          <LoginForm
            onLogin={handleLogin}
            onRegisterClick={() => setIsRegistering(true)}
          />
        )}
        {error && <div className="global-error">{error}</div>}
      </div>
    );
  }

  return (
    <div className="app chat-app">
      <header className="app-header">
        <h2>Chat UTA - {currentUser.nome}</h2>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </header>

      <div className="main-content">
        <ContactsList
          contacts={contacts}
          currentUser={currentUser.email}
          onContactSelect={setSelectedContact}
          selectedContact={selectedContact}
        />

        <Chat
          messages={messages.filter(
            (msg) =>
              (msg.emissor === selectedContact?.email &&
                msg.destino === currentUser.email) ||
              (msg.emissor === currentUser.email &&
                msg.destino === selectedContact?.email)
          )}
          currentUser={currentUser.email}
          selectedContact={selectedContact}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default App;
