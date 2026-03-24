const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const registerSwagger = require('./docs/swagger');
const systemRoutes = require('./routes/systemRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const uploadsPath = path.join(__dirname, 'uploads');

fs.mkdirSync(uploadsPath, { recursive: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsPath));
registerSwagger(app);

app.use('/api', systemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Image must be 5MB or smaller' });
    }

    return res.status(400).json({ error: error.message });
  }

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  next();
});

module.exports = app;
