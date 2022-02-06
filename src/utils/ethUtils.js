const web3 = require('web3')

const convertToETH = (amount) => web3.utils.toWei(amount.toString(), 'ether')    

module.exports = {
    convertToETH
}
