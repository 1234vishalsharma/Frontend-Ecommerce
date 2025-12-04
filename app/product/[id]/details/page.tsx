"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Product } from "@/lib/store";
import { getProductById } from "@/lib/api";
import { cartStore } from "@/lib/store";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

/**
 * Product detail page
 * 
 * Displays full product information including:
 * - Large product image
 * - Title, description, price
 * - Customer rating
 * - Quantity selector
 * - Add to cart button
 * 
 * Route: /product/[id]/details
 */
const ProductDetailPage = () => {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      cartStore.addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
          <CircularProgress />
        </Box>
        <Footer />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ flex: 1, py: 4 }}>
          <Typography variant="h5" color="error">
            Product not found
          </Typography>
          <Link href="/">
            <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
              Back to Home
            </Button>
          </Link>
        </Container>
        <Footer />
      </Box>
    );
  }

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

        {/* Product Details */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
          {/* Image */}
          <Box>
            <Card>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                sx={{
                  objectFit: "contain",
                  p: 3,
                  backgroundColor: "#f5f5f5",
                  minHeight: 400,
                }}
              />
            </Card>
          </Box>

          {/* Details */}
          <Box>
            {/* Title */}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              {product.title}
            </Typography>

            {/* Category */}
            <Chip
              label={product.category}
              color="primary"
              sx={{ mb: 2 }}
            />

            {/* Rating */}
            {product.rating && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <StarIcon sx={{ color: "#ffc107" }} />
                <Typography variant="body1">
                  {product.rating.rate} ({product.rating.count} reviews)
                </Typography>
              </Box>
            )}

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700 }}>
                ${product.price.toFixed(2)}
              </Typography>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {product.description}
              </Typography>
            </Box>

            {/* Quantity Selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography variant="body1">Quantity:</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Typography sx={{ minWidth: 40, textAlign: "center", py: 1 }}>
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </Box>
            </Box>

            {/* Add to Cart Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
            >
              Add to My Cart
            </Button>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default ProductDetailPage;
