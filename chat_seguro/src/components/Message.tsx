import React from "react";
import type { Message as MessageType } from "../models/types";

interface MessageProps {
  message: MessageType;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`message ${isCurrentUser ? "current-user" : "other-user"}`}>
      <div className="message-header">
        <span className="sender">{message.emissor}</span>
        <span className="time">{message.data}</span>
      </div>
      <div className="message-content">{message.msg}</div>
    </div>
  );
};

export default Message;
