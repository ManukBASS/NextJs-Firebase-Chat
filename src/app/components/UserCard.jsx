// React
import React from "react";
// Material UI
import { Avatar, Box, Typography } from "@mui/material";

function UsersCard({ avatarUrl, name, latestMessage, type }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        borderBottom: "1px solid #e2e8f0",
        position: "relative",
        "&:hover": {
          cursor: "pointer",
        },
      }}
    >
      <Box sx={{ flexShrink: 0, marginRight: 4, position: "relative" }}>
        <Box
          sx={{
            borderRadius: "full",
            overflow: "hidden",
          }}
        >
          <Avatar sx={{ width: 60, height: 60 }} src={avatarUrl} alt="Avatar" />
        </Box>
      </Box>

      {type === "chat" && (
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "semibold" }}>
              {name}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "gray.500",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {latestMessage}
          </Typography>
        </Box>
      )}

      {type === "user" && (
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "semibold" }}>
              {name}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default UsersCard;
