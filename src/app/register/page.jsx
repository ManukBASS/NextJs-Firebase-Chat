"use client";
// React
import { useState, useEffect } from "react";
// Material
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
// Next
import Link from "next/link";
import { useRouter } from "next/navigation";
// Firebase
import { auth, firestore } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// Third Party
import { toast } from "react-hot-toast";
import { AvatarGenerator } from "random-avatar-generator";

function page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();

  const generateRandomAvatar = () => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  };

  const handleRefreshAvatar = () => {
    setAvatarUrl(generateRandomAvatar());
  };

  useEffect(() => {
    setAvatarUrl(generateRandomAvatar());
  }, []);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        // Register user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Now you can use the user's UID as the document ID
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, {
          name,
          email: email,
          avatarUrl,
          status: "online",
        });

        router.push("/");
        setErrors({});
      }
    } catch (error) {
      // Handle registration errors
      console.error("Error registering user:", error.message);
      toast.error(error.message);
      setErrors({});
    }
    setLoading(false);
  };
  console.log(avatarUrl);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        p: "2.5rem",
        m: ".5rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-2xl shadow-lg p-10"
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography fontWeight="bold">Register a new account !</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: ".5rem",
          }}
        >
          <Avatar src={avatarUrl} alt="Avatar" sx={{ width: 80, height: 80 }} />
          <Button
            variant="outlined"
            sx={{ height: "2rem" }}
            size="small"
            onClick={handleRefreshAvatar}
          >
            New Avatar
          </Button>
        </Box>

        {/*name*/}
        <Box>
          <TextField
            fullWidth
            type="text"
            placeholder="John Doe"
            label="Name"
            sx={{
              color: "white",
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.name}
            </Typography>
          )}
        </Box>

        {/*email*/}
        <Box>
          <TextField
            fullWidth
            type="text"
            placeholder="john_doe@email.com"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.email}
            </Typography>
          )}
        </Box>

        {/*password*/}
        <Box>
          <TextField
            fullWidth
            type="password"
            placeholder="Enter Password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.password}
            </Typography>
          )}
        </Box>

        {/*confirm password*/}
        <Box>
          <TextField
            fullWidth
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <Typography variant="caption" sx={{ color: "red" }}>
              {errors.confirmPassword}
            </Typography>
          )}
        </Box>

        <Box>
          <Button variant="outlined" type="submit">
            {loading ? <CircularProgress /> : "Sign Up"}
          </Button>
        </Box>

        <Typography>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "blue" }}>
            Login
          </Link>
        </Typography>
      </form>
    </Box>
  );
}

export default page;
