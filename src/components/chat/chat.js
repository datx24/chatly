import '../chat/chat.css';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useState, useRef } from 'react';
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
  const [messages, setMessages] = useState([]);
  const [showMessageSearch, setShowMessageSearch] = useState(false); // State to control the display of message search
  const [currentIndex, setCurrentIndex] = useState(0); // State to keep track of the current search result index
  const messageRefs = useRef([]); // Create a ref array to store references to message elements
  // Thêm state mới để lưu vị trí của tin nhắn được tìm thấy
  const [foundMessageIndex, setFoundMessageIndex] = useState(-1);
  const [foundMessage, setFoundMessage] = useState(null);
  

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

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (snapshot) => {
      setMessages(snapshot.data()?.messages || []);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const filteredMessages = messages.filter(message =>
      message.text && message.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredMessages);
  }, [messages, searchQuery]);

  const handleSearch = (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  // Lọc tin nhắn ngay lập tức dựa trên query
  const filteredMessages = messages.filter(message =>
    message.text && message.text.toLowerCase().includes(query.toLowerCase())
  );
  setSearchResults(filteredMessages);
  setCurrentIndex(0);

  // Hiển thị tin nhắn đầu tiên tìm thấy nếu có
  if (filteredMessages.length > 0) {
    setFoundMessage(filteredMessages[0]);
  }
};

  

  const handleSearchClick = () => {
    setShowMessageSearch(true);
    setCurrentIndex(0);
  
    const foundMessage = searchResults.find(message =>
      message.text && message.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    if (foundMessage) {
      setFoundMessage(foundMessage);
      setCurrentIndex(searchResults.indexOf(foundMessage));
    }
  };
  
  

  useEffect(() => {
    // Reset showMessageSearch when search query changes
    setShowMessageSearch(false);
  }, [searchQuery]);

  // Function to handle moving to the next search result
  const handleNext = () => {
    if (currentIndex < searchResults.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextMessage = searchResults[currentIndex + 1];
      setFoundMessage(nextMessage);
    }
  };
  

  // Function to handle moving to the previous search result
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const previousMessage = searchResults[currentIndex - 1];
      setFoundMessage(previousMessage);
    }
  };
  
  useEffect(() => {
    if (showMessageSearch && foundMessage) {
      const foundIndex = messages.findIndex(message => message === foundMessage);
      if (foundIndex !== -1 && messageRefs.current[foundIndex]) {
        messageRefs.current[foundIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  
        // Add highlight class to the current message
        messageRefs.current[foundIndex].classList.add('highlight');
  
        // Remove highlight class after a delay
        setTimeout(() => {
          messageRefs.current[foundIndex].classList.remove('highlight');
        }, 2000);
      }
    }
  }, [foundMessage, showMessageSearch]);
  
  // Khi searchQuery thay đổi, cập nhật state của tin nhắn được tìm thấy và kiểm tra xem có cần hiển thị giao diện không
useEffect(() => {
  if (searchQuery.trim() === '') {
    // Nếu không có ký tự nào được nhập vào thanh tìm kiếm, ẩn giao diện tin nhắn tìm được
    setShowMessageSearch(false);
    setFoundMessage(null);
  } else if (searchResults.length > 0) {
    // Hiển thị kết quả tìm kiếm nếu có kết quả và có ký tự được nhập vào thanh tìm kiếm
    setShowMessageSearch(true);
    setFoundMessage(searchResults[0]); // Hiển thị tin nhắn đầu tiên trong kết quả tìm kiếm
  }
}, [searchQuery, searchResults]);

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
  <input placeholder='Tìm tin nhắn' onChange={handleSearch} value={searchQuery}/>
  <img onClick={handleSearchClick} src='https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/434533985_713553907379990_3944476913737347889_n.png?stp=cp0_dst-png&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fmPNSwUVY7gAb5Gh2BW&_nc_ht=scontent.fsgn5-12.fna&oh=03_Q7cD1QFGPPKTEWBpyAaSAS5ZEJrxds8jp_DL_dDLoYy4SVGZQg&oe=66480AC1' />
</div>
{/* // Trong giao diện, hiển thị tin nhắn được tìm thấy nếu showMessageSearch là true và foundMessage tồn tại */}
{showMessageSearch && foundMessage && (
  <div className='message-search-container'>
    <div className='message-search'>
      <div className='message-search left'>
        <span>{foundMessage.text}</span>
        <span>{moment(foundMessage.createdAt.toDate()).format('HH:mm, DD/MM/YYYY')}</span>
      </div>
      {/* Nút để điều hướng tới tin nhắn tiếp theo hoặc trước đó */}
      <div className='message-search right'>
        <i onClick={handleNext} className='bx bx-chevron-down'></i>
        <p>{currentIndex + 1}/{searchResults.length}</p>
        <i onClick={handlePrevious} className='bx bx-chevron-up'></i>
      </div>
    </div>
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
  <div
    className={message.senderId === currentUser.id ? 'Message own' : 'Message'}
    key={index}
    ref={(el) => (messageRefs.current[index] = el)} // Assign ref to each message element
  >
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