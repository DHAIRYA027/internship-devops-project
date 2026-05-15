const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Jenkins CI/CD Automation Successful')
})
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})