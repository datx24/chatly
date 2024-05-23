import React, { useState, useEffect } from 'react'
import List from './components/list/list'
import Chat from './components/chat/chat'
import Header from './components/header/header'
import Login from './components/login/login'
import './App.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './components/lib/firebaseConfig'
import { useUserStore } from './components/lib/userStore'
import { useChatStore } from './components/lib/chatStore'
import AddMemberGroup from './components/Tab/AddMemberGroup/AddMemberGroup'
import AddGroup from './components/Modals/AddGroup'
import GroupInfor from './components/thongTinNhom-TrangCaNhan/GroupInfor'
import getGroupMembers,{nameGroup,urlImg} from './components/lib/getGroupMembers'
import ChatList from './components/list/chatList/chatList'
import ChatRom from './components/ChatRoom/indexx'
import UserInfo from './components/list/userInfo/userInfo'
import { db } from "./components/lib/firebaseConfig";
import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import GroupInfo from './components/Modals/GroupInfo';
import { imageFile } from './components/Modals/DisplayImage';
import updateGroupImage from './components/lib/updateGroupImage'
const App = () => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state to display loading message
  const { currentUser, fetchUserInfo } = useUserStore();
  const {chatId} = useChatStore();
  const [user, setUser] = useState(null);
 
  const handleSignIn = () => {
    // Redirect to the main page or update the state of the app
    console.log('User signed in!');
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid)
        
      } else {
        // Clear user info when user logs out
        fetchUserInfo(null)
      }
      setIsLoading(false) // After checking, turn off isLoading
    })

    return () => {
      unSub()
    }
  }, [fetchUserInfo]);

  // hiển thị thành viên trong nhóm
 

  if (isLoading) return <div className='loading'>Loading...</div>

  // If user is not logged in, display login page
  if (!currentUser) {
    return (
      <div>
        <Header />
        <div className="container">
          <Login setUser={setUser} onSignIn={handleSignIn}  /> {/* Pass setUser function to Login to update user */}
        </div>
      </div>
    )
  }
// const GroupID = "2aD122QPnzoxu8ENbdJI";
// const imgUrl = "https://firebasestorage.googleapis.com/v0/b/login-e1c8b.appspot.com/o/images%2FNatureLove.png?alt=media&token=e2656057-c6be-498e-81db-ecb696db2f4c";
// updateGroupImage(GroupID,imgUrl);

  return (
    // <AppProvider>
    <div>
      <Header />
      {/* <div className="container"> */}
        {/* <List /> */}
        {/* <UserInfo/> */}
        {/* <ChatList/> */}
        {/* {chatId && <Chat />} */}
        {/* <ChatList/> */}
        {/* <AddGroup/> */}
        {/* <AddMemberGroup/> */}
        {/* <GroupInfor 
        member = {member}
        groupName = {nameGroup}
        ImgGroup = {urlImg}
       
        />  */}
        {/* <GroupInfor/> */}
         {/* <ChatRom/> */}
      {/* </div> */}
        {/* <GroupInfo/> */}
        <ChatRom/>
        
        {/* <GroupInfo/> */}
    </div>
   
  )
}

export default App;