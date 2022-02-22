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
    uint followings;
    uint followers;
    uint posts;
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

  event FollowUser(
    address currentUser,
    address followedUser
  );

  event UpdateUser(
    string name,
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
    users[msg.sender] = _User(_name, _email, _profilePic, _cost, msg.sender, 0, 0, 0, true);
    payable(ownerAccount).transfer(msg.value);

    emit CreateUser(_name, _email, _profilePic, _cost, msg.sender);
  }

  function updateUser(string memory _name, string memory _profilePic, uint _cost) public payable {
    //Validate mandatory fields
    require(bytes(_name).length > 0, 'El nombre es obligatorio');
    require(bytes(_profilePic).length > 0, 'La foto de perfil es obligatoria');
    require(users[msg.sender].valid, 'Usuario no existe');

    _User memory currentUser = users[msg.sender];
    currentUser.name = _name;
    currentUser.profilePic = _profilePic;
    currentUser.cost = _cost;

    users[msg.sender] = currentUser;
    
    emit UpdateUser(_name, _profilePic, _cost, msg.sender);
  }

  function followUser(address _addressToFollow) public payable {
    require(_addressToFollow != address(0), 'Invalid user');
    require(users[_addressToFollow].valid, 'Usuario no existe');
    require(users[msg.sender].valid, 'Usuario no existe');

    _User memory userToFollow = users[_addressToFollow];
    _User memory currentUser = users[msg.sender];

    if(userToFollow.cost > 0) {
      require(userToFollow.cost == msg.value, 'Monto incorrecto');
      payable(_addressToFollow).transfer(msg.value);
    }    

    userToFollow.followers = userToFollow.followers + 1;
    currentUser.followings = currentUser.followings + 1;

    users[_addressToFollow] = userToFollow;
    users[msg.sender] = currentUser;

    followings[msg.sender][_addressToFollow] = true;
    followers[_addressToFollow][msg.sender] = true;

    emit FollowUser(msg.sender, _addressToFollow);    
  }

  function unfollowUser(address _addressToUnfollow) public {
    require(_addressToUnfollow != address(0), 'Invalid user');
    require(users[_addressToUnfollow].valid, 'Usuario no existe');
    require(users[msg.sender].valid, 'Usuario no existe');

    _User memory userToUnFollow = users[_addressToUnfollow];
    _User memory currentUser = users[msg.sender];

    userToUnFollow.followers = userToUnFollow.followers - 1;
    currentUser.followings = currentUser.followings - 1;

    users[_addressToUnfollow] = userToUnFollow;
    users[msg.sender] = currentUser;

    followings[msg.sender][_addressToUnfollow] = false;
    followers[_addressToUnfollow][msg.sender] = false;
  }
}