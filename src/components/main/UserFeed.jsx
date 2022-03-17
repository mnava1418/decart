import { useSelector } from 'react-redux'
import { currentUserSelector, selectedUserSelector } from '../../store/slices/usersSlice'
import { Spinner } from 'react-bootstrap'
import UserData from './UserData'

import '../../styles/UserFeed.css'

function UserFeed() {
  const selectedUser = useSelector(selectedUserSelector)  
  const currentUser = useSelector(currentUserSelector)
  
  const generateUserFeed = () => {
    return(
      <div className='d-flex flex-column justify-content-start align-items-center user-feed-container'>
        <UserData selectedUser={selectedUser} currentUser={currentUser}/>
      </div>
    )
  }

  return (
    <>
      {!selectedUser ? <Spinner animation="grow" /> : generateUserFeed()}
    </>    
  )
}

export default UserFeed