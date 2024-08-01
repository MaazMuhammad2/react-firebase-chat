import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { useUserState } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const { currentUser } = useUserState();
  const { changeChat, chatId } = useChatStore();

  // console.log(chatId)

  // little bit confusing
  useEffect(() => {
    // Set up real-time listener on the document for the current user
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id), // Listen to the document in 'userchats' collection with the ID of currentUser.id
      async (res) => {
        // Callback function to handle updates
        const items = res.data().chats; // Get the updated 'chats' array from the document data

        // Create a list of promises to fetch user data for each chat
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId); // Reference to the user document
          const userDocSnap = await getDoc(userDocRef); // Get the user document snapshot

          // const user = userDocSnap.data(); // Get the user data
          const user = userDocSnap.exists() ? userDocSnap.data() : {};

          return { ...item, user }; // Combine chat item with user data
        });

        // Resolve all promises and get the chat data
        const chatData = await Promise.all(promises);

        // Update the state with the sorted chat data
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userchats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userchats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userchats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatRef, {
        chats: userchats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="plus"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      <div>
        {filteredChats.map((chat) => (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <img
              src={
                chat.user.blocked.includes(currentUser.id)
                  ? "avatar.png"
                  : chat.user.avatar || "./avatar.png"
              }
              alt=""
            />
            <div className="texts">
              <span className="username">
                {chat.user.blocked.includes(currentUser.id)
                  ? "User"
                  : chat.user.username}
              </span>
              <p className="lastMessage">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
