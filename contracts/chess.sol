// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract APIConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    address public WHITE;
    address public BLACK;
    address public TO_MOVE;

    bool public success = false;
    string public FEN;
    string public URL;


    bytes32 private jobId;
    uint256 private fee;

    string constant private _START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    event ValidateMove(bytes32 indexed requestId, bool isValid);
    event GameReady(address white, address black);


    /**
     * @notice Initialize the link token and target oracle
     *
     * Goerli Testnet details:
     * Link Token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Oracle: 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7 (Chainlink DevRel)
     * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xCC79157eb46F5624204f47AB42b3906cAA40eaB7);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    function setUpGame(address white, address black) public returns (address, address) {
        WHITE = white;
        BLACK = black;

        FEN = _START_FEN;
        TO_MOVE = WHITE;

        emit GameReady(WHITE, BLACK);
        return (WHITE, BLACK);
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function attemptMove(string memory move) public returns (bytes32 requestId) {
        if (msg.sender != TO_MOVE) {
            revert("Not your turn");
        }

        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillValidMove.selector
        );

        // Set the URL to perform the GET request on
        string memory baseUrl = "https://chess-api-two.vercel.app/api/isValid?";
        string memory url = string(abi.encodePacked(baseUrl,"game=",toString(address(this)),"&move=",move));

        URL = url;

        req.add(
            "get",
            url
        );

        // Set the path to find the desired data in the API response, where the response format is:
        //  {
        //        valid: boolean;
        //        game: string;
        //        move: string;
        //        FEN: string;
        //        nextFEN?: string;
        //        message?: string;
        //  }

        req.add("path", "valid"); // Chainlink nodes 1.0.0 and later support this format

        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10 ** 18;
        req.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfillValidMove(
        bytes32 _requestId,
        bool _isValid
    ) public recordChainlinkFulfillment(_requestId) {
        emit ValidateMove(_requestId, _isValid);
        success=true;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function toString(address addr) public pure returns(string memory) {
        return Strings.toHexString(uint256(uint160(addr)), 20);
    }
}
