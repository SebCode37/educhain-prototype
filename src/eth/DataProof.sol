pragma solidity ^0.4.26;

/* Contract for controlling the data´s
   inner logic to save information
*/
contract RPS {
    
    address public userAddress;
    address public operatorAddress;
    
    string public hash;
    string public info;
    string public name;
    
    uint256 public time;

    /* By creating clones and no new contracts there
       are no new constructors either.
       The function is needed to mimic its usecase.
       It is only called one time on clone creation.
    */
    function factoryConstructor(address _userAddress, 
                                address _operatorAddress,
                                string _hash,
                                string _info,
                                string _name) public {
        // Handover
        userAddress = _userAddress;
        operatorAddress = _operatorAddress;
        hash = _hash;
        info = _info;
        name = _name;
                
        // Infrastructure
        time = now;
    }

}