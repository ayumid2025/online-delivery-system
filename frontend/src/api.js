import axios from 'axios';

export default axios.create({
  baseURL: 'https://online-delivery-backend.herokuapp.com/api'
});
