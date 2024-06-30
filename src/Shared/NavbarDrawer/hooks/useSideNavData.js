import { useState, useEffect } from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance';

const fetchSideNavData = async (userType, userToken) => {
  try {
    const response = await axiosInstance.post(`/api/leftMenuData`, {
      userType: userType.toLowerCase(),
      userToken: userToken
    });

    const formattedMenuOptions = response.data.menuOptions.map(item => ({
      label: item.name,
      icon: GridViewIcon,
      navigateRoute: item.link
    }));

    return formattedMenuOptions;
  } catch (error) {
    console.error('Error fetching left menu data:', error);
    return [];
  }
};

const useSideNavData = (userType) => {
  const [sideNavData, setSideNavData] = useState([]);
  const userToken = sessionStorage.getItem('user-token');

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSideNavData(userType, userToken);
      setSideNavData(data);
    };

    fetchData();
  }, [userType, userToken]);

  return sideNavData;
};

export default useSideNavData;
