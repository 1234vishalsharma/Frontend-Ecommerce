"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { Product } from "@/lib/store";
import { getProducts, getCategories } from "@/lib/api";
import { cartStore } from "@/lib/store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { observer } from "mobx-react-lite";

const HomePage = observer(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "rating">("name");
  const [loading, setLoading] = useState(false);

  // Restore filter state from sessionStorage on mount
  // This preserves user's search/category/sort when navigating back from product details
  useEffect(() => {
    const savedCategory = sessionStorage.getItem("filter_category") || "all";
    const savedSearch = sessionStorage.getItem("filter_search") || "";
    const savedSort = (sessionStorage.getItem("filter_sort") as any) || "name";

    setSelectedCategory(savedCategory);
    setSearchQuery(savedSearch);
    setSortBy(savedSort);
    
    loadCategories();
    loadProducts(savedCategory);
  }, []);

  // Persist filter changes to sessionStorage for the session
  useEffect(() => {
    sessionStorage.setItem("filter_category", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    sessionStorage.setItem("filter_search", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem("filter_sort", sortBy);
  }, [sortBy]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadProducts = async (category: string) => {
    setLoading(true);
    try {
      const data = await getProducts(category === "all" ? undefined : category);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    setSelectedCategory(category);
    loadProducts(category);
  };

  const handleAddToCart = (product: Product) => {
    // Add single quantity - user can change it in cart
    cartStore.addToCart(product, 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter products by search query (title or description)
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating?.rate || 0) - (a.rating?.rate || 0);
      case "name":
      default:
        return a.title.localeCompare(b.title);
    }
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Hero section */}
        {!searchQuery && selectedCategory === "all" && products.length > 0 && (
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "textSecondary" }}>
              Welcome to ShopHub
            </Typography>
            <Typography variant="body2" sx={{ color: "textSecondary", mt: 1 }}>
              Discover thousands of products at great prices
            </Typography>
          </Box>
        )}
        {/* Search and Filter Controls */}
        <Box
          sx={{
            mb: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr auto auto" },
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          {/* Search Bar */}
          <TextField
            placeholder="Search products by name or description..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ mr: 1 }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                 <InputAdornment position="end">
                   <IconButton
                     size="small"
                     onClick={() => setSearchQuery("")}
                     edge="end"
                     title="Clear search"
                   >
                     <ClearIcon />
                   </IconButton>
                 </InputAdornment>
               ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          {/* Category Filter */}
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All Products</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl sx={{ minWidth: 170 }} size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <MenuItem value="name">Name (A-Z)</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rating</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Search Results Info */}
        {searchQuery && !loading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Found {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </Typography>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Products Grid */}
        {!loading && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3 }}>
            {sortedProducts.map((product) => (
              <Box key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  {/* Product Image */}
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      objectFit: "contain",
                      p: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />

                  <Box sx={{display: 'flex', height: "100%", alignItems: "end"}}>
                  {/* Content */}
                  <CardContent sx={{ flex: 1 }}>
                    <Link
                      href={`/product/${product.id}/details`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          height: 56,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" },
                          mb: 1,
                        }}
                      >
                        {product.title}
                      </Typography>
                    </Link>

                    {/* Category */}
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ mb: 1 }}
                    />

                    {/* Price */}
                    <Typography
                      variant="h5"
                      sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>

                    {/* Rating */}
                    {product.rating && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon sx={{ color: "#ffc107", fontSize: 20 }} />
                        <Typography variant="body2">
                          {product.rating.rate} ({product.rating.count})
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  </Box>

                  {/* Actions */}
                  <CardActions sx={{ pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!loading && sortedProducts.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="textSecondary">
              {searchQuery || selectedCategory !== "all"
                ? "No products found"
                : "No products available"}
            </Typography>
            {searchQuery && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Try adjusting your search query or clearing filters
              </Typography>
            )}
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
});

export default HomePage;
