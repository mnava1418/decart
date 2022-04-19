import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { displayAlert } from './components/helpers';
import NavBar from './components/NavBar';
import { loadDappData } from './services/ethService';
import Home from './components/main/Home';
import useAlert from './hooks/useAlert';

import './App.css';

function Root() {
  const {appAlert, setAppAlert} = useAlert()  
  const dispatch = useDispatch()
  
  useEffect(() => {
    loadDappData(dispatch, setAppAlert)
    // eslint-disable-next-line
  }, [])
  
  return (
    <div className="App">
      <NavBar setAppAlert={setAppAlert}/>
      <main className='fill-view'>
        {appAlert.show ? displayAlert('danger', appAlert.text, appAlert.link, appAlert.linkText) : <></>}
        <Home />
      </main>
    </div>
  );
}

export default Root;
