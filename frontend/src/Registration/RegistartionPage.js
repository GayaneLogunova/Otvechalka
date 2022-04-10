import React, { useState } from 'react';
import { useHistory } from 'react-router';
import './RegistartionPage.css';

import {
    Box,
    Link,
    Grid,
    Alert,
    Collapse,
    Container,
    TextField,
    Typography,
    CssBaseline,
} from "@mui/material";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios';

export const RegistartionPage = () => {
    const history = useHistory();
    const theme = createTheme();
    const [error, changeError] = useState("");
      
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post("/auth/registration", {"login": data.get('email'), "password": data.get('password')}
        ).then((result) => {
            if (result.data.status) {
                history.push("/login")
            } else {
                changeError(`Имя пользователя ${data.get('email')} уже существует.`);
            } 
        });
    };

    return (
        <>               
            <div style={{ position: "absolute", right: "10px" }}>
                <Collapse in={error}>
                    <Alert onClose={() => {changeError("")}} severity="error"> {error} </Alert>
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
                            Зарегистрироваться
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
                                Зарегистрироваться
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        {"Уже есть аккаунт? Войти."}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}