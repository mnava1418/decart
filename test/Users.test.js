const convertToETH = require('../src/utils/ethUtils').convertToETH
const web3 = require('web3')
const eth = new web3(web3.givenProvider).eth;
const Users = artifacts.require('./Users')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Users', ([deployer, user1]) => {
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

    describe('create user', () => {
        describe('success', async () => {
            const creationCost = convertToETH(0.1)
            let result
            let originalBalanceOwner            
            let originalBalanceUser            
                        
            beforeEach(async () => {
                originalBalanceOwner = await eth.getBalance(deployer)
                originalBalanceUser = await eth.getBalance(user1)
                result = await users.createUser('name', 'test@test.com', 'profilePic', convertToETH(1), {from: user1, value: creationCost})                
            })

            it('user was created', async () => {
                const createdUser = await users.users(user1)
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
                await users.createUser('', 'test@test.com', 'profilePic', convertToETH(1), {from: user1, value: convertToETH(0.1)}).should.be.rejected
            })

            it('invalid email', async () => {
                await users.createUser('name', '', 'profilePic', convertToETH(1), {from: user1, value: convertToETH(0.1)}).should.be.rejected
            })

            it('invalid profilePic', async () => {
                await users.createUser('name', 'test@test.com', '', convertToETH(1), {from: user1, value: convertToETH(0.1)}).should.be.rejected
            })
        })
    })
})
