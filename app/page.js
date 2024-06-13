"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import UploadForm from './components/UploadForm';
import Post from './components/Post';
import { Box, Container } from '@mui/material';

const socket = io('https://nextjs-instagram-clone-5.onrender.com');

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('https://nextjs-instagram-clone-5.onrender.com/posts')
      .then(response => setPosts(response.data.sort((a, b) => b.id - a.id)));

    socket.on('new_post', (post) => {
      setPosts(prevPosts => [post, ...prevPosts]);
    });

    socket.on('update_post', (updatedPost) => {
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      ));
    });

    // Clean up the effect
    return () => {
      socket.off('new_post');
      socket.off('update_post');
    };
  }, []);

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <UploadForm />
        <Box mt={4}>
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
