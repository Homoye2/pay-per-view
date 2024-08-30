import { useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/resetpassword', {
        token,
        password,
        password_confirmation: confirmPassword,
      });
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while resetting your password.');
    }
  };

  return (
    <div>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handleInputChange}
          variant="outlined"
          label="New Password"
          fullWidth
          required
        />
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleInputChange}
          variant="outlined"
          label="Confirm Password"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
      </form>
      {message && <Typography variant="body2">{message}</Typography>}
    </div>
  );
};

export default ResetPassword;
