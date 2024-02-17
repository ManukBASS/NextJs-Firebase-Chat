"use client";
// React
import React, { useEffect, useState } from "react";
// Material UI
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";
// Next
import { useRouter } from "next/navigation";
// Firebase
import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// Components
import User from "./components/User";
import ChatRoom from "./components/ChatRoom";

function page() {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const ResponsiveBox = styled("div")(({ theme }) => ({
    [theme.breakpoints.up("lg")]: {
      flexShrink: 0,
      width: "25%",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setUser(data);
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (user == null)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: "18rem",
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <IconButton
        onClick={() => setIsDrawerOpen(true)}
        sx={{
          display: { md: "none" },
          position: "absolute",
          top: 0,
          left: 0,
          margin: "8px",
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{ display: { md: "block", lg: "none" } }}
      >
        <User userData={user} setSelectedChatroom={setSelectedChatroom} />
      </Drawer>

      <ResponsiveBox>
        <User userData={user} setSelectedChatroom={setSelectedChatroom} />
      </ResponsiveBox>

      <Box sx={{ flexGrow: 1, width: "75%" }}>
        {selectedChatroom ? (
          <>
            <ChatRoom user={user} selectedChatroom={selectedChatroom} />
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box sx={{ fontSize: "1.5rem", lineHeight: "2rem" }}>
                <Typography fontWeight="bold">Select a chatroom</Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default page;
