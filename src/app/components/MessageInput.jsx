import React from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Box, IconButton, TextField } from "@mui/material";

function MessageInput({ sendMessage, message, setMessage }) {
  // Send message on key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        alignItems: "center",
      }}
    >
      <TextField
        sx={{ flex: "1 1 0% ", p: ".5rem" }}
        size="small"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => sendMessage()} position="end">
              <TelegramIcon color="primary" />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}

export default MessageInput;
