// ChatMessage.js
import React from 'react';

const ChatMessage = ({ message, currentTime }) => {
  return (
    <div className="chat-message">
      <div className="message-header">
        <span className="sender">{message.sender}</span>
        <span className="timestamp">
          {new Date(message.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

export default ChatMessage;