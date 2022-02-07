const convertToETH = require('../src/utils/ethUtils').convertToETH
const web3 = require('web3')
const eth = new web3(web3.givenProvider).eth;
const Users = artifacts.require('./Users')
const ETH = '0x0000000000000000000000000000000000000000'

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Users', ([deployer, premiumUser, freeUser, uncreatedUser, secondPremiumUser]) => {
    let users
    beforeEach(async () => {
        users = await Users.new(deployer)
    })

    describe('deployment', () => {
        it('validate owner Account', async () => {
            const ownerAccount = await users.ownerAccount()
            ownerAccount.should.equal(deployer)
        })
    })

    describe('createUser', () => {
        describe('success', async () => {
            const creationCost = convertToETH(0.1)
            let result
            let originalBalanceOwner            
            let originalBalanceUser            
                        
            beforeEach(async () => {
                originalBalanceOwner = await eth.getBalance(deployer)
                originalBalanceUser = await eth.getBalance(premiumUser)
                result = await users.createUser('name', 'test@test.com', 'profilePic', convertToETH(1), {from: premiumUser, value: creationCost})                
            })

            it('user was created', async () => {
                const createdUser = await users.users(premiumUser)
                createdUser.name.should.equal('name')
                createdUser.email.should.equal('test@test.com')
                createdUser.profilePic.should.equal('profilePic')
                createdUser.cost.toString().should.equal(convertToETH(1))                
            })

            it('validate payment to owner', async () => {
                const finalBalanceOwner = await eth.getBalance(deployer)
                const expectedBalanceOwner = parseFloat(originalBalanceOwner) + parseFloat(creationCost)                
                expectedBalanceOwner.toString().should.equal(finalBalanceOwner.toString())
            })

            it('emit CreateUser event', () => {
                const log = result.logs[0]
                const event = log.args
    
                log.event.should.equal('CreateUser')
                event.name.should.equal('name')
                event.email.should.equal('test@test.com')
                event.profilePic.should.equal('profilePic')
                event.cost.toString().should.equal(convertToETH(1))
            })    
        })

        describe('failure', () => {
            it('invalid name', async () => {
                await users.createUser('', 'test@test.com', 'profilePic', convertToETH(1), {from: premiumUser, value: convertToETH(0.1)}).should.be.rejected
            })

            it('invalid email', async () => {
                await users.createUser('name', '', 'profilePic', convertToETH(1), {from: premiumUser, value: convertToETH(0.1)}).should.be.rejected
            })

            it('invalid profilePic', async () => {
                await users.createUser('name', 'test@test.com', '', convertToETH(1), {from: premiumUser, value: convertToETH(0.1)}).should.be.rejected
            })
        })
    })
    describe('followUser', () => {
        describe('success', () => {
            describe('premium user', () => {
                const premiumCost = convertToETH(0.5)
                let originalPremiumBalance
                let result

                beforeEach(async () => {
                    await users.createUser('name', 'test@test.com', 'profilePic', premiumCost, {from: premiumUser, value: convertToETH(0.1)})
                    originalPremiumBalance = await eth.getBalance(premiumUser)
                    result = await users.followUser(premiumUser, {from: deployer, value: premiumCost})
                })

                it('payment was made', async () => {
                    const finalPremiumBalance = await eth.getBalance(premiumUser)
                    const expectedPremiumBalance = parseFloat(originalPremiumBalance) + parseFloat(premiumCost)
                    expectedPremiumBalance.toString().should.equal(finalPremiumBalance.toString())
                })

                it('deployer follows premiumUser', async() => {
                    const isFollowing = await users.followings(deployer, premiumUser)
                    isFollowing.should.equal(true)
                })

                it('premiumUser is followed by deployer', async () => {
                    const isFollowed = await users.followers(premiumUser, deployer)
                    isFollowed.should.equal(true)
                })

                it('emit UserInteraction event', () => {
                    const log = result.logs[0]
                    const event = log.args
        
                    log.event.should.equal('UserInteraction')
                    event.currentUser.should.equal(deployer)
                    event.followedUser.should.equal(premiumUser)
                })
            })
            describe('free user', () => {
                let originalFreeBalance
                let result

                beforeEach(async () => {
                    await users.createUser('name', 'test@test.com', 'profilePic', convertToETH(0), {from: freeUser, value: convertToETH(0.1)})
                    originalFreeBalance = await eth.getBalance(freeUser)
                    result = await users.followUser(freeUser, {from: deployer})
                })

                it('no payment was made', async () => {
                    const finalFreeBalance = await eth.getBalance(freeUser)                    
                    originalFreeBalance.toString().should.equal(finalFreeBalance.toString())
                })

                it('deployer follows freeUser', async() => {
                    const isFollowing = await users.followings(deployer, freeUser)
                    isFollowing.should.equal(true)
                })

                it('freeUser is followed by deployer', async () => {
                    const isFollowed = await users.followers(freeUser, deployer)
                    isFollowed.should.equal(true)
                })

                it('emit UserInteraction event', () => {
                    const log = result.logs[0]
                    const event = log.args
        
                    log.event.should.equal('UserInteraction')
                    event.currentUser.should.equal(deployer)
                    event.followedUser.should.equal(freeUser)
                })
            })
        })
        describe('failure', () => {
            it('invalid address', async () => {
                await users.followUser(ETH, {from: deployer}).should.be.rejected
                const isFollowed = await users.followers(ETH, deployer)
                const isFollowing = await users.followings(deployer, ETH)
                isFollowed.should.equal(false)
                isFollowing.should.equal(false)                
            })

            it('user not created', async () => {
                await users.followUser(uncreatedUser, {from: deployer}).should.be.rejected
                const isFollowed = await users.followers(uncreatedUser, deployer)
                const isFollowing = await users.followings(deployer, uncreatedUser)
                isFollowed.should.equal(false)
                isFollowing.should.equal(false)                
            })

            it('payment not done', async () => {
                await users.createUser('name', 'test@test.com', 'profilePic', convertToETH(0.1), {from: secondPremiumUser, value: convertToETH(0.1)})
                await users.followUser(secondPremiumUser, {from: deployer}).should.be.rejected
                const isFollowed = await users.followers(secondPremiumUser, deployer)
                const isFollowing = await users.followings(deployer, secondPremiumUser)
                isFollowed.should.equal(false)
                isFollowing.should.equal(false)        
            })

            it('incomplete payment', async () => {
                await users.createUser('name', 'test@test.com', 'profilePic', convertToETH(0.1), {from: secondPremiumUser, value: convertToETH(0.1)})
                await users.followUser(secondPremiumUser, {from: deployer, value: convertToETH(0.01)}).should.be.rejected
                const isFollowed = await users.followers(secondPremiumUser, deployer)
                const isFollowing = await users.followings(deployer, secondPremiumUser)
                isFollowed.should.equal(false)
                isFollowing.should.equal(false)  
            })
        })
    })
})
