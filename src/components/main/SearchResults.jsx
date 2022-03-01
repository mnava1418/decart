import {useEffect} from 'react'
import { Spinner } from 'react-bootstrap';

function SearchResults({searchText}) {

    useEffect(() => {
      console.log(searchText)
    }, [searchText])
    
    return (
        <div id='searchResults' className='search-results d-flex flex-column justify-content-center align-items-center'>
        <Spinner animation="grow" />
        </div> 
    )
}

export default SearchResults