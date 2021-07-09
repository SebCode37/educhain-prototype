pragma solidity ^0.4.26;

import "./CloneFactory.sol";
import "./DataProof.sol";

/* Operator Contract of the Data Proof which
   manages document hashes and creates new instances 
   via the Clone Factory Patern
*/
contract Operator is CloneFactory {
    address dataProofAddress;

    // Register hash with address of information contract
    mapping(string => address) private registry;

    // Constructor gets called on creation
    constructor(address _dataProofAddress) public {
        
        dataProofAddress = _dataProofAddress;
    }

    /* Create new Instance or Clone to save 
       information about the document
    */
    function createDataProof(string hash, string info, string name) public returns (bool){
        // data proof does not exist
        if(registry[hash] == 0x0000000000000000000000000000000000000000){
            DataProof dp = DataProof(createClone(dataProofAddress));
            dp.factoryConstructor(msg.sender, address(this), hash, info, name);
            registry[hash] = dp;
            emit proofCreated(msg.sender, dp, hash, info, name);
            return true;
        }
        // data proof already in existence
        else{
            return false;
        }
    }
    
    // returns address from data proof of filehash
    function getAddress(string hash) public view returns (address) {
    return registry[hash];
}
    
    // data proof was executed
    event proofCreated(address userAddress, address clone, string hash, string info, string name);

}