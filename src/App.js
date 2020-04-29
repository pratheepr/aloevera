import React from 'react';
import { Switch, Route  } from 'react-router-dom';

import './App.css';


import InsertSql from './pages/insert-sql/insert-sql.component'; 
import SearchSql from './pages/search-sql/search-sql.component'
import SearchResultsTbl from './components/search-results-tbl/search-results-tbl.component';

import Header from './components/header/header.component';

class App extends React.Component {

  componentDidMount() {
    
  }

    render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={InsertSql} />
          <Route exact path='/insertsql' component={InsertSql} />
          <Route exact path='/selectsql' component={SearchSql} />
          <Route exact path='/sqltable' component={SearchResultsTbl} />

        </Switch>
      </div>
    );
  }
}
export default App;
