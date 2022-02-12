import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayAlert } from './components/helpers';
import NavBar from './components/NavBar';
import { isConnectedSelector } from './store/slices/statusSlice';
import Home from './components/home/Home';
import Main from './components/main/Main';
import { detectETHWallet } from './services/ethService';
import useDapp from './hooks/useLoadDapp';

import './App.css';

function App() {
  const [showAlert, setShowAlert] = useState({show: false, text: '', link: '', linkText: ''})
  const isConnected = useSelector(isConnectedSelector)  
  const {account, dappLoaded, usersContract} = useDapp()

  const dispatch = useDispatch()  
  
  useEffect(() => {
    detectETHWallet(setShowAlert, dispatch)
  }, [dispatch, isConnected])

  const loadApp = () => {
    if(isConnected && dappLoaded) {
      return(<Main account={account} usersContract={usersContract} />)
    } else {
      return(<Home />)
    }
  }
  
  return (
    <div className="App">
      <NavBar />
      <main>
        {showAlert.show ? displayAlert('danger', showAlert.text, showAlert.link, showAlert.linkText) : <></>}
        {loadApp()}
      </main>
    </div>
  );
}

export default App;
