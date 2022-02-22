import { Card, Button } from 'react-bootstrap'

function NewsFeed() {

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
        <div className='feed-container d-flex flex-column justify-content-start align-items-center'>
            {getNewsFeedElements()}
        </div>
    )
}

export default NewsFeed