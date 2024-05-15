import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns'; // Thêm hàm differenceInSeconds
import vi from 'date-fns/locale/vi';
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
      const now = new Date();
      const difference = differenceInSeconds(now, new Date(timestamp.toDate())); // Tính sự khác biệt trong giây
      if (difference < 60) {
        return `${difference} giây trước`; // Trả về giá trị trong giây nếu nhỏ hơn 1 phút
      } else {
        const timeAgo = formatDistanceToNow(new Date(timestamp.toDate()), { locale: vi, addSuffix: true });
        return timeAgo;
      }
    } else {
      console.error('Thời gian không hợp lệ:', timestamp);
      return 'Thời gian không hợp lệ';
    }
  };

  const handleSelected = (chat) => {
    if (chat && chat.user) {
      changeChat(chat.chatId, chat.user);
    } else {
      console.error('User data is not available for chat', chat);
    }
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
                <p>{chat.lastMessage} - {calculateTimeAgo(chat.createdAt)}</p>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
