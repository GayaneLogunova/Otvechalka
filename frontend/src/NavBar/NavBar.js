import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';

import {
    Box,
    Drawer,
    CssBaseline,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Avatar,
    AppBar,
    Button
} from '@mui/material';

import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { deepPurple } from '@mui/material/colors';

import axios from 'axios';
import "./NavBar.css";

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontSize: 30,
    fontWeight: 100
  }
}));

export default function NavBar({isAuthorised, changeIsAuthorised}) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const hrefs = ["/library", "/add_book"];
    const tabs = isAuthorised ? ['Библиотека', 'Загрузить новый файл'] : ['Библиотека'];
    const history = useHistory();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const logout = () => {
        console.log('logout');
        axios.post('auth/logout').then((response) => {
                if (response.data.status) {
                    localStorage.setItem('opendeFile', '');
                    localStorage.setItem("authToken", false);
                    changeIsAuthorised(false);
                    window.location.reload();
                }
            }
        );
        history.push('\login');
    };

    console.log('localStorage', localStorage.getItem('name'));
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar open={open} class="navBar">
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography sx={{ color: "rgba(0, 0, 0, 0.54)" }} className={classes.title}> Отвечалка </Typography>
                    {!isAuthorised ?
                        <>        
                            <Link href="/login" style={{ marginRight: '12px' }}> <LoginIcon/> </Link>
                        </>
                        :
                        <>  
                            <Avatar sx={{ bgcolor: deepPurple[500], marginRight: "12px" }}> { localStorage.getItem("name")[0] } </Avatar>
                            <Button onClick={logout}> <LogoutIcon/> </Button>
                        </>
                    }
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <List>
                    {tabs.map((text, index) => (
                        <Link href={hrefs[index]}>
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <MenuBookIcon /> : <LibraryAddIcon /> }
                                </ListItemIcon>
                                <ListItemText primary={text} style={{color: 'black'}}/>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
