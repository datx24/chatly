import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebaseConfig'; // Giả định bạn đang sử dụng Firebase
import { doc, onSnapshot, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useUserStore } from '../lib/userStore';
import ChatMessage from './ChatMessage';

const ChatRoom = ({ groupId }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { currentUser } = useUserStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    // Lắng nghe các thay đổi trong Firestore
    const messagesRef = doc(db, 'messages', groupId);
    const unsubscribe = onSnapshot(messagesRef, (doc) => {
      const data = doc.data();
      setMessages(data?.messages || []);
    });

    // Lấy thành viên của nhóm
    fetchGroupMembers();
    // Cập nhật thời gian hiện tại hàng giây
    const interval = setInterval(() => {
    setCurrentTime(new Date());
    }, 1000);
    // Dọn dẹp event listener khi component bị unmount
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [groupId]);

  const fetchGroupMembers = async () => {
    try {
      const groupRef = doc(db, 'Groups', groupId);
      const doc = await getDoc(groupRef);
      if (doc.exists()) {
        setGroupMembers(doc.data().members);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thành viên của nhóm:', error);
    }
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const messageRef = doc(db, 'messages', groupId);
        await updateDoc(messageRef, {
          messages: arrayUnion({
            content: newMessage,
            sender: currentUser.displayName, // Thay thế bằng tên người gửi thực tế
            timestamp: new Date().toISOString(),
          }),
        });
        setNewMessage('');
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
      }
    }
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((message, index) => (
          <ChatMessage
          key={index}
          message={message}
          currentTime={currentTime}
    />
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Nhập tin nhắn của bạn..."
          value={newMessage}
          onChange={handleMessageChange}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatRoom;