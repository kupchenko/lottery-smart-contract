// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Lottery {

    struct Participant {
        string nickname;
        address payable wallet;
        uint amount;
    }

    // Stores the owner of the contract
    address public owner;
    Participant[] public participants;

    // We use it to emit some details about the pickWinner transaction
    event WinnerPicked(
        uint index,
        uint prize,
        address winner
    );

    /**
     * @dev Stores the address of the person deploying the contract
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Makes sure the owner is the only one who can call a function
     */
    modifier restricted() {
        require(msg.sender == owner, "Only the owner of this contract can call the function");
        _;
    }

    /**
     * @dev Enforces a minimun amount of ether to be sent to a function
     * @param value The minimum amount to send
     */
    modifier minimum(uint value) {
        string memory requiredMsg = string.concat("The minimum value required is ", Strings.toString(value));
        require(msg.value >= value, requiredMsg);
        _;
    }

    function pickWinner() public restricted {
        // Compute the (pseudo) random index of the winner
        uint index = random() % participants.length;

        uint prize = address(this).balance;
        address payable winnerWallet = participants[index].wallet;

        // Transfer the total amount to the winner
        winnerWallet.transfer(prize);

        // Empty the list of players
        delete participants;

        // Emit event with details of the result
        emit WinnerPicked(
            index,
            prize,
            winnerWallet
        );
    }

    /**
     * @dev Generates a pseudo random number
     * https://medium.com/0xcode/hashing-functions-in-solidity-using-keccak256-70779ea55bb0
     * https://docs.soliditylang.org/en/v0.8.17/abi-spec.html
     * @return index of the player within our list
     */
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp)));
    }

    /**
     * @dev Gets the list of participants currently in the game
     * @return participants
     */
    function getParticipants() public view returns (Participant[] memory) {
        return participants;
    }

    /**
     * @dev Will be called by the player who enters de game sending ether
     * and makes sure he/she is sending a minimum of 0.01 ether
     */
    function enter(string memory nickname) public payable minimum(.01 ether) {
        participants.push(Participant(nickname, payable(msg.sender), msg.value));
    }
}