"use client";
// React
import React, { useState, useEffect, useRef } from "react";
// Material UI
import { Box } from "@mui/material";
// Firebase
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
// Components
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

function ChatRoom({ selectedChatroom }) {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch Messages
  useEffect(() => {
    if (!chatRoomId) return;
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      }
    );

    return unsubscribe;
  }, [chatRoomId]);

  // Saving Messages on DB
  const sendMessage = async () => {
    const messagesCollection = collection(firestore, "messages");
    if (message == "" && image == "") {
      return;
    }

    try {
      // Add new Message to the Firestore collection
      const newMessage = {
        chatRoomId: chatRoomId,
        sender: me.id,
        content: message,
        time: serverTimestamp(),
        image: image,
      };

      await addDoc(messagesCollection, newMessage);
      setMessage("");
      setImage("");
      // Update Messages
      const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatroomRef, {
        lastMessage: message ? message : "Image",
      });
    } catch (error) {
      console.error("Error sending message:", error.message);
    }

    // Bottom Scroll
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
        sx={{ flex: "1 1 0%", overflowY: "auto", p: "2.5rem" }}
        ref={messagesContainerRef}
      >
        {messages?.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            me={me}
            other={other}
          />
        ))}
      </Box>

      <MessageInput
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
        image={image}
        setImage={setImage}
      />
    </Box>
  );
}

export default ChatRoom;
