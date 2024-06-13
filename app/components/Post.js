'use client'

import { useState } from 'react';
import { Box, Typography, Button, TextField, Card, CardContent, CardMedia, Grid } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function Post({ post }) {
  const [comment, setComment] = useState('');

  const handleLike = () => {
    socket.emit('like_post', post.id);
  };

  const handleComment = () => {
    if (comment.trim() !== '') {
      socket.emit('comment_post', { postId: post.id, comment });
      setComment('');
    }
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:4000/${post.photo}`}
        alt="Post Image"
        style={{ objectFit: 'cover', width: '100%' }}
      />
      <CardContent>
        <Typography variant="body1" component="p" gutterBottom>
          {post.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Likes: {post.likes}
        </Typography>
        <Button onClick={handleLike} variant="contained" color="primary" size="small" style={{ marginBottom: '10px' }}>
          Like
        </Button>
        <Box>
          {post.comments.map((comment, index) => (
            <Typography key={index} variant="body2" component="p" color="textSecondary">
              {comment}
            </Typography>
          ))}
        </Box>
        <Box mt={2}>
          <TextField
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
          />
          <Button onClick={handleComment} variant="contained" color="secondary" size="small">
            Comment
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
