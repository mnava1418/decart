const Users = artifacts.require("Users");

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const prepareUsers = async (callback) => {
    const accounts = await web3.eth.getAccounts()
    const users = await Users.deployed()
    
    for(let i = 0; i < accounts.length; i ++ ) {
        const account = accounts[i]
        await users.createUser(`User ${i}`, 'test@test.com', 'QmNmBvj2e7vjzgppVPfAiSmsH1KwaiUeNU2Hc3nX1w4Pgd', web3.utils.toWei('0', 'ether'), {from: account, value:  web3.utils.toWei('0', 'ether')})
        .then(() => {
            console.log(`User ${i} created: ${account}`)
        })
        .catch(error => {
            console.log(error)
        })
                
        await wait(1)
    }
    
    //follow
    for(let i = 0; i < accounts.length; i ++ ) {
        for(let j = i +1 ; j < accounts.length; j++) {
            await users.followUser(accounts[j], {from: accounts[i]})
            .then(() => {
                console.log(`User ${accounts[i]} is following ${accounts[j]}`)
            })
            .catch(error => {
                console.log(error)
            })

            await wait(1)
        }
    }

    callback()
}

module.exports = prepareUsers
