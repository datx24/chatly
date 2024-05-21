import './addUser.css';
import { collection, query, where, serverTimestamp, doc, setDoc, updateDoc, arrayUnion, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useState } from 'react';
import { useUserStore } from '../lib/userStore';

const AddUser = ({ updateChats }) => {
  const [users, setUsers] = useState([]);
  const [addedUserIds, setAddedUserIds] = useState(new Set());
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const displayName = formData.get('displayName');

    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('displayName', '==', displayName));
      const querySnapshot = await getDocs(q);

      const foundUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(foundUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (user) => {
    if (!user || !currentUser) {
      console.error('User or current user is not available');
      return;
    }
  
    const chatRef = collection(db, 'chats');
    const userChatsRef = doc(db, 'usersChat', currentUser.id);
  
    try {
      const newChatRef = doc(chatRef); // Tạo một tham chiếu đến tài liệu mới với một ID duy nhất
  
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
  
      if (user.id && currentUser.id && !addedUserIds.has(user.id)) {
        const currentTimestamp = new Date(); // Thay đổi này
  
        // Thêm thông tin chat mới vào mảng bằng cách sử dụng một đối tượng mới
        await updateDoc(userChatsRef, {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: '',
            receiverId: user.id,
            updatedAt: currentTimestamp, // Thay đổi này
          }),
        });
  
        setAddedUserIds((prevIds) => new Set(prevIds).add(user.id));
  
        updateChats({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: user.id,
          updatedAt: currentTimestamp, // Thay đổi này
          user: user,
        });
      } else {
        console.error('User ID or Current User ID is undefined or user already added');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Nhập tên người dùng" name="displayName" />
        <button>Search</button>
      </form>
      {users.length > 0 && (
        <div className="users">
          {users.map((user) => (
            <div className="user" key={user.id}>
              <div className="detail">
                <img src={user.photoURL} alt="User Avatar" />
                <span>{user.displayName}</span>
                <span>{user.email}</span>
              </div>
              <button onClick={() => handleAdd(user)}>Thêm</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddUser;
