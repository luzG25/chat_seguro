import React, { useState, useEffect, useRef } from "react";
import type { Contact, Message as MessageType } from "../models/types";
import Message from "./Message";

interface ChatProps {
  messages: MessageType[];
  currentUser: string;
  selectedContact: Contact | null;
  onSendMessage: (message: string, destination: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  currentUser,
  selectedContact,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      onSendMessage(newMessage, selectedContact.email);
      setNewMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        {selectedContact ? (
          <>
            <h3>{selectedContact.nome}</h3>
            <div className="contact-info">{selectedContact.email}</div>
          </>
        ) : (
          <h3>Selecione um contato</h3>
        )}
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            isCurrentUser={message.emissor === currentUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {selectedContact && (
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
};

export default Chat;
