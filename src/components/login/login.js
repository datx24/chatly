import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, db, storage } from '../lib/firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import upload from '../lib/upload';
import './login.css'

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
        phoneNumber:'',
        gender:'',
        birthDate: '',
        // Add other user data as needed
      });

      setValue(user.email);
      localStorage.setItem('email', user.email);
      setUser({...user, 
        displayName: user.displayName, 
        photoURL: user.photoURL,
        phoneNumber: [],
        birthDate: '',
        gender: '', });
      onSignIn(); // Notify the parent component that the user has signed in
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
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
        phoneNumber:'',
        gender:'',
        birthDate: '',
        // Add other user data as needed
      });
  
      setValue(user.email);
      localStorage.setItem('email', user.email);
      setUser({...user, 
        displayName: user.displayName, 
        photoURL: user.photoURL,
        phoneNumber: [],
        birthDate: '',
        gender: '', });
      onSignIn(); // Notify the parent component that the user has signed in
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
    }
  };
  

  return (
      <div className="login">
        {/* Phần HTML của trang đăng nhập */}
        <header className="header-login"> {/* Thay class thành className */}
          <div className='header-child'>
            <div className="logo-chatly1">
              <img className='chatly-img' src='https://scontent.xx.fbcdn.net/v/t1.15752-9/434521997_782614083797588_95458143183886990_n.png?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=7GVLAUVzX3oAb5cIfSB&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QG5IJ1T2HDHjU9u0vfwx6iiFVhYr4NArR-vZQWTDXvWtw&oe=66470187'></img>
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
                        src="https://scontent.xx.fbcdn.net/v/t1.15752-9/434680190_770513525176301_2489116477838300447_n.png?stp=cp0_dst-png&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=yXAY1uVEGhcAb59VdtA&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFkE0rv4dISg97AubWAEbrdKEVXWv9niXYae4Dp8-WGpA&oe=66470E31"
                        alt="Google Icon"
                      />
                      Đăng nhập với Google
                    </button>
                    <button onClick={(event) => signInWithFacebook(event)} className="btn-ff">
                      <img
                        src="https://scontent.xx.fbcdn.net/v/t1.15752-9/434559141_966125155051284_8896615487383647192_n.png?stp=cp0_dst-png&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C3uy7N5k_HkAb5t1s7H&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFB7Wp4Waem9aBkRNYXRG3qaHEy1uRhcNHWtEcxFptz5w&oe=6646F269"
                        alt="Facebook Icon"
                      />
                      Đăng nhập với Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <img className='img-chatly2' src='https://scontent.xx.fbcdn.net/v/t1.15752-9/433887940_1025545702040985_4100082015906866057_n.png?stp=dst-png_s206x206&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=DTS1fgHV5yYAb5Hc1hY&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QF7Qd_ZRZh-j9RprkU3-t07OVHi_bPSB3JVVPJkglVyuA&oe=6646ECE5'></img>
        </main>
      </div>
    );
  };
  
  export default Login;