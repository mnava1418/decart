import { Card, Button } from 'react-bootstrap'
import Search from './Search'

function NewsFeed() {
    const showSearchResultsContainer = (display) => {
        if(display === 'none') {
            document.activeElement.blur()
        }

        document.getElementById('resultsContainer').style.display = display        
    } 

    const getNewsFeedElements = () => {
        const elements = [1, 2, 3, 4, 5]

        return(
            <>
            {
                elements.map(element => {
                    return(
                        <Card key={element} className='main-element feed-element'>
                            <Card.Body>
                                <Card.Title>Foto {element}</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                                <Button variant="primary">Go somewhere</Button>
                            </Card.Body>
                        </Card>
                    )
                })
            }
            </>
        )
    }

    return (
        <div className='feed-container d-flex flex-column justify-content-start align-items-center' onClick={() => {showSearchResultsContainer('none')}}>
            <Search showSearchResultsContainer={showSearchResultsContainer}/>
            {getNewsFeedElements()}
        </div>
    )
}

export default NewsFeed