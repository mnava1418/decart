import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { allUsersSelector } from '../../store/slices/usersSlice';

function SearchResults({searchText}) {

  const [isSearching, setIsSearching] = useState(true)
  const [filteredUsers, setFilteredUsers] = useState([])
  const allUsers = useSelector(allUsersSelector)

  useEffect(() => {
    if(allUsers.length > 0) {
      setIsSearching(true)
      const users = allUsers.filter((user) => user.name.toUpperCase().includes(searchText.toUpperCase()) || user.email.toUpperCase().includes(searchText.toUpperCase()) || user.userAddress.toUpperCase().includes(searchText.toUpperCase()))
      setFilteredUsers(users)
      setIsSearching(false)
    }
  }, [searchText])
    
  const displayUsers = () => {
    if(filteredUsers.length === 0) {
      return(
        <>No se encontraron resultados.</>
      )
    } else {

      return (
        <>
          {filteredUsers.map((user, index) => {
            return(<div key={index}>{`${user.name}`}</div>)
          })}
        </>
      )
    }
  }


  return (
      <div id='searchResults' className='search-results d-flex flex-column justify-content-center align-items-center'>
        {isSearching || allUsers.length === 0 ? <Spinner animation="grow" /> : displayUsers()}
      </div> 
  )
}

export default SearchResults
