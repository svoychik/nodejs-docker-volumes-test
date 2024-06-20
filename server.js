const fs = require('fs/promises');
const { constants } = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/ping', (req, res) => {
  res.send("pong");
});

app.get('/pong', (req, res) => {
  res.send('ping');
});

app.get('/index', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;
  const adjTitle = title.toLowerCase();

  const tempFilePath = path.join(__dirname, 'temp', `${adjTitle}.txt`);
  const finalFilePath = path.join(__dirname, 'feedback', `${adjTitle}.txt`);

  try {
    await fs.writeFile(tempFilePath, content);

    try {
      await fs.access(finalFilePath, constants.F_OK);
      res.redirect('/exists');
    } catch {
      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath);
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error handling create request:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
