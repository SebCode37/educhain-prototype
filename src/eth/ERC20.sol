pragma solidity ^0.4.26;

/* Contract for creating the
   exchangable Educhain token
*/
contract ERC20{

    string public name;
    string public symbol;
    uint public totalSupply;

    // Saving the balance of each user
    mapping (address => uint) public balanceOf;

    // Constructor gets called on creation
    // Creator Address gets all the tokens (which will be sent to the faucet later)
    constructor(uint _initialSupply, string memory _name, string memory _symbol) public{
        totalSupply = _initialSupply;
        name = _name;
        symbol = _symbol;
        balanceOf[msg.sender] = _initialSupply;
    }

    // transfer tokens from one sender to another
    function transfer(address _to, uint _value) public returns(bool success){
        require(balanceOf[msg.sender] > _value);
        require(balanceOf[_to] + _value > balanceOf[_to]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // event to check if tokens where transferred
    event Transfer(address indexed _from, address indexed _to, uint _value);

}
