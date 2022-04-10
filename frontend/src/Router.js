import React from 'react';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import { LoginPage } from './Login/LoginPage';
import { AddBook } from './MainPage/AddBook';
import { Library } from './MainPage/Library';
import { RegistartionPage } from './Registration/RegistartionPage';
import { AnswerPage } from './MainPage/AnswerPage';

export function Routers({ changeIsAuthorised, filepath, changeFilepath }) {
    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/library" />
                    </Route>
                    <Route exact path="/registration">
                        <RegistartionPage />
                    </Route>
                    <Route exact path="/login">
                        <LoginPage changeIsAuthorised={changeIsAuthorised} />
                    </Route>
                    <Route exact path="/library">
                        <Library changeFilepath={changeFilepath} />
                    </Route>
                    <Route exact path="/add_book">
                        <AddBook />
                    </Route>
                    <Route exact path="/answer">
                        <AnswerPage filepath={filepath} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
};