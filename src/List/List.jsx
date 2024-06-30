import React, { useState, useEffect } from 'react';
import axios from "axios";
import { URL } from '../utils/constants';
import {
  Container, Grid, Card, CardMedia, CardContent, Typography,
  Button, Box, CircularProgress, Chip, Tooltip, IconButton,
  Modal, Paper, Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareIcon from '@mui/icons-material/Share';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CottageIcon from '@mui/icons-material/Cottage';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5',
});

const ShareModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  outline: 'none',
  borderRadius: theme.shape.borderRadius,
  maxWidth: '400px',
  width: '90%',
}));

const List = () => {
  const [collateralList, setCollateralList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedCollateral, setSelectedCollateral] = useState(null);

  useEffect(() => {
    fetchCollateral();
  }, []);

  async function fetchCollateral() {
    try {
      setLoading(true);
      const userDataString = sessionStorage.getItem("userData");
      const userData = JSON.parse(userDataString);
      if (!userData) {
        throw new Error("Invalid user data");
      }

      const result = await axios.post(`${URL.BASE_URL}/api/getCollateral`, {
        "user_id": userData.user.id
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`
        }
      });
      setCollateralList(result.data.data);
    } catch (err) {
      console.error("Error fetching collateral:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenShareModal = (collateral) => {
    setSelectedCollateral(collateral);
    setOpenShareModal(true);
  };

  const handleCloseShareModal = () => {
    setOpenShareModal(false);
    setSelectedCollateral(null);
  };

  const handleShare = (withPersonalization) => {
    // Implement your sharing logic here
    console.log(`Sharing ${selectedCollateral.product_name} ${withPersonalization ? 'with' : 'without'} personalization`);
    handleCloseShareModal();
  };

  const getLobIcon = (lob) => {
    switch (lob.toLowerCase()) {
      case 'motor': return <DirectionsCarIcon />;
      case 'home': return <CottageIcon />;
      default: return <TwoWheelerIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Typography sx={{fontWeight: 800, mb: 3}} variant="h4" component="h2" gutterBottom align="left" color="primary">
        Collateral Gallery
      </Typography>
      <Grid container spacing={4}>
        {collateralList.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <StyledCard>
              <StyledCardMedia
                image={item.url}
                title={item.product_name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {item.product_name}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Chip
                    icon={getLobIcon(item.lob)}
                    label={item.lob}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={item.type_of_item.toUpperCase()}
                    color="secondary"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Category: {item.category_name || 'Not specified'}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Tooltip title="Open in New Tab">
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<OpenInNewIcon />}
                      onClick={() => window.open(item.url, '_blank')}
                      sx={{ flexGrow: 1, mr: 1 }}
                    >
                      View
                    </Button>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenShareModal(item)}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      
      <ShareModal
        open={openShareModal}
        onClose={handleCloseShareModal}
        aria-labelledby="share-modal-title"
        aria-describedby="share-modal-description"
      >
        <ModalContent>
          <Typography id="share-modal-title" variant="h6" component="h2" gutterBottom>
            Share Collateral
          </Typography>
          <Typography id="share-modal-description" sx={{ mt: 2 }}>
            How would you like to share this collateral?
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => handleShare(true)}
              fullWidth
            >
              Share with Personalization
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleShare(false)}
              fullWidth
            >
              Share without Personalization
            </Button>
          </Stack>
        </ModalContent>
      </ShareModal>
    </Container>
  );
};

export default List;