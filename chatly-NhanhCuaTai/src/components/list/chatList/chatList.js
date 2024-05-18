import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import './chatList.css';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { currentUser, isLoading } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (isLoading) return; // wait for user data to be available

    if (!currentUser?.id) {
      console.error('Current user ID is undefined');
      return;
    }

    const unSub = onSnapshot(doc(db, 'usersChat', currentUser.id), async (res) => {
      const items = res.data().chats;

      console.log('Received chat data:', items);

      const promises = items.map(async (item) => {
        let receiverId;
        if (item.receiverId === currentUser.id) {
          receiverId = item.chatId.split('_')[0]; // assuming the chatId is in the format "userId_chatId"
        } else {
          receiverId = item.receiverId;
        }

        const userDocRef = doc(db, 'users', receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        // Ensure that user data is available before storing it in the chats state
        if (user) {
          return { ...item, user };
        } else {
          console.error('User data not available for chat', item);
          return null;
        }
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    };
  }, [currentUser?.id, isLoading]);

  const handleSelected = async (chat) => {
    if (chat && chat.user) {
      changeChat(chat.chatId, chat.user);
    } else {
      console.error('User data not available for chat', chat);
    }
  };

  return (
    <div className="chatList">
      {chats.map((chat) => (
        <div className="body2-child-1" key={chat.user.uid} onClick={() => handleSelected(chat)}>
          <div className="body2-child-1-left1">
            <div className="logo-body2">
              <img src={chat.user.photoURL} alt="User" />
            </div>
          </div>
          <div className="body2-child-1-left2">
            <span>{chat.user.displayName}</span>
            <br />
            <p>{chat.lastMessage}</p>
          </div>
          <div className="body2-child-1-left3">
            <br />
            <br />
            <br />
            <span>7:12</span>
          </div>
        </div>
      ))}
      <div></div>
    </div>
  );
};

export default ChatList;