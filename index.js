const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Webhook automation fully working')
})
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})