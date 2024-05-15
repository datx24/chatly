import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { formatDistanceToNow } from 'date-fns';
import '../chatList/chatList.css';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { currentUser, isLoading } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (isLoading || !currentUser?.id) return;

    const unSub = onSnapshot(doc(db, 'usersChat', currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const receiverId = item.receiverId === currentUser.id ? item.chatId.split('_')[0] : item.receiverId;
        const userDocRef = doc(db, 'users', receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();

        if (user) {
          return { ...item, user };
        } else {
          console.error('User data is not available for chat', item);
          return null;
        }
      });

      const chatData = await Promise.all(promises);

      // Filter out duplicate receiverIds
      const uniqueReceiverIds = new Set();
      const filteredChats = chatData.filter(chat => {
        if (uniqueReceiverIds.has(chat.user.id)) {
          return false;
        } else {
          uniqueReceiverIds.add(chat.user.id);
          return true;
        }
      });

      setChats(filteredChats);
    });

    return () => {
      unSub();
    };
  }, [currentUser.id, isLoading]);

  const calculateTimeAgo = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      const timeAgo = formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
      return timeAgo;
    } else {
      console.error('Invalid time:', timestamp);
      return 'Invalid time';
    }
  };

  const handleSelected = (chat) => {
    if (chat && chat.user) {
      changeChat(chat.chatId, chat.user);
    } else {
      console.error('User data is not available for chat', chat);
    }
  };

  const handleCloseChat = (chatId) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.filter((chat) => chat.chatId !== chatId);
      if (updatedChats.length === prevChats.length) {
        console.error('Chat not found:', chatId);
      }
      return updatedChats;
    });
  };

  return (
    <div className='chatList'>
      {chats.map((chat) => (
        <div key={chat.chatId}>
          {chat.user ? (
            <div className='body2-child-1' onClick={() => handleSelected(chat)}>
              <div className='body2-child-1-left1'>
                <div className='logo-body2'>
                  <img src={chat.user.photoURL} alt="User Avatar" />
                </div>
              </div>
              <div className='body2-child-1-left2'>
                <span>{chat.user.displayName}</span><br />
                <p>{chat.lastMessage} - {calculateTimeAgo(chat.updatedAt)}</p>
              </div>
              <button className="close-button" onClick={() => handleCloseChat(chat.chatId)}>X</button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
