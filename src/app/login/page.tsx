'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Definimos el tema oscuro con Material UI
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1a73e8', // Color azul estilo Google
    },
    background: {
      default: '#121212', // Fondo oscuro
      paper: '#1e1e1e', // Color de la tarjeta (Paper)
    },
    text: {
      primary: '#fff', // Texto en blanco
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Alternar visibilidad de la contraseña
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Controlar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Aquí podrías agregar lógica para autenticar al usuario
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="xs" // Ajustamos el tamaño máximo a 'xs' para hacer el formulario más pequeño
        sx={{
          display: 'flex',
          height: '70vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 3, // Reducimos el padding
            width: '100%',
            borderRadius: '12px',
          }}
        >
          <Typography
            variant="h5" // Hacemos el título más pequeño
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            Iniciar Sesión
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              margin="dense" // Usamos 'dense' para hacer el campo más compacto
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{
                style: { color: '#fff' }, // Estilo del label en modo oscuro
              }}
              InputProps={{
                style: { color: '#fff' }, // Estilo del input en modo oscuro
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              margin="dense" // Compactamos también este input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{
                style: { color: '#fff' },
              }}
              InputProps={{
                style: { color: '#fff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      sx={{ color: '#fff' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 1,
                padding: '10px', // Reducimos el padding del botón
                backgroundColor: '#1a73e8',
                '&:hover': {
                  backgroundColor: '#1765c0',
                },
                borderRadius: '10px',
              }}
            >
              Iniciar Sesión
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 1, color: '#aaa' }}>
              ¿No tienes cuenta?{' '}
              <a
                href="#"
                style={{
                  color: '#1a73e8',
                  textDecoration: 'none',
                }}
              >
                Regístrate
              </a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;