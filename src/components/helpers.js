import { Alert, OverlayTrigger, Tooltip } from "react-bootstrap"

const formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})

const formatNumber = (num) => {
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
    }
    if (num >= 1000000) {
       return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1000) {
       return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num;
}

export const displayAlert = (variant, text, link, linkText) => {
    return(
        <Alert variant={variant}>
            {text}
            <Alert.Link href={link}>{linkText}</Alert.Link>
        </Alert>
    )
}

export const getUserNumbers = (posts, followers, followings, margin = '24px 0px 24px 0px') => {
    const userNumbers = {Publicaciones: posts, Seguidores: followers, Seguidos: followings}
    
    return(
      <div className='d-flex flex-row justify-content-between align-items-center' style={{fontSize: '0.9rem', margin }}>
        {Object.keys(userNumbers).map((label, index) => {
          return(
            <OverlayTrigger key={index} placement='bottom' delay={{show: 1000}} overlay={<Tooltip id="tooltip-copy">{formatter.format(userNumbers[label])}</Tooltip>}>
              <div className='d-flex flex-column justify-content-center align-items-center'>
                <div style={{fontWeight: 'bold', cursor: 'pointer'}}>{formatNumber(userNumbers[label])}</div>
                <div>{label}</div>
              </div> 
            </OverlayTrigger>
          )
        })}
      </div>
    )
}