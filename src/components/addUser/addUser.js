import './addUser.css'
import { collection, query, where, serverTimestamp, doc, setDoc, updateDoc, arrayUnion, getDocs, QuerySnapshot } from "firebase/firestore";
import { db } from '../lib/firebaseConfig'
import { useState } from 'react'
import { useUserStore } from '../lib/userStore'

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [addedUsers, setAddedUsers] = useState([]); // new state to keep track of added users
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const displayName = formData.get("displayName");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("displayName", "==", displayName));
      const querySnapshot = await getDocs(q);

      const users = querySnapshot.docs.map((doc) => doc.data());
      if (users.length > 0) {
        const userId = users.id;
        if (!addedUsers.includes(userId)) { // check if user is already added
          setUser(users[0]);
        } else {
          alert("User is already added");
        }
      } else {
        setUser(null);
        alert("No user found with that display name");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    if (!user || !currentUser) {
      console.error("User or current user is not available");
      return;
    }
  
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "usersChat");
  
    try {
      const newChatRef = doc(chatRef); // Create a document reference with a unique ID
  
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
  
      if (user.id && currentUser.id) {
        // Ensure that the documents exist before updating
        await setDoc(doc(userChatsRef, user.id), { chats: [] });
        await setDoc(doc(userChatsRef, currentUser.id), { chats: [] });
  
        await updateDoc(doc(userChatsRef, user.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: currentUser.id,
            updatedAt: Date.now(),
          }),
        });
  
        await updateDoc(doc(userChatsRef, currentUser.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: user.id,
            updatedAt: Date.now(),
          }),
        });
  
        setAddedUsers([...addedUsers, user.id]); // add user to addedUsers state
      } else {
        console.error("User ID or Current User ID is undefined");
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="DisplayName" name="displayName" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.photoURL} />
            <span>{user.displayName}</span>
            <span>{user.email}</span>
          </div>
          <button onClick={handleAdd}>Add</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;