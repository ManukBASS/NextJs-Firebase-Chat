"use client";
// React
import { useEffect, useState } from "react";
// Material UI
import { Box, Button, Typography } from "@mui/material";
// Next
import { useRouter } from "next/navigation";
// Firebase
import { firestore, app } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
// Components
import UserCard from "./UserCard";
// Third Party
import { toast } from "react-hot-toast";

function Users({ userData, setSelectedChatroom }) {
  const [activeTab, setActiveTab] = useState("chatrooms");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [users, setUsers] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const router = useRouter();
  const auth = getAuth(app);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //get all users
  useEffect(() => {
    setLoading2(true);
    const tasksQuery = query(collection(firestore, "users"));

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
      setLoading2(false);
    });
    return () => unsubscribe();
  }, []);

  //get chatrooms
  useEffect(() => {
    setLoading(true);
    if (!userData?.id) return;
    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData.id)
    );
    const unsubscribeChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatrooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setUserChatrooms(chatrooms);
    });

    // Cleanup function for chatrooms
    return () => unsubscribeChatrooms();
  }, [userData]);

  // Create a chatroom
  const createChat = async (user) => {
    // Check if a chatroom already exists for these users
    const existingChatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "==", [userData.id, user.id])
    );

    try {
      const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);

      if (existingChatroomsSnapshot.docs.length > 0) {
        // Chatroom already exists, handle it accordingly (e.g., show a message)
        console.log("Chatroom already exists for these users.");
        toast.error("Chatroom already exists for these users.");
        return;
      }

      // Chatroom doesn't exist, proceed to create a new one
      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      };

      const chatroomData = {
        users: [userData.id, user.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      };

      const chatroomRef = await addDoc(
        collection(firestore, "chatrooms"),
        chatroomData
      );
      console.log("Chatroom created with ID:", chatroomRef.id);
      setActiveTab("chatrooms");
    } catch (error) {
      console.error("Error creating or checking chatroom:", error);
    }
  };

  //open chatroom
  const openChat = async (chatroom) => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData:
        chatroom.usersData[chatroom.users.find((id) => id !== userData.id)],
    };
    setSelectedChatroom(data);
  };

  const logoutClick = () => {
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <Box sx={{ boxShadow: 3, height: "100vh", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          padding: 4,
          gap: { xs: 4, lg: 1 },
        }}
      >
        <Button
          variant="outlined"
          sx={{
            width: "100%",
            mb: { xs: 4, lg: 1 },
            color: (theme) =>
              activeTab === "users" ? theme.palette.primary.main : undefined,
          }}
          onClick={() => handleTabClick("users")}
        >
          Users
        </Button>
        <Button
          variant="outlined"
          sx={{
            width: "100%",
            mb: { xs: 4, lg: 1 },
            color: (theme) =>
              activeTab === "chatrooms"
                ? theme.palette.primary.main
                : undefined,
          }}
          onClick={() => handleTabClick("chatrooms")}
        >
          Rooms
        </Button>
        <Button
          variant="outlined"
          sx={{ width: "100%", mb: { xs: 4, lg: 1 } }}
          onClick={logoutClick}
        >
          Logout
        </Button>
      </Box>

      <Box>
        {activeTab === "chatrooms" && (
          <>
            <Typography variant="h6" sx={{ px: 4, mb: 2 }}>
              Chatrooms
            </Typography>
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <span className="loading loading-spinner text-primary"></span>
              </Box>
            )}
            {userChatrooms.map((chatroom) => (
              <Box
                key={chatroom.id}
                onClick={() => {
                  openChat(chatroom);
                }}
              >
                <UserCard
                  name={
                    chatroom.usersData[
                      chatroom.users.find((id) => id !== userData?.id)
                    ].name
                  }
                  avatarUrl={
                    chatroom.usersData[
                      chatroom.users.find((id) => id !== userData?.id)
                    ].avatarUrl
                  }
                  latestMessage={chatroom.lastMessage}
                  type="chat"
                />
              </Box>
            ))}
          </>
        )}

        {activeTab === "users" && (
          <>
            <Typography variant="h6" sx={{ mt: 4, px: 4, mb: 2 }}>
              Users
            </Typography>
            {loading2 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <span className="loading loading-spinner text-primary"></span>
              </Box>
            )}
            {users.map((user) => (
              <Box
                key={user.id}
                onClick={() => {
                  createChat(user);
                }}
              >
                {user.id !== userData?.id && (
                  <UserCard
                    name={user.name}
                    avatarUrl={user.avatarUrl}
                    latestMessage=""
                    type="user"
                  />
                )}
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}

export default Users;
