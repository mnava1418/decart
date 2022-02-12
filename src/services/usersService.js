export const getCurrentUser = async (account, usersContract) => {    
    const currentUser = await usersContract.methods.users(account).call()
    console.log('Current User:', currentUser)
}