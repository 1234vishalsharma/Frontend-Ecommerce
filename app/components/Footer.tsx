"use client";

import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { cartStore } from "@/lib/store";
import { observer } from "mobx-react-lite";

/**
 * Footer component displaying live cart summary
 * 
 * Shows:
 * - Total number of items in cart
 * - Total cart value
 * 
 * Updates reactively via MobX when cart changes
 */
const Footer = observer(() => {
  return (
    <Paper
      sx={{
        mt: "auto",
        py: 2,
        px: 4,
        backgroundColor: "primary.main",
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="body2">Total Items</Typography>
            <Typography variant="h6">{cartStore.getTotalItems()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2">Cart Total</Typography>
            <Typography variant="h6">
              ${cartStore.getTotalPrice().toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
});

export default Footer;
