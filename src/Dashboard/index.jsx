import { useState, useEffect } from "react";
import { URL } from "../utils/constants";
import axios from "axios";
import {
  Radio, RadioGroup, FormControlLabel, FormControl, Box, Button,
  Typography, TextField, MenuItem, Container, Paper, Grid
} from '@mui/material';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};


const Dashboard = () => {
  const [selectedFileType, setselectedFileType] = useState('PDF');
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [selectedProductOption, setSelectedProductOption] = useState('');
  const [selectedLobOption, setSelectedLobOption] = useState('');
  const [productData, setProductData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [userType, setUserType] = useState([]);

  const handleProductChange = (event) => {
    setSelectedProductOption(event.target.value);
  };

  const handleLobChange = (event) => {
    setSelectedLobOption(event.target.value);
  };

  useEffect(() => {
    const userType = JSON.parse(sessionStorage.getItem("userData")).user.userType;
    setUserType(userType);
    const fetchProducts = async () => {
      try {
        const resp = await axios.get(`${URL.BASE_URL}/api/products`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("user-token")}`,
          }
        });
        if (resp.data) {
          setProductData(resp.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedLobOption) {
      const selectedLobProducts = productData.find(lobItem => lobItem.lob === selectedLobOption);
      setProductList(selectedLobProducts ? selectedLobProducts.products : []);
    } else {
      setProductList([]);
    }
  }, [selectedLobOption, productData]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFileUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileTypeChange = (event) => {
    setselectedFileType(event.target.value);
    setFile(null);
    setFileUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first!');
      return;
    }
    let formData = new FormData();
    formData.append('file', file);
    formData.append("product_name", selectedProductOption);
    formData.append("lob", selectedLobOption);

    try {
      const response = await axios.post(`${URL.BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${sessionStorage.getItem("user-token")}`,
        }
      });

      console.log('File uploaded successfully', response.data);
      window.open(response.data.newCollateral.url, "_blank");
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <>
      {
        userType === "marketing" &&
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ mt: 1, mb: 2 }}>Dashboard</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>File Type</Typography>
                  <RadioGroup row aria-label="file-type" name="file-type" value={selectedFileType} onChange={handleFileTypeChange}>
                    <FormControlLabel value="Image" control={<Radio />} label="Image" />
                    <FormControlLabel value="Video" control={<Radio />} label="Video" />
                    <FormControlLabel value="PDF" control={<Radio />} label="PDF" />
                  </RadioGroup>
                </FormControl>

                <form onSubmit={handleSubmit}>
                  <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>LOB</Typography>
                    <TextField
                      select
                      fullWidth
                      label="Select LOB"
                      value={selectedLobOption}
                      onChange={handleLobChange}
                      variant="outlined"
                    >
                      <MenuItem value="">--Please choose an option--</MenuItem>
                      {productData.map((item, index) => (
                        <MenuItem key={index} value={item.lob}>{item.lob}</MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>Product</Typography>
                    <TextField
                      select
                      fullWidth
                      label="Select Product"
                      value={selectedProductOption}
                      onChange={handleProductChange}
                      variant="outlined"
                    >
                      <MenuItem value="">--Please choose an option--</MenuItem>
                      {productList.map((item, index) => (
                        <MenuItem key={index} value={item.product_name}>{item.product_name}</MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>Upload File</Typography>
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      sx={{
                        backgroundColor: '#1e2a38',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#2c3e50',
                        },
                        height: '56px',
                        textTransform: 'none',
                      }}
                    >
                      Choose file
                      <input
                        type="file"
                        hidden
                        accept={selectedFileType === 'Image' ? 'image/*' : selectedFileType === 'Video' ? 'video/*' : '.pdf'}
                        onChange={handleFileChange}
                      />
                    </Button>
                    <Typography variant="body2" mt={1}>
                      {file ? file.name : "No file chosen"}
                    </Typography>
                  </Box>

                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Upload
                  </Button>
                </form>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom>Preview</Typography>
                {fileUrl && selectedFileType === 'Image' && (
                  <img src={fileUrl} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                )}
                {fileUrl && selectedFileType === 'Video' && (
                  <video controls style={{ width: '100%' }}>
                    <source src={fileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {fileUrl && selectedFileType === 'PDF' && (
                  <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    style={{ width: '100%', height: '90%', border: 'none' }}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      }
      {userType === "admin" &&
        <>
          <Pie width={50}
            height={50}
            options={{ maintainAspectRatio: false }} data={data} />
        </>
      }
      {
        userType === "agent" &&
        <>
          <h1>Welcome to the Dashboard!</h1>
        </>
      }
    </>
  );
};

export default Dashboard;
