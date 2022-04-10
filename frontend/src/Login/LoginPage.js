import React, { useState } from 'react';
import { useHistory } from 'react-router';
import './LoginPage.css';

import {
    Alert,
    Collapse,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container
} from "@mui/material";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios';


export const LoginPage = ({changeIsAuthorised}) => {
    const [status, setStatus] = useState(false);

    const history = useHistory();
    const theme = createTheme();
      
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post("/auth/login", { "login": data.get('email'), "password": data.get('password') }
        ).then(
            (result) => {
                if (result.data.status) {
                    localStorage.setItem("authToken", true);
                    localStorage.setItem("name", data.get('email'));
                    changeIsAuthorised(true);
                    history.push("/library");
                } else {
                    setStatus(true);
                }
            }
        );
    };

    return (
        <div>
            <div class="loginPage_error">
                <Collapse in={status}>
                    <Alert onClose={() => { setStatus(false) }} severity="error"> Неверное имя пользователя или пароль </Alert>
                </Collapse>
            </div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Войти
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Имя пользователя"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Войти
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/registration" variant="body2">
                                        {"Нет аккаунта? Зарегистрироваться."}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );
}