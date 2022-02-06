const Users = artifacts.require("Users");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts()
  const ownerAccount = accounts[0]

  await deployer.deploy(Users, ownerAccount);
};
