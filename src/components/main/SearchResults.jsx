import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { allUsersSelector } from '../../store/slices/usersSlice';
import { fromWei } from '../../services/ethService';
import { ipfsData } from '../../config';

function SearchResults({searchText, selectUser}) {

  const [isSearching, setIsSearching] = useState(true)
  const [filteredUsers, setFilteredUsers] = useState([])
  const allUsers = useSelector(allUsersSelector)

  const formatAddress = (address) => {
    return `${address.substring(0,5)}...${address.substring(address.length - 4, address.length)}`
  }

  useEffect(() => {
    if(allUsers.length > 0) {
      setIsSearching(true)
      const users = allUsers.filter((user) => user.name.toUpperCase().includes(searchText.toUpperCase()) || user.email.toUpperCase().includes(searchText.toUpperCase()) || user.userAddress.toUpperCase().includes(searchText.toUpperCase()))
      setFilteredUsers(users)
      setIsSearching(false)
    }
    // eslint-disable-next-line
  }, [searchText])
    
  const displayUsers = () => {
    const searchResults = document.getElementById('searchResults')
    searchResults.classList.remove('justify-content-center')
    searchResults.classList.remove('justify-content-start')

    if(filteredUsers.length === 0) {
      searchResults.classList.add('justify-content-center')
      return(
        <span style={{fontWeight: 'bold'}}>No se encontraron resultados.</span>
      )
    } else {
      searchResults.classList.add('justify-content-start')
      return (
        <>
          {filteredUsers.slice(0,10).map((user, index) => {
            return(
              <div key={index} className='search-element d-flex flex-row justify-content-start align-items-center' onClick={() => {selectUser(user)}}>
                <div className='bg-image bg-image-cover search-icon'>
                  <img alt={user.name} src={`${ipfsData.protocol}://${ipfsData.host}/ipfs/${user.profilePic}`}/>
                </div>
                <div className='d-flex flex-column justify-content-center align-items-start' style={{margin: '8px'}}>
                  <div style={{fontWeight: 'bold'}}>{user.name}</div>
                  <div className='text-muted d-flex flex-row justify-content-start align-items-center'>
                    <div style={{textAlign: 'start', width: '100px'}}>{formatAddress(user.userAddress)}</div>
                    <div>{fromWei(parseFloat(user.cost))} ETH</div>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )
    }
  }


  return (
      <div id='searchResults' className='search-results d-flex flex-column justify-content-start align-items-center'>
        {isSearching || allUsers.length === 0 ? <Spinner animation="grow" /> : displayUsers()}
      </div> 
  )
}

export default SearchResults
