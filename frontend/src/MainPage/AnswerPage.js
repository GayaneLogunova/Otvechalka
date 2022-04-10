import React, { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import { TextField, Alert, Collapse, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Card } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

import axios from 'axios';

import "./AnswerPage.css";

export const AnswerPage = ({ filepath }) => {
    const [isLoading, setIsLoading]= useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState({});
    const [error, setError] = useState('');

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const file = localStorage.getItem('openedFile');
    const ind = file.lastIndexOf('/');
    const filename = file.substring(ind + 1);
    const url = file.includes('private')
        ? `/file/get_private/${localStorage.getItem("name")}/${filename}`
        : `/file/get_public/${filename}`;

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }
      
    function previousPage() {
        changePage(-1);
    }
    
    function nextPage() {
        changePage(1);
    }

    const parseAnswers = (response) => {
        console.log('data', response);
        setAnswer(response);
        Object.entries(response).map((key) => {
            console.log('key', key[0], 'val', key[1]);
        })
    }

    const sendQuestion = () => {
        if (question.length > 0) {
            setError("");
            if (question.charAt(question.length - 1) !== "?") setQuestion(`${question}?`)
            setIsLoading(true);
            const name = file.includes('private')
                ? `private/${localStorage.getItem("name")}/${filename}`
                : `public/${filename}`;
            axios.post("/question/send", { "question": question, "filename": name }
            ).then((response) => parseAnswers(response.data["answer"]));
            setIsLoading(false);
        } else {
            setError("Поле для вопроса не заполнено.");
            console.log(123456, error);
        }
    }

    return (
        <div class="answerPage">
            <div class="answerPage_Error">
                <Collapse in={error}>
                    <Alert onClose={() => {setError("")}} severity="error"> {error} </Alert>
                </Collapse>
            </div>
            <div class="answerPage_questionContainer">
                <label class="answerPage_questionInput">
                    <TextField
                        label="Вопрос"
                        id="outlined-multiline-static"
                        multiline
                        rows={4}
                        onChange={(e) => setQuestion(e.target.value)}
                        value={question}
                    />
                </label>
                <LoadingButton
                    variant="outlined"
                    onClick={sendQuestion}
                    loading={isLoading}
                    style={{ marginBottom: '24px' }}
                >
                    Задать вопрос
                </LoadingButton>
                <TableContainer component={Card} variant="outlined">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Ответ</TableCell>
                            <TableCell align="right">Вероятность</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {Object.entries(answer).map((row) => 
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row[0]}</TableCell>
                                <TableCell align="right">{row[1]}</TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <div>
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                <div class="answerPage_displayButtonsContainer">
                    <div className="pagec">
                        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                    </div>
                    <div className="buttonc">
                        <button
                            type="button"
                            disabled={pageNumber <= 1}
                            onClick={previousPage}
                            className="Pre"  
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={pageNumber >= numPages}
                            onClick={nextPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};