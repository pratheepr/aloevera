import React from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/firebase.utils'; 

import { ReactComponent as Logo } from '../assets/crown.svg';

import './header.styles.scss';

const Header = ( {currentUser } ) => (
  <div className='header'>
      <Link className='logo-container' to='/'>
        <Logo className='logo' />
      </Link>
      <div className='display-name'>
        HelloDude
      </div>

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
