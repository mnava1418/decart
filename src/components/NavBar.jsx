import React from 'react';
import { Button } from 'react-bootstrap';

import logo from '../img/decartLogoWhite.png'
import '../styles/NavBar.css'

function NavBar() {
    return (
        <div className='myNavBar-main'>
          <div className='myNavBar-logo'>
              <img src={logo} alt='Decart' width={56} height={56}/>
              <h3>Decart</h3>
          </div>          
          <div>
            <Button variant='primary'>Conectar</Button>
          </div>
        </div>
    );
}

export default NavBar;
