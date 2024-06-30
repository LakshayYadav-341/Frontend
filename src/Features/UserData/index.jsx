import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../utils/constants";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Container,
  Paper,
  Fade,
  Divider,
  Button,
} from "@mui/material";
import { 
  Edit, 
  Delete, 
  Person, 
  Email, 
  Work, 
  Business, 
  ShoppingCart,
  Add,
} from "@mui/icons-material";

const UserData = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${URL.BASE_URL}/api/getUsers`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("user-token")}`,
          }
        });
        console.log(await response.data);
        setUserData(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL.BASE_URL}/api/user/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("user-token")}`,
        }
      });
      setUserData(userData.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    navigate("/createUser", { state: { user } });
  };

  const handleCreateUser = () => {
    navigate("/createUser");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            User Data
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateUser}
          >
            Create User
          </Button>
        </Box>
        <Grid container spacing={3}>
          {userData?.length > 0 &&
            userData.map((user, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Fade in={true} timeout={500 * (index + 1)}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.03)' } }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50, mr: 2 }}>
                            <Person fontSize="large" />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.full_name}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.user_type}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Tooltip title="Edit User">
                            <IconButton onClick={() => handleEdit(user)} aria-label="edit" color="primary" size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton onClick={() => handleDelete(user._id)} aria-label="delete" color="error" size="small">
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.primary" sx={{ mr: 1, fontWeight: 'medium' }}>Email:</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email_id}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Work sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.primary" sx={{ mr: 1, fontWeight: 'medium' }}>User Type:</Typography>
                        <Typography variant="body2" color="text.secondary">{user.user_type}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Business sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.primary" sx={{ mr: 1, fontWeight: 'medium' }}>LOB:</Typography>
                        <Typography variant="body2" color="text.secondary">{user.lob}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <ShoppingCart sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
                        <Box>
                          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'medium', mb: 0.5 }}>Products:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {user.products.map((product, index) => (
                              <Chip 
                                key={index} 
                                label={product} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                                sx={{ borderRadius: '4px' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserData;