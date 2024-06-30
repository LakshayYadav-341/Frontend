import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Checkbox,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { Person, Email, Lock, Work, Business, ShoppingCart } from "@mui/icons-material";
import axiosInstance from "./../../utils/axiosInstance";

const UserCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editUser = location.state?.user || null;
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    user_type: "",
    lob: "",
    products: [],
  });

  const [availableProducts, setAvailableProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (editUser) {
      setFormData({
        email: editUser.email_id || "",
        full_name: editUser.full_name || "",
        user_type: editUser.user_type || "",
        lob: editUser.lob || "",
        products: editUser.products || [],
      });
      updateAvailableProducts(editUser.lob || "");
    }
  }, [editUser]);

  const updateAvailableProducts = (lob) => {
    if (lob === "Health") {
      setAvailableProducts(["Health Insurance", "Health Plans"]);
    } else if (lob === "Motor") {
      setAvailableProducts(["Car Insurance", "Bike Insurance"]);
    } else {
      setAvailableProducts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "lob") {
      updateAvailableProducts(value);
    }
  };

  const handleProductChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prevData) => ({
      ...prevData,
      products: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axiosInstance.post("/api/createUser", formData);
        setSnackbar({ open: true, message: "User created successfully!", severity: "success" });
      setTimeout(() => navigate("/users"), 2000);
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({ open: true, message: "An error occurred. Please try again.", severity: "error" });
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Card elevation={3} sx={{ backgroundColor: "#ffffff", borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 4, color: "primary.main" }}>
              {editUser ? "Edit User" : "Create User"}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Email color="action" sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Person color="action" sx={{ mr: 1 }} /> }}
                />
              </Grid>
              {!editUser && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{ startAdornment: <Lock color="action" sx={{ mr: 1 }} /> }}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    label="User Type"
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    required
                    startAdornment={<Work color="action" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="agent">Agent</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>LOB</InputLabel>
                  <Select
                    label="LOB"
                    name="lob"
                    value={formData.lob}
                    onChange={handleChange}
                    required
                    startAdornment={<Business color="action" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="Health">Health</MenuItem>
                    <MenuItem value="Motor">Motor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Products</InputLabel>
                  <Select
                    label="Products"
                    name="products"
                    multiple
                    value={formData.products}
                    onChange={handleProductChange}
                    renderValue={(selected) => selected.join(", ")}
                    required
                    disabled={!formData.lob}
                    startAdornment={<ShoppingCart color="action" sx={{ mr: 1 }} />}
                  >
                    {availableProducts.map((product, index) => (
                      <MenuItem key={index} value={product}>
                        <Checkbox checked={formData.products.indexOf(product) > -1} />
                        <ListItemText primary={product} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    mt: 2, 
                    px: 4, 
                    py: 1.5, 
                    borderRadius: 2,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    }
                  }}
                >
                  {editUser ? "Update User" : "Create User"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserCreation;