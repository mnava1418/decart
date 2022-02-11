import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayAlert } from './components/helpers';
import NavBar from './components/NavBar';
import { currentPageSelector } from './store/slices/statusSlice';
import { APP_PAGES } from './config'
import Home from './components/home/Home';
import Main from './components/main/Main';
import { detectETHWallet } from './services/ethService';

import './App.css';

function App() {
  const [isWallet, setIsWallet] = useState(false)
  const [showAlert, setShowAlert] = useState({show: false, text: '', link: '', linkText: ''})
  const currentPage = useSelector(currentPageSelector) 
  const dispatch = useDispatch()
  
  useEffect(() => {            
    detectETHWallet(setIsWallet, setShowAlert, dispatch)
  }, [dispatch])

  const getCurrentPage = () => {
      switch (currentPage) {
        case APP_PAGES.HOME:
          return(<Home />)
        case APP_PAGES.MAIN:
          return(<Main />)
        default:
          return(<Main />);
      }
  }
  
  return (
    <div className="App">
      <NavBar isWallet={isWallet}/>
      <main>
        {showAlert.show ? displayAlert('danger', showAlert.text, showAlert.link, showAlert.linkText) : <></>}
        {getCurrentPage()}
      </main>
    </div>
  );
}

export default App;
