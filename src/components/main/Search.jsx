import {Form, InputGroup} from 'react-bootstrap'

function Search() {

    const showResultsContainer = (display) => {
        document.getElementById('resultsContainer').style.display = display
    }

    return (
        <div className='search-container d-flex flex-column justify-content-start align-items-center'>
            <div className='d-flex flex-row justify-content-center' style={{width: '100%'}}>
                <Form.Control type="text"  placeholder='Search...' onFocus={() => {showResultsContainer('flex')}} onBlur={() => {showResultsContainer('none')}} />
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            </div>                
            <div id='resultsContainer' className='search-results-container flex-column justify-content-start align-items-center'>                    
                <div className='search-pin' />
                <div>
                    Aqui van a aparecer
                </div>                    
            </div>
        </div>
    )
}

export default Search