import React from "react";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserState } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

function Detail() {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
  } = useChatStore();
  const { currentUser } = useUserState();

  const handleBlock = async () => {
   if(!user) return;

   const userDocRef = doc(db, "users", currentUser.id)
   try {
    await updateDoc(userDocRef, {
      blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
    });
    changeBlock()
   } catch (error) {
    console.log(error)
   }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img className="icon" src="./arrowDown.png" alt="" />
          </div>

          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/21728570/pexels-photo-21728570/free-photo-of-brunette-woman-in-yellow-dress-jumping-in-garden.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                  alt=""
                />

                <span>photo_2024_2.png</span>
              </div>
              <img className="icon" src="./download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/21728570/pexels-photo-21728570/free-photo-of-brunette-woman-in-yellow-dress-jumping-in-garden.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                  alt=""
                />

                <span>photo_2024_2.png</span>
              </div>
              <img className="icon" src="./download.png" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <im className="icon" g src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked? "You are blocked" : isReceiverBlocked? "User blocked" : "Block User"}
          </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Detail;
