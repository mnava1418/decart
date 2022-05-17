import React from 'react'

import '../styles/NotFound.css'

function NotFound() {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center bg-image bg-image-cover not-found-container'>
        <div className='d-flex flex-column justify-content-center align-items-center' style={{width: '80%'}}>
            <h2><i class="bi bi-diagram-3"></i></h2>
            <h1>404</h1>
            <h5>Oops! The page you requested was not found!</h5>
            <a className='not-found-link' href='/'>Back to Home</a>
        </div>
    </div>
  )
}

export default NotFound