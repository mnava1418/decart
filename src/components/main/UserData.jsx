import { useState } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ipfsData } from '../../config'
import { getUserNumbers } from '../helpers'
import { fromWei } from '../../services/ethService'

function UserData({selectedUser, currentUser}) {  
  const [tooltipText, setToolTipText] = useState('Copy to clipboard')

  const formatAddress = (address) => {
    return `${address.substring(0,5)}...${address.substring(address.length - 4, address.length)}`
  }  

  const copyAddress = (address) => {
    const elem = document.createElement('textarea');
    elem.value = address;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    setToolTipText('Copied!')
  }

  const getFollowBtn = () => {
      return(
        <Button variant="primary">Follow User</Button>
      )
    }

  const getUserData = () => {
    return(
      <div className='d-flex flex-column justify-content-center align-items-start user-feed-data'>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-copy">{tooltipText}</Tooltip>} onExited={() => {setToolTipText('Copy to clipboard')}}>          
          <div style={{cursor: 'pointer'}} onClick={() => {copyAddress(selectedUser.userAddress)}}><i class="bi bi-wallet"></i> {formatAddress(selectedUser.userAddress)}</div>
        </OverlayTrigger>
        <div><i class="bi bi-envelope"></i> {selectedUser.email}</div>
        <div>Membresía: {fromWei(parseFloat(selectedUser.cost))} ETH</div>
      </div>
    )
  }

  return (
    <>
        <div className='d-flex flex-row justify-content-center align-items-start' style={{width: '95%'}}>
          <div className='bg-image bg-image-cover user-feed-pic'>
            <img alt={selectedUser.name} src={`${ipfsData.protocol}://${ipfsData.host}/ipfs/${selectedUser.profilePic}`}/>
          </div>
          <div className='user-feed-info' >
            <div className='d-flex user-feed-primary'>
              <span className='user-feed-title'>{selectedUser.name}</span>
              {currentUser.userAddress === selectedUser.userAddress ? <></> : getFollowBtn()}
            </div>
            <div className='user-feed-not-mobile'>
              {getUserNumbers(parseFloat(selectedUser.posts), parseFloat(selectedUser.followers), parseFloat(selectedUser.followings))}
            </div>
            <div className='user-feed-not-mobile'>
              {getUserData()}              
            </div>
          </div>
        </div>
        <div className='user-feed-mobile'>
          {getUserData()}              
        </div>
        <div className='user-feed-mobile'>
              {getUserNumbers(parseFloat(selectedUser.posts), parseFloat(selectedUser.followers), parseFloat(selectedUser.followings))}
        </div>  
    </>
  )
}

export default UserData