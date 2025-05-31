import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchAiPerformanceData = async () => {
  const response = await axios.get(`${API_BASE_URL}/ai-performance`);
  return response.data;
};

export const fetchFacilityData = async () => {
  const response = await axios.get(`${API_BASE_URL}/facilities`);
  return response.data;
};