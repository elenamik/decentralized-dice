// SPDX-License-Identifier: GPL-3.0
import "hardhat/console.sol";

pragma solidity >=0.8.2 <0.9.0;


contract PlayDice {
    uint randSeed = 0;

    event Game(address win, address loss);

    function playDice(address player2) public {
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
        emit Game(win, loss);
    }

    // returns 0 or 1, and generates new seed
    function randomOutome() private returns (uint){
        randSeed = uint(keccak256(abi.encodePacked (msg.sender, block.timestamp, randSeed)));
        return randSeed%2;
    }
}