import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { isConnectedSelector, setCurrentPage } from '../store/slices/statusSlice';
import { currentUserSelector, setSelectedUser } from '../store/slices/usersSlice';
import { walletDetectedSelector } from '../store/slices/ethSlice'
import { APP_PAGES } from '../config';
import { loadUserInfo } from '../services/usersService';
import useDapp from '../hooks/useLoadDapp';


import logo from '../img/decartLogoWhite.png'
import '../styles/NavBar.css'

function NavBar({setAppAlert}) {  

  const isConnected = useSelector(isConnectedSelector)
  const currentUser = useSelector(currentUserSelector)
  const walletDetected = useSelector(walletDetectedSelector)

  const {web3} = useDapp()

  const dispatch = useDispatch()

  const handleConnection = async () => {
    const { ethereum } = window
    const accounts = await ethereum.request({method: 'eth_requestAccounts'})
    
    if(web3 && accounts.length > 0 && accounts[0]) {
      loadUserInfo(web3, accounts[0], setAppAlert, dispatch)
    }
  }

  const getConnectBtn = () => {
    return(
      <div className='myNavBar-links'>
        <Button variant='primary' onClick={handleConnection}><i className='bi bi-wallet'></i>&nbsp;&nbsp;&nbsp;Connect</Button>
      </div>
    )
  }

  const handleLinkClick = (page) => {
    if(page === APP_PAGES.USER_FEED) {
      dispatch(setSelectedUser({...currentUser}))
    }

    dispatch(setCurrentPage(page))
  }

  const getLinks = () => {
    return(
      <div className='myNavBar-links'>
        <i className="bi bi-house-fill" onClick={() => {handleLinkClick(APP_PAGES.MAIN)}}></i>
        <i className="bi bi-person-fill" onClick={() => {handleLinkClick(APP_PAGES.USER_FEED)}}></i>
        <i className="bi bi-plus-circle-fill"></i>
      </div>
    )
  }

  return (
      <nav className='myNavBar-main'>
        <div className='myNavBar-element myNavBar-logo justify-content-start'>
            <img src={logo} alt='Decart' width={56} height={56}/>
            <h3>Decart</h3>
        </div>  
        <div className='myNavBar-element justify-content-end'>
          {isConnected && walletDetected && currentUser !== undefined ? getLinks() : <></>}
          {!isConnected && walletDetected ? getConnectBtn() : <></>}
        </div>        
      </nav>
  );
}

export default NavBar;
