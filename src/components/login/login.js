import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, db, storage } from '../lib/firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import upload from '../lib/upload';
import './login.css';
import Chatly from '../../images/Group 4.png'
import Group29 from '../../images/Group 29 (1).png'
import GoogleIcon from '../../images/bxl-google.svg.png'
import EmailPass from '../../images/email_pass.png'

const Login = ({ setUser, onSignIn }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(localStorage.getItem('email'));
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Upload user's avatar image to Firebase Storage
      const storageRef = ref(storage, 'avatars/' + user.uid);
      const snapshot = await uploadBytes(storageRef, user.photoURL);
      const photoURL = await getDownloadURL(snapshot.ref);

      // Add user data to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        id: user.uid,
        blocked: [],
        phoneNumber: '',
        gender: '',
        birthDate: '',
        // Add other user data as needed
      });

      setValue(user.email);
      localStorage.setItem('email', user.email);
      setUser({ ...user, displayName: user.displayName, photoURL: user.photoURL, phoneNumber: [], birthDate: '', gender: '' });
      onSignIn(); // Notify the parent component that the user has signed in
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };


  return (
    <div className="login">
      {/* Phần HTML của trang đăng nhập */}
      <header className="header-login">
        {/* Thay class thành className */}
        <div className='header-child'>
          <div className="logo-chatly1">
            <img className='chatly-img' src={Chatly}></img>
          </div>
          <div className='header-child-right'>
            <li>Dịch vụ</li>
            <li>Liên hệ</li>
            <li>Về chúng tôi</li>
          </div>
        </div>
      </header>
      <main className='main-login'>
        <section className='main-login-child'>
          <div className='main-left-child'>
            <span>
              NHẮN TIN TRỰC TUYẾN <br />
              NHANH CHÓNG, <br />
              HIỆU QUẢ
            </span>
            <div className='main-left-child-2'>
              <div className="main-left-child-2">
                <div>
                  <button onClick={(event) => signInWithGoogle(event)} className="btn-gg">
                    <img
                      src={GoogleIcon}
                      alt="Google Icon"
                    />
                    Đăng nhập với Google
                  </button>
                  <button className="btn-ff">
                    <img
                      src={EmailPass}
                      alt="Email/password Icon"
                    />
                    Đăng nhập với Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <img className='img-chatly2' src={Group29}></img>
      </main>
    </div>
  );
};

export default Login;
