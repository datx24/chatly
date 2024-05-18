import '../userInfo/userInfo.css'
import { useState, useEffect } from 'react'
import upload from '../../lib/upload'
import { useUserStore } from '../../lib/userStore'
import { signOut, onAuthStateChanged,getAuth } from 'firebase/auth'
import { auth } from '../../lib/firebaseConfig'
import AddUser from '../../addUser/addUser'
import Edit from '../userInfo/edit/edit'


const UserInfo = () => {
  const [userDisplayName, setUserDisplayName] = useState('')
  const [userImgUrl, setUserImgUrl] = useState('')
  const { currentUser } = useUserStore();
  const [addUserMode, setAddUserMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false); // new state


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDisplayName(user.displayName || '');
        const auth = getAuth();
        const photoURL = auth.currentUser.photoURL;
        setUserImgUrl(photoURL || '');
        console.log(userImgUrl);
      } else {
        setUserDisplayName('');
        setUserImgUrl('');
      }
    });
    return () => {
      unsubscribe();
    }
  }, [auth]);
  

  const handleImageUpload = async (file) => {
    try {
      const url = await upload(file)
      setUserImgUrl(url)
      localStorage.setItem('userImageUrl', url)
    } catch (error) {
      console.error('Error uploading image:', error)
      // Handle error properly, e.g. display an error message to the user
    }
  }

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.clear()
      window.location.reload()
    } catch (error) {
      console.error('Error logging out:', error)
      // Handle error properly, e.g. display an error message to the user
    }
  }

  const handleAddUserClick = () => {
    setAddUserMode(!addUserMode)
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className='userInfo'>
      <div className='user-information'>
        <div className="user-information-1">
          <button onClick={handleLogout}>Đăng Xuất</button>
          <div className='user-image'>
            <label htmlFor="fileInput" className="custom-file-upload">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              {userImgUrl? (
                <img src={userImgUrl} alt="Uploaded" />
              ) : (
                <span>Add Image</span>
              )}
            </label>
            <div className='user-status'></div>
          </div>
          <div className="user-name">
            <span>{userDisplayName}</span>
            <div className="user-icon">
              <img
                className='icon-bell'
                src='https://scontent.xx.fbcdn.net/v/t1.15752-9/434660649_1527472634468950_1775548599709619413_n.png?stp=cp0_dst-png&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=6Grqe9_wciMAb7Fpr3y&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFbLpAD6NLC9MBOuXSEQcykKM0X19wutQGdmx7F06_wvg&oe=6648115B'
                alt="Bell Icon"
              />
              <span onClick={handleEditClick}>...</span>
              {isEditing && <Edit/>}
            </div>
          </div>
        </div>
        <div className='input-wrapper'>
          <img
            src='https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.15752-9/434533985_713553907379990_3944476913737347889_n.png?stp=cp0_dst-png&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fmPNSwUVY7gAb5Gh2BW&_nc_ht=scontent.fsgn5-12.fna&oh=03_Q7cD1QFGPPKTEWBpyAaSAS5ZEJrxds8jp_DL_dDLoYy4SVGZQg&oe=66480AC1'
            alt="Search Icon"
          />
          <input placeholder='Tìm kiếm tên, nhóm...' />
          <button onClick={handleAddUserClick}>Add User</button>
          {addUserMode && <AddUser />} 
        </div>
      </div>
    </div>
  )
}

export default UserInfo