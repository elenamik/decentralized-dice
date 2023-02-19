// SPDX-License-Identifier: GPL-3.0
import "hardhat/console.sol";

pragma solidity >=0.8.2 <0.9.0;


contract PlayDice {
    uint randSeed = 0;

    event Game(address win, address loss, uint value);

    function playDice(address player2, uint value) public {
        // with actual ETH, function would be defined as "payable", and we could use msg.value

        uint result = randomOutome();

        address win;
        address loss;

        if (result == 0){
            win = msg.sender;
            loss = player2;
        }
        else { // result == 1
            win = player2;
            loss = msg.sender;
        }

        // with real ETH, could send funds to the winner
        emit Game(win, loss, value);
    }

    // returns 0 or 1, and generates new seed
    function randomOutome() private returns (uint){
        randSeed = uint(keccak256(abi.encodePacked (msg.sender, block.timestamp, randSeed)));
        return randSeed%2;
    }
}