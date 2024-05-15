import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import vi from 'date-fns/locale/vi';
import '../chatList/chatList.css';

const ChatList = ({ filterUsers }) => {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const { currentUser, isLoading } = useUserStore();
  const { changeChat } = useChatStore();
  const backdropRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPageVisible, setIsPageVisible] = useState(true);

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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsPageVisible(true);
      } else {
        setIsPageVisible(false);
        if (currentUser) {
          updateLastActive(currentUser.id, false); // Cập nhật trạng thái offline
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unSub();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, isLoading]);

  const calculateTimeAgo = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      const now = new Date();
      const difference = differenceInSeconds(now, new Date(timestamp.toDate())); 
      if (difference < 60) {
        return `${difference} giây trước`;
      } else {
        const timeAgo = formatDistanceToNow(new Date(timestamp.toDate()), { locale: vi, addSuffix: true });
        return timeAgo;
      }
    } else {
      console.error('Thời gian không hợp lệ:', timestamp);
      return 'Thời gian không hợp lệ';
    }
  };

  const handleAvatarClick = async (chat) => {
    if (chat && chat.user) {
      setSelectedUser(chat.user);
      changeChat(chat.chatId, chat.user);
      setIsBackdropVisible(true);
      await updateLastActive(chat.user.id); // Sử dụng await để đợi hàm updateLastActive hoàn thành
    } else {
      console.error('User data is not available for chat', chat);
    }
  };
  

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = chats.filter(chat =>
    chat.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateLastActive = async (userId, isActive = true) => {
    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, {
        lastActive: serverTimestamp(),
        isActive: isActive
      });
      console.log(`Đã cập nhật lastActive và trạng thái hoạt động cho người dùng ${userId}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật lastActive và trạng thái hoạt động:', error);
    }
  };

  

  return (
    <div className='chatList'>
      <input
        type="text"
        placeholder="Tìm kiếm tên, nhóm..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      {filteredUsers.map((chat) => (
        <div key={chat.chatId}>
          {chat.user ? (
            <div className='body2-child-1' onClick={() => handleAvatarClick(chat)}>
              <div className='body2-child-1-left1'>
                <div className='logo-body2'>
                  <img src={chat.user.photoURL} alt="User Avatar" />
                  <div className={`dot ${chat.user.isActive && isPageVisible ? 'red' : 'green'}`}></div>
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
      {/* {isBackdropVisible && selectedUser && (
        <div className="moon-backdrop" ref={backdropRef}>
          <div className="moon-content">
            <button>Kết bạn</button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ChatList;