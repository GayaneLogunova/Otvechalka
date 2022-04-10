import React, { useState, useRef } from 'react';

import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { List, ListItem, ListItemText, ListSubheader, ListItemAvatar, Alert, Collapse } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import axios from 'axios';
import "./AddBook.css";


export const AddBook = () => {
  const inputFile = useRef(null);
  const [listOfFilesToUpload, changeListOfFilesToUpload] = useState([]);
  const [error, changeError] = useState("");
  const [isLoading, setIsLoading]= useState(false);

  const handleFileUpload = () => {
    let fd = new FormData();
    listOfFilesToUpload.forEach(file => {
      file[1]
        ? fd.append('private_files', file[0])
        : fd.append('public_files', file[0])
    });

    fd.append('user_name', localStorage.getItem("name"));
    setIsLoading(true);
    axios({
      method: "post",
      url: "/file/upload",
      data: fd,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(response => {
      if (response.data !== true) {
        console.log('response.data', response.data);
        changeError(`В данных файлах: ${response.data.map(el => el['filename']).join(', ')} - меньше 500 символов. Они не могут быть сохранены.`);
        console.log('data', response.data, response.data.map(el => el['filename']))
      }
      console.log('response', response.data);
      changeListOfFilesToUpload([]);
      setIsLoading(false);
      console.log('changedListOfFIlesToUpload');
    });
  };

  const loadFile = (e) => {
    changeListOfFilesToUpload([...listOfFilesToUpload, [e.target.files[0], true]]);
    console.log(e.target.files[0]);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const check = (index) => {
    changeListOfFilesToUpload([
      ...listOfFilesToUpload.slice(0, index),
      [listOfFilesToUpload[index][0], !listOfFilesToUpload[index][1]],
      ...listOfFilesToUpload.slice(index + 1),
    ]);
  };

  const deleteFile = (index) => {
    changeListOfFilesToUpload([
      ...listOfFilesToUpload.slice(0, index),
      ...listOfFilesToUpload.slice(index + 1),
    ]);
  };
    
  return (
    <div class="addBook">
      <div class="addBook_Error">
        <Collapse in={error}>
          <Alert onClose={() => {changeError("")}} severity="error"> {error} </Alert>
        </Collapse>
      </div>
      <div class="addBook__AddFile">
        <input
          style={{ display: "none" }}
          ref={inputFile}
          onChange={loadFile}
          type="file"
        />
        <div className="button" style={{display: 'flex', alignItems: 'center'}} onClick={onButtonClick}>
            <ControlPointIcon class="addBook__AddFile_Icon" />
            Добавить новую книгу
        </div>
      </div>
      <List>
        {listOfFilesToUpload.map((file, index) => 
          <ListItem>
            <ListItemAvatar>
              <InsertDriveFileIcon/>
            </ListItemAvatar>
            <ListItemText> {file[0].name} </ListItemText>
            <ListSubheader class="addBook_Subheader">
              <label>
                Приватный доступ
                <Checkbox checked={file[1]} onClick={() => check(index)}/>
              </label>
              <DeleteIcon onClick={() => deleteFile(index)}/>
            </ListSubheader>
          </ListItem>
        )}
      </List>
      <LoadingButton
        variant="contained"
        loading={isLoading}
        onClick={() => handleFileUpload()}
      > 
        Загрузить
      </LoadingButton>
    </div>
  );
};
