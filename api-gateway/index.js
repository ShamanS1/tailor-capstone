require('dotenv').config();
const express = require('express');
const app = express();
const setupProxies = require('./routes/proxy.routes');

const PORT = process.env.PORT || 3000;

// Set up proxies for services
setupProxies(app);

app.get('/', (req, res) => {
  res.send('Smart Tailoring API Gateway is running...');
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
