import React, { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import type { Message, Contact, UserSession } from "./models/types";
import { login, register, resumeSession } from "./services/authService";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ContactsList from "./components/ContactsList";
import Chat from "./components/Chat";
import "./styles.css";
import { DiffieHelman, guardarParams } from "./services/diffieHelmanService";

const WS_URL = "ws://localhost:5099"; // Altere para o endereço do seu servidor

const dh = new DiffieHelman();

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [error, setError] = useState("");
  const [rspDH, setRspDH] = useState<string | null>(null);

  useEffect(() => {
    if (rspDH) {
      handleSendMessage("RECMYDHKEY", rspDH, "" + dh.obterChavePublica());
    }

    setRspDH(null);
  }, [rspDH]);

  //fazer DH com novo contacto
  useEffect(() => {
    const contact = selectedContact;
    if (!contact) return;
    if (!contact.chave) {
      //pedir chave publica do contacto e enviar o meu
      handleSendMessage(
        "GETYOURDHKEY",
        contact.email,
        "" + dh.obterChavePublica()
      );
    }
  }, [selectedContact]);

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

    //TRATAR DH PARAMS
    else if (message.tipo === "GETDHPARAMS" && message.emissor === "ROOT") {
      guardarParams(Number(message.aux1), Number(message.aux2));
    }
    // Tratar mensagens de chat
    else if (message.tipo === "msg") {
      const savedSession = localStorage.getItem("userSession");
      if (!savedSession) return;
      const session = JSON.parse(savedSession);
      if (
        message.msg === "GETYOURDHKEY" &&
        message.aux1 &&
        message.emissor !== session.email
      ) {
        //gerar chave privada com contacto
        const key2 = message.aux1;
        const chavePrivada = dh.gerarChaveSecreta(Number(key2));
        if (chavePrivada) {
          alert(
            `os params sao ${JSON.stringify(
              dh.obterParams()
            )} Chave privada entre eu (minha Priv: ${dh.obterMinhaChavePrivada()}) e ${
              message.emissor
            } (sua pub: ${key2}): ${chavePrivada}`
          );
          //guardar chave
          setContacts((prev) =>
            prev.map((c) =>
              c.email === message.emissor
                ? { ...c, chave: "" + chavePrivada }
                : c
            )
          );

          //enviar minha chave
          setRspDH(message.emissor);
        } else alert("Erro em criar chave");
      } else if (
        message.msg === "RECMYDHKEY" &&
        message.aux1 &&
        message.emissor !== session.email
      ) {
        //gerar chave privada com contacto
        const key2 = message.aux1;
        const chavePrivada = dh.gerarChaveSecreta(Number(key2));
        if (chavePrivada) {
          //guardar chave
          setContacts((prev) =>
            prev.map((c) =>
              c.email === message.emissor
                ? { ...c, chave: "" + chavePrivada }
                : c
            )
          );
          alert(
            `Chave privada entre eu (minha Priv: ${dh.obterMinhaChavePrivada()}) e ${
              message.emissor
            } (sua pub: ${key2}): ${chavePrivada}`
          );
        } else alert("Erro em criar chave");
      } else setMessages((prev) => [...prev, message]);
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

      //Solicitar DH params
      sendMessage({
        tipo: "GETDHPARAMS",
        emissor: session.email,
        destino: "ROOT",
        msg: "Mandam kes DH Params",
        token: session.token,
      });
    }
  }, [sendMessage]);

  const handleSendMessage = (
    messageText: string,
    destination: string,
    aux1?: string
  ) => {
    if (!currentUser) return;

    const message: Message = {
      tipo: "msg",
      emissor: currentUser.email,
      destino: destination,
      msg: messageText,
      token: currentUser.token,
      aux1,
    };

    sendMessage(message);
    // Adiciona a mensagem localmente imediatamente para feedback rápido
    /*setMessages((prev) => [
      ...prev,
      {
        ...message,
        data: new Date().toLocaleTimeString(),
      },
    ]);*/
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
