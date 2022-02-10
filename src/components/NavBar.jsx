import React from 'react';
import { Button } from 'react-bootstrap';

import logo from '../img/decartLogoWhite.png'
import '../styles/NavBar.css'

function NavBar() {
    return (
        <div className='myNavBar-main'>
          <div className='myNavBar-element myNavBar-logo'>
              <img src={logo} alt='Decart' width={56} height={56}/>
              <h3>Decart</h3>
          </div>  
          <div className='myNavBar-element'>
            <div className='myNavBar-links'>
              <i class="bi bi-house-fill"></i>
              <i class="bi bi-person-fill"></i>
              <i class="bi bi-plus-circle-fill"></i>
            </div>
            <div className='myNavBar-links'>
              <Button variant='primary'>Conectar</Button>
            </div>
          </div>        
        </div>
    );
}

export default NavBar;
