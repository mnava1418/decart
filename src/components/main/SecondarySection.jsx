import { useSelector } from 'react-redux'
import { Card, Button, Spinner } from 'react-bootstrap'
import UserProfile from './UserProfile'
import { currentUserSelector } from '../../store/slices/usersSlice'
import { PROFILE_ACTIONS } from '../../config'
import { fromWei } from '../../services/ethService'

function SecondarySection() {
  const currentUser = useSelector(currentUserSelector)

  const getInfo = () => {
    return (
      <div className='main-secondary-section'>
        <UserProfile 
          name={currentUser.name}
          address={currentUser.userAddress}
          email={currentUser.email}
          posts={parseFloat(currentUser.posts)}
          followers={parseFloat(currentUser.followers)}
          followings={parseFloat(currentUser.followers)}
          cost={fromWei(parseFloat(currentUser.cost))}
          editable={true}
          action={PROFILE_ACTIONS.UPDATE}        
        />
        <Card className='main-element' style={{ width: '18rem' }}>          
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
        <Card className='main-element' style={{ width: '18rem' }}>          
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </div>
    )
  }

  return (
    <>
    {currentUser ? getInfo() : <Spinner animation="grow" /> }
    </>
  )
}

export default SecondarySection