import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { TabPanel } from "./TabPanel";

import { styled } from '@mui/material/styles';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListSubheader,
    Avatar,
    TextField,
    Tabs,
    Tab,
    Box
} from '@mui/material';

import SearchIcon from '@material-ui/icons/Search';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

import axios from 'axios';
import "./Library.css";

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const Library = ({ changeFilepath }) => {
    const [dense] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [search, changeSearch] = useState("");
    const [publicFilenames, changePublicFilenames] = useState([]);
    const [privateFilenames, changePrivateFilenames] = useState([]);
    const history = useHistory();

    let files = [publicFilenames, privateFilenames, [...privateFilenames, ...publicFilenames]];

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const getPublicFileNames = () => {
        axios.get('/file/get_all_public').then((response) => {
            changePublicFilenames(response.data);
        });
    };
    
    const getPrivateFileNames = () => {
        axios({
            method: 'get',
            url: "/file/get_all_private",
            params: { "username" : localStorage.getItem("name") },
        }).then((response) => {
            changePrivateFilenames(response.data);
        });
    };

    const selectFile = (file) => {
        if (file.publisher) {
            const ind = file.filename.lastIndexOf('.');
            const path = `library/public/${file.filename.substring(0, ind)}__${file.publisher}__${file.filename.substring(ind)}`;
            changeFilepath(path);
            localStorage.setItem("openedFile", path);
        } else {
            const path = `library/private/${localStorage.getItem("name")}/${file.filename}`;
            changeFilepath(path);
            localStorage.setItem("openedFile", path);
        }

        history.push('/answer');

    }

    const contains = (file) => {
        if (file.filename.toLowerCase().includes(search.toLowerCase())
            || file.publisher?.toLowerCase().includes(search.toLowerCase())){
                return true
            }
        return false
    }

    useEffect(() => {
        getPublicFileNames();
        if (localStorage.getItem("name")) {
            getPrivateFileNames();
        }
        localStorage.setItem('opendeFile', '');
    }, []);

    return (
        <div class="library">
            <div class="library__autocompleteContainer">
                <TextField
                    id="outlined-basic"
                    style={{ width: '30%' }}
                    label="Фильтрация"
                    variant="outlined"
                    onChange={(e) => changeSearch(e.target.value)}
                />
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Публичные" {...a11yProps(1)} />
                    {localStorage.getItem("authToken") === 'true' &&
                        <Tab label="Персональные" {...a11yProps(0)} />
                    }
                    {localStorage.getItem("authToken") === 'true' &&
                        <Tab label="Все" {...a11yProps(2)} />
                    }
                </Tabs>
            </Box>
            <Demo>
                {files.map((files, index) => 
                    <TabPanel value={value} index={index}>
                        <List dense={dense}>
                            {files.filter(file => contains(file)).map(file => 
                                <ListItem onClick={() => selectFile(file)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <InsertDriveFileIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={file.filename}
                                        secondary={file.publisher ? file.publisher : null}
                                        onClick={() => console.log(1)}
                                    />
                                    <ListSubheader class="addBook_Subheader">
                                        <SearchIcon />
                                        <label>
                                            Задать вопрос по тексту
                                        </label>
                                    </ListSubheader>
                                </ListItem>    
                            )}
                        </List>
                    </TabPanel>
                )}
           </Demo>
        </div>
    )
};