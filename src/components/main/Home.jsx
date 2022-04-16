import { useSelector } from 'react-redux';
import { currentPageSelector } from '../../store/slices/statusSlice'
import { APP_PAGES } from '../../config'
import Main from './Main'
import UserFeed from './UserFeed';
import { Spinner } from 'react-bootstrap';
import Landing from '../landing/Landing';

import '../../styles/Main.css'

function Home() {
  const currentPage = useSelector(currentPageSelector)
  
  const getPage = () => {
    switch (currentPage) {      
      case APP_PAGES.MAIN:
        return(<Main />)
      case APP_PAGES.USER_FEED:
        return(<UserFeed />)
      case APP_PAGES.LANDING:
        return(<Landing />)
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