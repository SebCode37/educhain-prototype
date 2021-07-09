pragma solidity ^0.4.26;

/* Interface to link the Educhain
   token functionality to another
   contract
*/
interface ERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

/* Contract for distributing Educhain
   tokens to the userbase. After creation,
   the creator of the token has to send
   his tokens to this address, so it can
   hand them out
*/
contract Faucet {
    uint256 constant public tokenAmount = 1;
    uint256 constant public waitTime = 10 minutes;

    // Educhain token
    ERC20 public tokenInstance;
    
    // Saving the last accress in unix time
    mapping(address => uint256) lastAccessTime;

    // Constructor gets called on creation
    constructor(address _tokenInstance) public {
        require(_tokenInstance != address(0));
        tokenInstance = ERC20(_tokenInstance);
    }

    // handing out tokens
    function requestTokens() public {
        require(allowedToWithdraw(msg.sender));
        tokenInstance.transfer(msg.sender, tokenAmount);
        lastAccessTime[msg.sender] = block.timestamp + waitTime;
    }

    // checking if user has requested tokens within the last 10 minutes
    function allowedToWithdraw(address _address) public view returns (bool) {
        if(lastAccessTime[_address] == 0) {
            return true;
        } else if(block.timestamp >= lastAccessTime[_address]) {
            return true;
        }
        return false;
    }
}