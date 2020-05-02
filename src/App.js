import React from 'react';
import { Switch, Route  } from 'react-router-dom';

import './App.css';


import InsertSql from './pages/insert-sql/insert-sql.component'; 
import SearchSql from './pages/search-sql/search-sql.component'
import SearchResultsTbl from './components/search-results-tbl/search-results-tbl.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component'; 

import Header from './components/header/header.component';
import {auth, createUserProfileDocument} from './firebase/firebase.utils'; 

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      currentUser:null 
    }

  }

  unsubscribeFromAuth = null ;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {

      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          //console.log(snapShot.data());
          this.setState({ 
              currentUser: {
                id: snapShot.id,
                ...snapShot.data()
              }
            });
        });
      }

      this.setState({ currentUser: userAuth });
    });

  }

  componentWillUnmount() {
    this.unsubscribeFromAuth(); 
  }

    render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path='/' component={InsertSql} />
          <Route exact path='/signin' component={SignInAndSignUpPage} />
          <Route exact path='/insertsql' component={InsertSql} />
          <Route exact path='/selectsql' component={SearchSql} />
          <Route exact path='/sqltable' component={SearchResultsTbl} />

        </Switch>
      </div>
    );
  }
}
export default App;
