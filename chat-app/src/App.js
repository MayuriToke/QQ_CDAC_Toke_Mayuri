import React, { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { TextField, Button, List, ListItem, ListItemText, Typography, Box, Paper } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
    setChatMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
    socket.emit('chat message', message);
    setMessage('');
    }
    setChatMessages((prevMessages) => [...prevMessages, message])
    socket.on('chat message', (msg) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });
    setMessage('')
  };
  return (
    <Box style={{ backgroundColor: 'pink', flex: 1, height: '100vh' }}
    display={'flex'} justifyContent={'center'}>
      <Box display={'flex'} 
      justifyContent={'center'}
      sx={{width:'30%',border:'1px solid black'}}
      alignItems={'center'} flexDirection={'column'}>
        <Box>
          <Typography variant="h4">Chat App</Typography>
          <List>
            {chatMessages.map((msg, index) => (

              <Box sx={{ backgroundColor: '#add8e6', borderRadius: "30%", border: '1px solid', margin: "2%" }}>
                <ListItem key={index} sx={{ margin: '0.5%' }}>
                  <ListItemText>{msg}</ListItemText>
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
        <Box display={'flex'} justifyContent={'center'} alignItems={'end'}  >
          <TextField
            label="Type your message"
            variant="standard"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
     
          />
          <Button
            variant="contained"
            sx={{ marginLeft: '5%' }}
            color="primary" onClick={sendMessage} >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
