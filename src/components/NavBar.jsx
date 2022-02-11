import React from 'react';
import { Button } from 'react-bootstrap';

import logo from '../img/decartLogoWhite.png'
import '../styles/NavBar.css'

function NavBar({isWallet}) {
  const getConnectBtn = () => {
    return(
      <div className='myNavBar-links'>
        <Button variant='primary'>Conectar</Button>
      </div>
    )
  }

  return (
      <div className='myNavBar-main'>
        <div className='myNavBar-element myNavBar-logo'>
            <img src={logo} alt='Decart' width={56} height={56}/>
            <h3>Decart</h3>
        </div>  
        <div className='myNavBar-element'>
          <div className='myNavBar-links'>
            <i className="bi bi-house-fill"></i>
            <i className="bi bi-person-fill"></i>
            <i className="bi bi-plus-circle-fill"></i>
          </div>
          {isWallet ? getConnectBtn() : <></>}
        </div>        
      </div>
  );
}

export default NavBar;
