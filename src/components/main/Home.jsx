import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '../../services/usersService'
import { currentPageSelector } from '../../store/slices/statusSlice'
import { APP_PAGES } from '../../config'
import Register from './Register';
import Main from './Main'
import { Spinner } from 'react-bootstrap';

function Home({account, usersContract}) {
  const currentPage = useSelector(currentPageSelector)
  const dispatch = useDispatch()
  
  useEffect( () => {
    getCurrentUser(account, usersContract, dispatch)
    // eslint-disable-next-line
  }, [])  

  const getPage = () => {
    switch (currentPage) {
      case APP_PAGES.REGISTER:
        return(<Register />)    
      case APP_PAGES.MAIN:
        return(<Main />)
      default:
        return(<Spinner animation="grow" />);
    }
  }
  
  return (
    <div className='fill-view d-flex flex-column justify-content-center align-items-center'>      
      {getPage()}
    </div>
  )
}

export default Home