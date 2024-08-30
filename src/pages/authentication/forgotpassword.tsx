import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/forgotpassword', { email });
      setMessage(response.data.message);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error details:', error.response.data);
        } else {
          console.error('Unexpected error:', error);
        }
      }
  };

  return (
    <div>
      <Typography variant="h5">Forgot Password</Typography>
      <Divider/>
      <form onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleInputChange}
          variant="outlined"
          label="Email Address"
          fullWidth
          required
        />
        <Divider/>
        <Button type="submit" variant="contained" color="primary">
          Send Reset Link
        </Button>
      </form>
      {message && <Typography variant="body2">{message}</Typography>}
    </div>
  );
};

export default ForgotPassword;
