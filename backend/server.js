const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

let posts = [];

app.post('/upload', upload.single('photo'), (req, res) => {
  try {
    const newPost = {
      id: Date.now().toString(),
      photo: req.file.path,
      description: req.body.description,
      likes: 0,
      comments: [],
    };
    posts.push(newPost);
    io.emit('new_post', newPost); // Ensure this is called once
    res.status(200).json(newPost);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('like_post', (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      io.emit('update_post', post);
    }
  });

  socket.on('comment_post', ({ postId, comment }) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments.push(comment);
      io.emit('update_post', post);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
