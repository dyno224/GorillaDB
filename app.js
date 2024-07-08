const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    } else {
      let fileData = files.map(file => {
        let stats = fs.statSync(`./uploads/${file}`);
        return {
          name: file,
          size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
          uploadDate: stats.birthtime // Using birthtime to get the creation time
        };
      });
      res.render('index', { files: fileData });
    }
  });
});

// Download route
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath);
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
