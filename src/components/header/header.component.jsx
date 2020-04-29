import React from 'react';
import { Link } from 'react-router-dom';

import './header.styles.scss';

const Header = () => (
  <div className='header'>
      <div className='options'>
        <Link className='option' to='/'>
          <h3>Home</h3>
        </Link>

        <Link className='option' to='/insertsql'>
        <h3>Insert Sql</h3>
        </Link>

        <Link className='option' to='/selectsql'>
            <h3>Select Sql</h3>
        </Link>
      </div>
  </div>
);

export default Header;
