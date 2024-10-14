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
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

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
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar los mensajes de error

  const { authenticateUser } = useAuth(); // Traemos el método del contexto

  // Alternar visibilidad de la contraseña
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Controlar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple para campos vacíos
    if (!username || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    // Autenticar usuario
    const { user, error } = await authenticateUser(username, password);

    if (error) {
      setErrorMessage(error); // Mostramos el error si la autenticación falla
      console.log('Error:', error); // Debug por consola
    } else if (user) {
      setErrorMessage(''); // Limpiamos los errores si autenticamos correctamente
      router.push("/dashboard")
      console.log('Usuario autenticado:', user); // Debug del usuario autenticado
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el correo de recuperación');
      }

      Swal.fire('¡Hecho!', 'Hemos enviado un correo de recuperación a tu email', 'success');
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="xs"
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
              padding: 3,
              width: '100%',
              borderRadius: '12px',
            }}
          >
            <Typography
              variant="h5"
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
                margin="dense"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                error={!!errorMessage && !username} // Mostrar error si no hay username
                helperText={!!errorMessage && !username ? 'El campo de usuario es obligatorio' : ''}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                margin="dense"
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
                error={!!errorMessage && !password} // Mostrar error si no hay password
                helperText={!!errorMessage && !password ? 'El campo de contraseña es obligatorio' : ''}
              />

              {errorMessage && ( // Mostrar mensaje de error global
                <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>
                  {errorMessage}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 1,
                  padding: '10px',
                  backgroundColor: '#1a73e8',
                  '&:hover': {
                    backgroundColor: '#1765c0',
                  },
                  borderRadius: '10px',
                }}
              >
                Iniciar Sesión
              </Button>

              {/* <Typography variant="body2" align="center" sx={{ mt: 1, color: '#aaa' }}>
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
            */}

              <Typography variant="body2" align="center" sx={{ mt: 1, color: '#aaa' }}>
                ¿Olvidó su contraseña?{' '}
                <a
                  href="#"
                  onClick={() => {
                    Swal.fire({
                      title: 'Recuperar contraseña',
                      input: 'email',
                      inputLabel: 'Introduce tu correo electrónico',
                      inputPlaceholder: 'Correo electrónico',
                      showCancelButton: true,
                      confirmButtonText: 'Enviar',
                      preConfirm: (email) => {
                        if (!email) {
                          Swal.showValidationMessage('El correo no puede estar vacío');
                        } else {
                          handlePasswordReset(email);
                        }
                      },
                    });
                  }}
                  style={{
                    color: '#1a73e8',
                    textDecoration: 'none',
                  }}
                >
                  Recuperar
                </a>
              </Typography>

            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Login;