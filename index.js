const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('DevOps Pipeline Running Successfully!')
})
app.listen(3000, () => {
    console.log('Server is running on port 3000')
    })