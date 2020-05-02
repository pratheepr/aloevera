import React from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/firebase.utils'; 

import './header.styles.scss';

const Header = ( {currentUser } ) => (
  <div className='header'>
      <div className='options'>
        <Link className='option' to='/'>
          Home
        </Link>

        <Link className='option' to='/insertsql'>
        Insert Sql
        </Link>

        <Link className='option' to='/selectsql'>
            Select Sql
        </Link>
        {
          currentUser ?
          <div className='option' onClick={() => auth.signOut()}> Sign Out</div>
          :
          <Link className='option' to='/signin'>
            Sign In
          </Link>
        }
      </div>
  </div>
);

export default Header;
