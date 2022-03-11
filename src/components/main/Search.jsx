import { useState, useEffect } from 'react'
import {Form, InputGroup} from 'react-bootstrap'
import RecentSearch from './RecentSearch'
import SearchResults from './SearchResults'

import '../../styles/Search.css'

function Search() {
    useEffect(() => {
        const listener = event => {
            if(event.code === 'Escape' || event.code === 'Esc') {
                showResultsContainer('none')
            }
        }

        document.addEventListener('keydown', listener)

        return () => {      
            document.removeEventListener('keydown', listener)
        }
    })

    const [searchText, setSearchText] = useState('')

    const showResultsContainer = (display) => {
        document.getElementById('resultsContainer').style.display = display        
    } 

    const performSearch = () => {
        showResultsContainer('flex')
        setSearchText(document.getElementById('searchInput').value.trim())
    }

    const getRecentSearches = () => {
        const recentSearches = localStorage.getItem('recentSearches')
    
        if(recentSearches === undefined || recentSearches === null) {
          return({})
        } else {
           return(JSON.parse(recentSearches))
        }
    }

    const selectUser = (selectedUser) => {
        const recentSearches = getRecentSearches()
        recentSearches[selectedUser.userAddress] = selectedUser
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches))
    }
    
    return (
        <div className='search-container d-flex flex-column justify-content-start align-items-center'>
            <div className='d-flex flex-row justify-content-center' style={{width: '100%'}}>
                <Form.Control id='searchInput' type="text"  placeholder='Search...' onFocus={() => {showResultsContainer('flex')}} onChange={performSearch}/>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            </div>                
            <div id='resultsContainer' className='search-results-container flex-column justify-content-start align-items-center'>                    
                <div className='search-pin' />
                {searchText.length === 0 ? <RecentSearch /> : <SearchResults searchText={searchText} selectUser={selectUser} />}
            </div>
        </div>
    )
}

export default Search