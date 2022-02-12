import { useEffect } from 'react';
import { getCurrentUser } from '../../services/usersService'

function Main({account, usersContract}) {
    
  useEffect( () => {
    getCurrentUser(account, usersContract)
    // eslint-disable-next-line
  }, [])  
  
  return (
    <div>Este va a ser el main</div>
  )
}

export default Main