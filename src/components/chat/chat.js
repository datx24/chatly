/* eslint-disable jsx-a11y/alt-text */
import '../chat/chat.css';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useState } from 'react';
import AddUser from '../addUser/addUser';
import { arrayUnion, doc, onSnapshot, updateDoc,getDoc,Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useChatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload'
import moment from 'moment';
import { serverTimestamp } from 'firebase/firestore';
import GroupInfo from '../Modals/GroupInfo';


const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [addMode, setAddMode] = useState(false);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const [listMember, setListMember] = useState([
    { nameMember: 'Member 1', imgMember: 'https://example.com/member1.jpg' },
    { nameMember: 'Member 2', imgMember: 'https://example.com/member2.jpg' },
    //...
  ]);
  const [img,setImg] = useState({
    file:null,
    url: "",
  })

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "chats", chatId),
      (res) => {
        setChat(res.data());
      }
    );
    return () => {
      unSub();
    };
  }, [chatId]);

  const toggleForm = () => {
    setAddMode(!addMode);
  };

  const imgStyles = {
    cursor: 'pointer'
  };

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if(e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      })
    }
  }

  const handleSend = async () => {
    if (text === " ") return;
  
    let imgUrl = null;

try {
  if (img.file) {
    imgUrl = await upload(img.file);
  }

  await updateDoc(doc(db, "chats", chatId), {
    messages: arrayUnion({
      senderId: currentUser.id,
      text,
      createdAt: Timestamp.now(),
     ...(imgUrl? { img: imgUrl } : {}),
    }),
  });

  // Update the chat state with the new message
  
  const userIDs = [currentUser.id, user.id];

  userIDs.forEach(async (id) => {
    const userChatsRef = doc(db, "usersChat", id);
    const userChatsSnapShot = await getDoc(userChatsRef);
  
    if (userChatsSnapShot.exists()) {
      const userChatsData = userChatsSnapShot.data();
      const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
  
      userChatsData.chats[chatIndex].lastMessage = text;
      userChatsData.chats[chatIndex].isSeen = id === currentUser.id? true : false;
      userChatsData.chats[chatIndex].createdAt = serverTimestamp();
  
      userChatsData.chats.map((chat) => ({
        ...chat,
         createdAt: chat.createdAt instanceof Timestamp? chat.createdAt : serverTimestamp(),
       }))
    }
  });

  // Re-render the chat interface after sending a new message
  // setChat({...chat, lastMessage: text });
} catch (err) {
  console.log(err);
}

setImg({
  file: null,
  url: "",
});

setText("");
  };

  

  const handleHideGroupInfo = () => {
    setShowGroupInfo(false);
  };

  const handleShowGroupInfo = () => {
    setShowGroupInfo(true);
  };

  return (
    <div className='chat'>
      <div className='body-child-right'>
        <div className="body-child-right-1">
          <div className='body-child-right-1-left'>
            <div></div>
          </div>
          <div className='body-child-right-1-nearleft'>
            <span>Nhóm 1 WidoSoft</span>
            <p>4 người</p>
          </div>
          <div className='body-child-right-1-nearright'>
            <div className='input-wrapper'>
              <input placeholder='Tìm tin nhắn' />
              <img src='https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/434533985_713553907379990_3944476913737347889_n.png?stp=cp0_dst-png&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fmPNSwUVY7gAb5Gh2BW&_nc_ht=scontent.fsgn5-12.fna&oh=03_Q7cD1QFGPPKTEWBpyAaSAS5ZEJrxds8jp_DL_dDLoYy4SVGZQg&oe=66480AC1'></img>
            </div>
          </div>
          <div className='body-child-right-1-right'>
            <div className='body-child-right-1-right-1'>
              <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435010966_1355459908470106_7966605552557510732_n.png?stp=cp0_dst-png&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=l9rES8sMrUoAb6XUBHD&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QGScK0m1FN1R57AcWdTb4-CKG9__zFqfrdq26XHne2jhg&oe=66496EDF'
                onClick={toggleForm}
                style={imgStyles}
              />
              {addMode && <AddUser />}
            </div>
            <div className='body-child-right-1-right-1'>
              <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435094136_796649892385209_7657773689440718791_n.png?stp=cp0_dst-png&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=dWbqxzEAxLwAb79obEC&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFYcy3aD6K-26Pku9A2tZGtKlxk88HuqrmdpN4-wMMfag&oe=664954B6' />
            </div>
            <div className='body-child-right-1-right-1'>
              <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435088666_7899570106754160_2558583056158969005_n.png?stp=cp0_dst-png&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=xs5UROEKopwAb4_cSkU&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QHJ0Uem7lNyO1xGzCXlkq3MoQPnhB7B5q4Fa6OWkG1ONw&oe=66497F39' 
               onClick={handleShowGroupInfo}/>
                {showGroupInfo? (
        <GroupInfo onHide={handleHideGroupInfo} onShow={handleShowGroupInfo} />
      ) : null}
        <div>
          </div>
            </div>
          </div>
        </div>
        <div className="body-child-right-2">
        {chat?.messages?.map((message, index) => (
          <div className='Message own' key={index}>
            {message.photoURL && <img src={message.photoURL} />}
            <div className='texts'>
              <p>{message.text}</p>
              {message.createdAt && message.createdAt instanceof Timestamp? (
                <span>{moment(message.createdAt.toDate()).format('HH:mm, DD/MM/YYYY')}</span>
              ) : (
                <span>No timestamp available</span>
              )}
            </div>
          </div>
        ))}
                    {img.url && (
          <div className="Message own" key="image">
            <div className="texts">
              <img src={img.url} />
            </div>
          </div>
        )}
        </div>
        <div className="body-child-right-3">
          <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435023372_943176447352859_3404519681467152429_n.png?stp=cp0_dst-png&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ax7tvHP5cuoAb7gRu8_&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QGT22E-u_KyTYdny-KKElR-gUBf0GUOi2bvAKWoG2UVuQ&oe=6649A9B7' />
          <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/434670771_370909709272930_4174549600339023260_n.png?stp=cp0_dst-png&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=mO-iliPj2JUAb5oypl-&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QE1p1HOuZHeGaHOZF-qYBhGXzkGQyfPDOYMaYj20CEfKw&oe=664986E8' />
          <label htmlFor='file'>
          <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/434576904_898310072068559_3609240181467083327_n.png?stp=cp0_dst-png&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=7O6_pmCzJe0Ab7sDYy1&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QF-YJHslMvL-5mQKSg4n8PF-gl6uV6aJ5I1dtknEw9_FQ&oe=66499CDE' />
          </label>
          <input type="file" id="file" style={{display:"none"}} onChange={handleImg}/>
        </div>
        <div className="body-child-right-4">
          <div className='input-wrapper'>
            <input placeholder='Aa' onChange={(e) => setText(e.target.value)} value={text} />
            <div className='emoji'>
              <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435276193_1825881391266667_2981408863763185812_n.png?stp=cp0_dst-png&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=lB9Cjo4WxooAb7Pv9oT&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QGqzBYud1XXiwAe8exZpvV35OCzOYNTi7nGVy-2zGi7hQ&oe=6649B246'
                onClick={() => setOpen((prev) =>!prev)}
              />
              <div className='picker'>
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
              </div>
            </div>
            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/434736265_343975395357750_471698361390917180_n.png?stp=cp0_dst-png&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=xeg5I6K4zL0Ab4jLnqJ&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QEBBj-YVhtvQJDhH8b2a4CZe6vyx943-DbWOCJkjL_FRw&oe=6649A749'
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;