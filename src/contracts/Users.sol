// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Users {  
  address public ownerAccount;
  mapping(address => _User) public users;
  
  /*---OBJECTS---*/  
  struct _User {
    string name;
    string email;
    string profilePic;
    uint cost;
    address userAddress;    
  }

  /*---EVENTS---*/
  event CreateUser(
    string name,
    string email,
    string profilePic,
    uint cost,
    address userAddress
  );
  
  constructor(address _ownerAccount) {
    ownerAccount = _ownerAccount;
  }

  function createUser(string memory _name, string memory _email, string memory _profilePic, uint _cost) public payable {
    //Validate mandatory fields
    require(bytes(_name).length > 0, 'El nombre es obligatorio');
    require(bytes(_email).length > 0, 'El email es obligatorio');
    require(bytes(_profilePic).length > 0, 'La foto de perfil es obligatoria');

    //Add user and pay the owner
    users[msg.sender] = _User(_name, _email, _profilePic, _cost, msg.sender);
    payable(ownerAccount).transfer(msg.value);

    emit CreateUser(_name, _email, _profilePic, _cost, msg.sender);
  }
}