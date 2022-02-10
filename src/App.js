import { useEffect, useState } from 'react';
import { displayAlert } from './components/helpers';
import NavBar from './components/NavBar';

import './App.css';

function App() {
  const [isMetamask, setIsMetamask] = useState(false)
  const [showAlert, setShowAlert] = useState({show: false, text: '', link: '', linkText: ''})

  const detectMetamask = () => {    
    if(window.ethereum) {
      setIsMetamask(true)
    } else {
      setShowAlert({show: true, link: 'https://metamask.io/download', linkText: 'MetaMask', text: 'Por favor descarga un wallet para ETH. Recomendamos '})      
    }
  }  

  useEffect(() => {        
    detectMetamask()
  }, []) 
  
  return (
    <div className="App">
      <NavBar isMetamask={isMetamask}/>
      <main>
        {showAlert.show ? displayAlert('danger', showAlert.text, showAlert.link, showAlert.linkText) : <></>}
      </main>
    </div>
  );
}

export default App;
