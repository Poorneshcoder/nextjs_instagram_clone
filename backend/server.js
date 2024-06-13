const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

let posts = [];

app.post('/upload', upload.single('photo'), (req, res) => {
  const post = {
    id: posts.length + 1,
    photo: req.file.filename,
    description: req.body.description || '',
    likes: 0,
    comments: [],
  };
  posts.push(post);
  io.emit('new_post', post);
  res.status(200).send('File uploaded successfully');
});

app.get('/posts', (req, res) => {
  res.status(200).json(posts);
});

io.on('connection', (socket) => {
  console.log('A user connected');

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
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
