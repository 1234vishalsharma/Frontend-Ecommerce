"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useThemeMode } from "../providers";
import { cartStore } from "@/lib/store";
import { observer } from "mobx-react-lite";

/**
 * Header component with navigation, theme toggle, and cart badge
 * 
 * Features:
 * - Desktop navigation menu
 * - Mobile-friendly hamburger menu
 * - Dark/light theme toggle
 * - Cart item count badge
 * 
 * Wrapped with observer() to react to cart changes via MobX
 */
const Header = observer(() => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeMode();

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                cursor: "pointer",
                display: { xs: "none", sm: "block" },
              }}
            >
              ShopHub
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <Button color="inherit">{item.label}</Button>
              </Link>
            ))}
          </Box>

          {/* Icons */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* Cart Icon */}
            <Link href="/cart" style={{ textDecoration: "none" }}>
              <IconButton color="inherit">
                <Badge
                  badgeContent={cartStore.getTotalItems()}
                  color="secondary"
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>

            {/* Theme Toggle */}
            <IconButton color="inherit" onClick={toggleTheme}>
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Mobile Menu */}
            <IconButton
              color="inherit"
              onClick={() => toggleDrawer(true)}
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
        >
          <List sx={{ flex: 1 }}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => toggleDrawer(false)}
                    sx={{ py: 2 }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
});

export default Header;
