"use client";

import React from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { cartStore } from "@/lib/store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { observer } from "mobx-react-lite";

/**
 * Shopping cart page
 * 
 * Features:
 * - View all items in cart
 * - Adjust quantities
 * - Remove items
 * - View order summary
 * 
 * Wrapped with observer() to react to cart changes
 */
const CartPage = observer(() => {
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      cartStore.updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number) => {
    cartStore.removeFromCart(productId);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Back Button */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
            Back to Home
          </Button>
        </Link>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          My Cart
        </Typography>

        {cartStore.items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="textSecondary" sx={{ mb: 3 }}>
              Your cart is empty
            </Typography>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button variant="contained" size="large">
                Continue Shopping
              </Button>
            </Link>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "2fr 1fr" },
              gap: 4,
            }}
          >
            {/* Cart Items */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cartStore.items.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "100px 1fr", sm: "150px 1fr 100px" },
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      {/* Product Image */}
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.title}
                        sx={{
                          objectFit: "contain",
                          height: 100,
                          backgroundColor: "#f5f5f5",
                          p: 1,
                          borderRadius: 1,
                        }}
                      />

                      {/* Product Details */}
                      <Box sx={{ minWidth: 0 }}>
                        <Link
                          href={`/product/${item.id}/details`}
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              width: "300px",
                              fontWeight: 600,
                              cursor: "pointer",
                              "&:hover": { color: "primary.main" },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={item.title}
                          >
                            {item.title}
                          </Typography>
                        </Link>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          {item.category}
                        </Typography>
                        <Typography variant="h6" sx={{ color: "primary.main" }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Quantity & Remove */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          alignItems: "flex-end",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </Button>
                          <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            sx={{ width: 60 }}
                            slotProps={{
                              input: { style: { textAlign: "center" } },
                            }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </Button>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Order Summary */}
            <Box>
              <Card sx={{ position: { md: "sticky" }, top: 80 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Order Summary
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>
                      ${cartStore.getTotalPrice().toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Items:</Typography>
                    <Typography>{cartStore.getTotalItems()}</Typography>
                  </Box>

                  <Box
                    sx={{
                      borderTop: 1,
                      borderColor: "divider",
                      py: 2,
                      my: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Total:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${cartStore.getTotalPrice().toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button fullWidth variant="contained" size="large" sx={{ mb: 1 }}>
                    Proceed to Checkout
                  </Button>

                  <Link href="/" style={{ textDecoration: "none", width: "100%" }}>
                    <Button fullWidth variant="outlined">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
});

export default CartPage;
