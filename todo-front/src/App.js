import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Menu,
  MenuItem,
  Grid,
  Stack,
  Paper,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState('');
  const [updatedTodoText, setUpdatedTodoText] = useState('');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/todos');
      setTodos(response.data.todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleCreateTodo = async () => {
    try {
      await axios.post('http://localhost:3001/todos', { todo: newTodo });
      fetchTodos();
      setNewTodo('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdateTodo = (id) => {
    setUpdateModalOpen(true);
    setSelectedTodoId(id);
  };

  const handleModalClose = () => {
    setUpdateModalOpen(false);
    setLoginModalOpen(false);
    setSignupModalOpen(false);
    setSelectedTodoId('');
    setUpdatedTodoText('');
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', passwordConfirm: '' });
    setAnchorEl(null);
  };

  const handleModalUpdate = async () => {
    try {
      await axios.patch(`http://localhost:3001/todos/${selectedTodoId}`, { todo: updatedTodoText });
      fetchTodos();
      handleModalClose();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', loginData);
      const token = response.data.token;

      localStorage.setItem('jwtToken', token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setIsLoggedIn(true);
      setShowAlert(true);
      handleModalClose();
      fetchTodos();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/signup', signupData);
      const token = response.data.token;

      localStorage.setItem('jwtToken', token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setIsLoggedIn(true);
      setShowAlert(true);
      handleModalClose();
      fetchTodos();
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    // delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Todo App</Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            {isLoggedIn ? (
              <>
                <IconButton color="inherit" onClick={handleMenuClick}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => setLoginModalOpen(true)}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => setSignupModalOpen(true)}>
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth='sm' sx={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '1rem',
        marginTop: '2rem',
        boxShadow: '0 0 2rem #00000022',
      }}>

        <TextField
          fullWidth
          size='small'
          disabled={!isLoggedIn}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleCreateTodo}
                  disabled={!isLoggedIn}>

                  <AddIcon color='primary' />
                </IconButton>
              </InputAdornment>
            ),
          }}

          label="Enter New Task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          variant="outlined"
        />
       
      </Container>
      <Container component={Paper} maxWidth="sm" sx={{
        marginTop: '2rem',
        padding: '1rem',
        borderRadius: '1rem',
        boxShadow: '0 0 2rem #00000022'
      }}>


        <List >
          {todos.length == 0? <Typography variant='h6'>All wrapped up! You can have a good rest now :)</Typography> :todos.map((todo) => (
            <ListItem key={todo._id} sx={{ border: '1px solid #ccc', borderRadius: '8px', margin: '0.5rem 0' }}>
              <ListItemText primary={todo.todo} />
              <IconButton color="secondary" onClick={() => handleDeleteTodo(todo._id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton color="primary" onClick={() => handleUpdateTodo(todo._id)}>
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Dialog open={isUpdateModalOpen} onClose={handleModalClose}>
          <DialogTitle>Update Todo</DialogTitle>
          <DialogContent>
            <TextField sx={{marginTop: '1em'}}
              fullWidth
              label="Enter Todo"
              value={updatedTodoText}
              onChange={(e) => setUpdatedTodoText(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleModalUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isLoginModalOpen} onClose={handleModalClose}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              variant="outlined"
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleLogin} color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isSignupModalOpen} onClose={handleModalClose}>
          <DialogTitle>Signup</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={signupData.passwordConfirm}
              onChange={(e) => setSignupData({ ...signupData, passwordConfirm: e.target.value })}
              variant="outlined"
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSignup} color="primary">
              Signup
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          message="Successfully Logged In or Signed Up!"
        />
      </Container >
    </>
  );
};

function App() {
  return (
    <div className="App">
      <TodoApp />
    </div>
  );
}

export default App;
