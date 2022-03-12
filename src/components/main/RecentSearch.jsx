import { useState, useEffect } from 'react'
import { fromWei } from '../../services/ethService';
import { ipfsData } from '../../config';
import { Spinner } from 'react-bootstrap';


function RecentSearch({getRecentSearches, selectUser}) {

  const [recentSearches, setRecentSearches] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const formatAddress = (address) => {
    return `${address.substring(0,5)}...${address.substring(address.length - 4, address.length)}`
  }

  useEffect(() => {
    setRecentSearches(getRecentSearches())    
    setIsLoading(false)
    // eslint-disable-next-line
  }, [])

  const deleteAllRecents = () => {
    localStorage.removeItem('recentSearches')
    setRecentSearches({})
  }

  const removeRecentSearch = (event, userAddress) => {
    event.stopPropagation()
    
    const currentSearches = getRecentSearches()    

    if(currentSearches.hasOwnProperty(userAddress)) {
      delete currentSearches[userAddress]      
      localStorage.setItem('recentSearches', JSON.stringify(currentSearches))
      setRecentSearches(currentSearches)
    }
  }

  const displaySearches = () => {
    const searchResults = document.getElementById('searchResults')
    searchResults.classList.remove('justify-content-center')
    searchResults.classList.remove('justify-content-start')

    if(Object.values(recentSearches).length === 0) {
      searchResults.classList.add('justify-content-center')
      return(
        <span style={{fontWeight: 'bold'}}>No hay busquedas recientes.</span>
      )
    } else {
      searchResults.classList.add('justify-content-start')
      return (
        <>
          {Object.values(recentSearches).slice(0).reverse().slice(0,10).map((user, index) => {
            return(
              <div key={index} className='search-element d-flex flex-row justify-content-start align-items-center' onClick={(e) => {selectUser(e, user)}}>
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
                <div className='search-remove d-flex flex-row justify-content-center align-items-center' onClick={(e) => {removeRecentSearch(e, user.userAddress)}}>
                  <i className="bi bi-x-lg" />
                </div>
              </div>
            )
          })}
        </>
      )
    }
  }

  return (    
    <div className='search-results d-flex flex-column justify-content-start align-items-center'>
        <div className='search-header d-flex flex-row justify-content-between align-items-center'>
          <span>Recientes</span>
          <span style={{color: 'var(--bs-blue)', cursor: 'pointer'}} onClick={deleteAllRecents}>Borrar Todo</span>
        </div>
        <div id='searchResults' className='search-results d-flex flex-column justify-content-start align-items-center'>
          {isLoading ? <Spinner animation="grow" /> : displaySearches()}
        </div> 
    </div> 
  )
}

export default RecentSearch