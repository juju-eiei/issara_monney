const axios = require('axios');
axios.post('http://localhost:5000/api/auth/owner/login', { username: 'admin', password: 'wrong' })
  .then(res => console.log('SUCCESS:', res.data))
  .catch(err => {
    console.error('ERROR STATUS:', err.response ? err.response.status : 'NO RESPONSE');
    console.error('ERROR DATA:', err.response ? err.response.data : err.message);
  });
