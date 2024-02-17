import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import moment from "moment";

const MessageCard = ({ message, me, other }) => {
  const isMessageFromMe = message.sender === me.id;

  const formatTimeAgo = (timestamp) => {
    const date = timestamp?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  return (
    <Box
      key={message.id}
      sx={{
        display: "flex",
        marginBottom: 3,
        justifyContent: isMessageFromMe ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          marginRight: 2,
          marginLeft: isMessageFromMe ? 2 : 0,
        }}
      >
        <Avatar
          src={isMessageFromMe ? me.avatarUrl : other.avatarUrl}
          alt="Avatar"
          sx={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      </Box>

      <Box
        sx={{
          color: "white",
          p: ".5rem",
          borderRadius: ".5rem",
          backgroundColor: isMessageFromMe ? "#3b82f6" : "#19d39e",
          alignSelf: "flex-start",
          maxWidth: "70%",
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography variant="caption" sx={{ color: "#fff" }}>
          {formatTimeAgo(message.time)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageCard;
