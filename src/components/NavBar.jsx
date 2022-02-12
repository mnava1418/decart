import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { isConnectedSelector, setIsConnected } from '../store/slices/statusSlice';

import logo from '../img/decartLogoWhite.png'
import '../styles/NavBar.css'

function NavBar() {  

  const isConnected = useSelector(isConnectedSelector)
  const dispatch = useDispatch()

  const handleConnection = async () => {
    const { ethereum } = window
    const accounts = await ethereum.request({method: 'eth_requestAccounts'})
    
    if(accounts.length > 0 && accounts[0]) {
      dispatch(setIsConnected(true))
    }    
  }

  const getConnectBtn = () => {
    return(
      <div className='myNavBar-links'>
        <Button variant='primary' onClick={handleConnection}>Conectar</Button>
      </div>
    )
  }

  const getLinks = () => {
    return(
      <div className='myNavBar-links'>
        <i className="bi bi-house-fill"></i>
        <i className="bi bi-person-fill"></i>
        <i className="bi bi-plus-circle-fill"></i>
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
          {isConnected ? getLinks() : <></>}
          {!isConnected ? getConnectBtn() : <></>}
        </div>        
      </div>
  );
}

export default NavBar;
