import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../lib/firebaseConfig';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { formatDistanceToNow } from 'date-fns';
import '../chatList/chatList.css'
import moment from 'moment';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { currentUser, isLoading } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (isLoading || !currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "usersChat", currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        let receiverId = item.receiverId === currentUser.id ? item.chatId.split('_')[0] : item.receiverId;
        const userDocRef = doc(db, "users", receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();

        if (user) {
          return { ...item, user };
        } else {
          console.error('Dữ liệu người dùng không khả dụng cho cuộc trò chuyện', item);
          return null;
        }
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    }
  }, [currentUser.id, isLoading]);

  const calculateTimeAgo = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      const now = new Date();
      const timeAgo = formatDistanceToNow(timestamp.toDate(), { addSuffix: true });

      return timeAgo;
    } else {
      console.error('Thời gian không hợp lệ:', timestamp);
      return 'Thời gian không hợp lệ';
    }
  };

  const handleSelected = async (chat) => {
    if (chat && chat.user) {
      changeChat(chat.chatId, chat.user);
    } else {
      console.error('Dữ liệu người dùng không khả dụng cho cuộc trò chuyện', chat);
    }
  };

  return (
    <div className='chatList'>
      {chats.map((chat) => (
        <div className='body2-child-1' key={chat.user.uid} onClick={() => handleSelected(chat)}>
          <div className='body2-child-1-left1'>
            <div className='logo-body2'>
              <img src={chat.user.photoURL} alt="Ảnh đại diện người dùng" />
            </div>
          </div>
          <div className='body2-child-1-left2'>
            <span>{chat.user.displayName}</span><br />
            <p>{chat.lastMessage} - {calculateTimeAgo(chat.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
