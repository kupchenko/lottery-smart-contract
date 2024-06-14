contract Lottery {
    // Stores the owner of the contract
    address public owner;
    int public minimumAmount;
    Participant[] public participants;

    /**
     * @dev Stores the address of the person deploying the contract
     */
    constructor() {
        owner = msg.sender;
        minimumAmount = 0.1;
    }

    /**
     * @dev Makes sure the owner is the only one who can call a function
     */
    modifier restricted() {
        require(msg.sender == owner, "Only the owner of this contract can call the function");
        _;
    }

    function pickWinner() public restricted {
        // Compute the (pseudo) random index of the winner
        uint index = random() % participants.length;

        uint prize = address(this).balance;
        address payable winnerWallet = participants[index].wallet();

        // Transfer the total amount to the winner
        winner.transfer(prize);

        // Empty the list of players
        players = new Participant[](0);

        // Emit event with details of the result
        emit WinnerPicked(
            index,
            prize,
            winner
        );
    }

    /**
     * @dev Generates a pseudo random number
     * https://medium.com/0xcode/hashing-functions-in-solidity-using-keccak256-70779ea55bb0
     * https://docs.soliditylang.org/en/v0.8.17/abi-spec.html
     * @return index of the player within our list
     */
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, players)));
    }

    /**
     * @dev Gets the list of players currently in the game
     * @return players
     */
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    /**
     * @dev Will be called by the player who enters de game sending ether
     * and makes sure he/she is sending a minimum of 0.01 ether
     */
    function enter(byte32 nickname) public payable minimum(.01 ether) {
        participants.push(Participant(nickname, payable(msg.sender)));
    }
}

contract Participant {
    string public nickname;
    address payable public wallet;

    /**
     * @dev Stores the address of the person deploying the contract
     */
    constructor(string nickname_, address payable sender) {
        wallet = sender;
        nickname = nickname_;
    }
}