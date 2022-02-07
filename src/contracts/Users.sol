// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Users {  
  address public ownerAccount;
  mapping(address => _User) public users;
  mapping(address => mapping(address => bool)) public followings;
  mapping(address => mapping(address => bool)) public followers;
  
  /*---OBJECTS---*/  
  struct _User {
    string name;
    string email;
    string profilePic;
    uint cost;
    address userAddress;
    bool valid;    
  }

  /*---EVENTS---*/
  event CreateUser(
    string name,
    string email,
    string profilePic,
    uint cost,
    address userAddress
  );

  event UserInteraction(
    address currentUser,
    address followedUser
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
    users[msg.sender] = _User(_name, _email, _profilePic, _cost, msg.sender, true);
    payable(ownerAccount).transfer(msg.value);

    emit CreateUser(_name, _email, _profilePic, _cost, msg.sender);
  }

  function followUser(address _addressToFollow) public payable {
    require(_addressToFollow != address(0), 'Invalid user');
    require(users[_addressToFollow].valid, 'Usuario no existe');

    _User memory userToFollow = users[_addressToFollow];

    if(userToFollow.cost > 0) {
      require(userToFollow.cost == msg.value, 'Monto incorrecto');
      payable(_addressToFollow).transfer(msg.value);
    }

    followings[msg.sender][_addressToFollow] = true;
    followers[_addressToFollow][msg.sender] = true;

    emit UserInteraction(msg.sender, _addressToFollow);    
  }
}