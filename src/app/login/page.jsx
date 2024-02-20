"use client";
// React
import { useState } from "react";
// Material UI
import {
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
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// Third Party
import { toast } from "react-hot-toast";

function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    // Form validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (evt) => {
    // Form submit validation
    evt.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if (user) {
          router.push("/");
        }

        setErrors({});
      }
    } catch (error) {
      console.error("Error logging in user:", error.message);
      toast.error(error.message);
      setErrors({});
    }
    setLoading(false);
  };

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
          <Typography fontWeight="bold">Log In and chat !</Typography>
        </Box>
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

        <Box>
          <Box>
            <Button variant="outlined" type="submit">
              {loading ? <CircularProgress /> : "Sign In"}
            </Button>
          </Box>
        </Box>

        <Typography>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "blue" }}>
            Register
          </Link>
        </Typography>
      </form>
    </Box>
  );
}

export default page;
