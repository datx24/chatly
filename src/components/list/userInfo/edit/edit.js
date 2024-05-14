import React, { useState } from 'react';
import MyComponent from '../../../thongTinNhom-TrangCaNhan/MyInfor';
import './edit.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebaseConfig';

const Edit = () => {
  const [state, setState] = useState({
    showProfile: false,
    profile: '',
    group: '',
    settings: '',
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  const handleProfileClick = () => {
    setState({...state, showProfile: true, profile: 'Action in progress...' });
  };

  const handleGroupClick = () => {
    setState({...state, group: 'Action in progress...' });
  };

  const handleSettingsClick = () => {
    setState({...state, settings: 'Action in progress...' });
  };

  return (
    <div className="edit-container">
      <div>
        <button name="profile" onClick={handleProfileClick}>
          Chỉnh sửa profile
        </button>
      </div>
      <div>
        <button name="group" onClick={handleGroupClick}>
          Tạo nhóm mới
        </button>
      </div>
      <div>
        <button name="settings" onClick={handleSettingsClick}>
          Cài đặt
        </button>
      </div>
      <div>
        <button name="logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
      {state.showProfile && <MyComponent />}
    </div>
  );
};

export default Edit;