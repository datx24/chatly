import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

const createGroup = async (nameGroup, file, members) => {
  try {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`folderName/${file.name}`);
    
    // Tải ảnh lên Firebase Storage
    const uploadTask = fileRef.put(file);
    const snapshot = await uploadTask;
    
    // Lấy URL tải xuống của ảnh
    const url = await snapshot.ref.getDownloadURL();
    
    // Lưu thông tin nhóm vào Firestore
    const groupRef = collection(db, "Groups");
    const newGroupDoc = await addDoc(groupRef, {
      nameGroup,
      urlImg: url, // Lưu link ảnh vào trường urlImg
      members
      // Thêm myId nếu cần
    });
    
    console.log("New group document ID:", newGroupDoc.id);
  } catch (error) {
    console.error("Error creating group:", error);
  }
};

export default createGroup;