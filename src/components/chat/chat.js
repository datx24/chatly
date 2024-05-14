import '../chat/chat.css';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import AddUser from '../addUser/addUser';
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useChatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';
import moment from 'moment';
import { serverTimestamp } from 'firebase/firestore';
import GroupInfo from '../Modals/GroupInfo';
import { getStorage, ref, uploadBytes,getDownloadURL } from 'firebase/storage';

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chat, setChat] = useState(null); // Initialize with null
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [addMode, setAddMode] = useState(false);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [images, setImages] = useState([]); // Add this state to store multiple images
  const [latestTextMessage, setLatestTextMessage] = useState(null); // State để lưu trữ tin nhắn văn bản mới nhất
  const storage = getStorage();
  

  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(
        doc(db, "chats", chatId),
        (res) => {
          setChat(res.data());
        }
      );
      return () => {
        unSub();
      };
    }
  }, [chatId]); // Only run the effect when chatId changes

  

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

  const handleImg = async (e) => {
    try {
      if (e.target.files[0]) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${e.target.files[0].name}`);
        await uploadBytes(storageRef, e.target.files[0]);
        const imgUrl = await getDownloadURL(storageRef);
  
        // Update the images state with the new image
        setImages((prevImages) => [
          ...prevImages,
          { file: e.target.files[0], url: imgUrl }
        ]);
  
        // Add the image URL to Firestore immediately
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            img: imgUrl,
            createdAt: serverTimestamp(),
          }),
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  
  
  const handleSend = async () => {
    try {
      // Check if there is any text or images to send
      if (!text.trim() && images.length === 0) return;

      // Array to store URLs of uploaded images
      const imageUrls = [];

      // Upload images to storage and get their URLs
      for (const image of images) {
        const imgUrl = await upload(image.file);
        imageUrls.push(imgUrl);
      }

      // Array to store new messages (both text and image messages)
      const newMessages = [];
      
      // Add text message if available
      if (text.trim()) {
        newMessages.push({
          senderId: currentUser.id,
          text,
          createdAt: Timestamp.now(),
        });
      }

      // Add image messages if available
      for (const imgUrl of imageUrls) {
        newMessages.push({
          senderId: currentUser.id,
          img: imgUrl,
          createdAt: Timestamp.now(),
        });
      }

      // Update Firestore with the new messages
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(...newMessages),
      });

      // Update the chat state with the new messages
      // Update the chat state with the new messages only if they don't already exist
      setLatestTextMessage(newMessages.find((message) => message.text)); // Set the latest text message

      // Clear input fields and image state
      setText("");
      setImages([]);

      // Update userChats in Firestore
      const userChatsRef = doc(db, "usersChat", currentUser.id);
      const userChatsSnapShot = await getDoc(userChatsRef);

      if (userChatsSnapShot.exists()) {
        const userChatsData = userChatsSnapShot.data();
        const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

        if (chatIndex !== -1) {
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = currentUser.id === user.id;
          userChatsData.chats[chatIndex].createdAt = Timestamp.now(); // Set timestamp here

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  
   // Hàm lọc tin nhắn chỉ hiển thị tin nhắn văn bản
  const filterTextMessages = (messages) => {
    return messages.filter((message) => {
      return message.text && !message.img; // Chỉ lọc ra những tin nhắn có văn bản và không có ảnh
    });
  };

  



  
  const handleHideGroupInfo = () => {
    setShowGroupInfo(false);
  };

  const handleShowGroupInfo = () => {
    setShowGroupInfo(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const filterMessages = (searchQuery) => {
    return chat?.messages?.filter((message) => {
      return message.text.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const updateSearchResults = (searchQuery) => {
    const results = filterMessages(searchQuery);
    setSearchResults(results);
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    updateSearchResults(searchQuery);
  };

  return (
    <div className='chat'>
      <div className='body-child-right'>
        <div className="body-child-right-1">
          <div className='body-child-right-1-left'>
            <img src={user?.photoURL} />
          </div>
          <div className='body-child-right-1-nearleft'>
            <span>{user?.displayName}</span>
            {/* <p>4 người</p> */}
          </div>
          <div className='body-child-right-1-nearright'>
            <div className='input-wrapper'>
              <input placeholder='Tìm tin nhắn' />
              <img value={searchQuery}
              onChange={handleSearch} src='https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/434533985_713553907379990_3944476913737347889_n.png?stp=cp0_dst-png&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fmPNSwUVY7gAb5Gh2BW&_nc_ht=scontent.fsgn5-12.fna&oh=03_Q7cD1QFGPPKTEWBpyAaSAS5ZEJrxds8jp_DL_dDLoYy4SVGZQg&oe=66480AC1'>     
              </img>
            </div>
            {searchQuery && (
              <div>
                {filterMessages(searchQuery).map((message) => (
                  <div key={message.id}>{message.text}</div>
                ))}
              </div>
            )}
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
                onClick={handleShowGroupInfo} />
              {showGroupInfo? (
                <GroupInfo onHide={handleHideGroupInfo} onShow={handleShowGroupInfo} />
              ) : null}
            </div>
          </div>
        </div>
        <div className="body-child-right-2">
          {/* Display the latest text message */}
          {latestTextMessage && (
            <div className={latestTextMessage.senderId === currentUser.id ? 'Message own' : 'Message'}>
              <div className='texts'>
                <p>{latestTextMessage.text}</p>
                {/* Display the timestamp */}
                {latestTextMessage.createdAt && latestTextMessage.createdAt instanceof Timestamp ? (
                  <span>{moment(latestTextMessage.createdAt.toDate()).format('HH:mm, DD/MM/YYYY')}</span>
                ) : (
                  <span>No timestamp available</span>
                )}
              </div>
            </div>
          )}

{chat?.messages?.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()).map((message, index) => (
  <div className={message.senderId === currentUser.id ? 'Message own' : 'Message'} key={index}>
    {/* Display the avatar for both sender and receiver */}
    {message.senderId && (
      <img src={message.senderId === currentUser.id ? currentUser.photoURL : user.photoURL} alt="Avatar" />
    )}
    <div className='texts'>
      {/* Display the text message if present */}
      {message.text && !message.img && <p>{message.text}</p>}
      {/* Display the image if present */}
      {message.img && !message.text && (
        <img src={message.img} alt={`image-${index}`} />
      )}
      {/* Display both text and image if present */}
      {message.text && message.img && (
        <div>
          {/* Check if the previous message is not an image from the same sender */}
          {index === 0 || (index > 0 && chat.messages[index - 1].senderId !== currentUser.id && !chat.messages[index - 1].img) ? (
            <p>{message.text}</p>
          ) : null}
          <img src={message.img} alt={`image-${index}`} />
        </div>
      )}
      {/* Display the timestamp */}
      {message.createdAt && message.createdAt instanceof Timestamp ? (
        <span>{moment(message.createdAt.toDate()).format('HH:mm, DD/MM/YYYY')}</span>
      ) : (
        <span>No timestamp available</span>
      )}
    </div>
  </div>
))}


        </div>
        <div className="body-child-right-3">
          <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435023372_943176447352859_3404519681467152429_n.png?stp=cp0_dst-png&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ax7tvHP5cuoAb7gRu8_&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QGT22E-u_KyTYdny-KKElR-gUBf0GUOi2bvAKWoG2UVuQ&oe=6649A9B7' />
          <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/434670771_370909709272930_4174549600339023260_n.png?stp=cp0_dst-png&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=mO-iliPj2JUAb5oypl-&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QE1p1HOuZHeGaHOZF-qYBhGXzkGQyfPDOYMaYj20CEfKw&oe=664986E8' />
          {/* // Thêm sự kiện click vào label để kích hoạt input file */}
          <label className='button_upImg' htmlFor='file' onClick={(e) => e.stopPropagation()}>
            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/434576904_898310072068559_3609240181467083327_n.png?stp=cp0_dst-png&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=7O6_pmCzJe0Ab7sDYy1&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QF-YJHslMvL-5mQKSg4n8PF-gl6uV6aJ5I1dtknEw9_FQ&oe=66499CDE' />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
        </div>
        <div className="body-child-right-4">
          <div className='input-wrapper'>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          {/* Hiển thị hình ảnh đã chọn trước khi gửi */}
          {images.length > 0 && (
            <div className="selected-images">
              {images.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image.file)} alt={`selected-image-${index}`} />
              ))}
            </div>
          )}
            <input onKeyPress={handleKeyPress} placeholder='Aa' onChange={(e) => setText(e.target.value)} value={text} />
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