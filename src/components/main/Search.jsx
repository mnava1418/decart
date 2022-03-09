import { useState } from 'react'
import {Form, InputGroup} from 'react-bootstrap'
import RecentSearch from './RecentSearch'
import SearchResults from './SearchResults'

import '../../styles/Search.css'

function Search() {
    const [searchText, setSearchText] = useState('')

    const showResultsContainer = (display) => {
        document.getElementById('resultsContainer').style.display = display        
    } 

    const performSearch = () => {
        setSearchText(document.getElementById('searchInput').value.trim())
    }

    return (
        <div className='search-container d-flex flex-column justify-content-start align-items-center'>
            <div className='d-flex flex-row justify-content-center' style={{width: '100%'}}>
                <Form.Control id='searchInput' type="text"  placeholder='Search...' onFocus={() => {showResultsContainer('flex')}} onBlur={() => {showResultsContainer('none')}} onChange={performSearch}/>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            </div>                
            <div id='resultsContainer' className='search-results-container flex-column justify-content-start align-items-center'>                    
                <div className='search-pin' />
                {searchText.length === 0 ? <RecentSearch /> : <SearchResults searchText={searchText} />}
            </div>
        </div>
    )
}

export default Search