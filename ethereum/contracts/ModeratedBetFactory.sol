pragma solidity ^0.5.0;

contract ModeratedBetFactory {
    
    address[] public deployedBets;
    string[] public statements;
    uint[] public amounts;
    
    
    function createModeratedBet(string memory statement,uint amount) public {
        address newBet = address(new ModeratedBet(statement,amount,msg.sender));
        deployedBets.push(newBet);
        statements.push(statement);
        amounts.push(amount);
    }

    function getDeployedBets () public view returns ( address[] memory){
        return deployedBets;
    }
    

    
    function getDeployedAmounts() public view returns (uint[] memory){
        return amounts;
    }

}

contract ModeratedBet {
    // initialize the variables needed
    address public initBettor;
    address public acceptBettor;
    address public pendingModerator;
    address public acceptedModerator;
    uint public betAmount;
    uint public balance;
    string public betStatement;
    mapping(address => bool) approvals;
    mapping(address => bool) depositors;
    uint public voteCount;



    modifier bettorsOnly() {
        require(msg.sender == initBettor || msg.sender == acceptBettor);
        _;
    }

    constructor (string memory statement,uint amount,address bettor) public {
        initBettor = bettor;
        betStatement = statement;
        betAmount = amount;

    }

    function depositBetAmount() public payable {
        require(msg.sender == initBettor);
        require(msg.value >= betAmount);
        require(depositors[msg.sender] == false);
        depositors[msg.sender] = true;
        balance = address(this).balance;
    }

    function acceptTheBet () public payable {
        require(msg.value >= betAmount);
        acceptBettor = msg.sender;
        depositors[msg.sender] = true;
        balance = address(this).balance;
    }

    function becomeModerator () public {
        require(msg.sender != initBettor && msg.sender != acceptBettor);
        require(pendingModerator == address(0) );
        pendingModerator= msg.sender;
    }

    function approveModerator () public bettorsOnly {
        require(approvals[msg.sender] == false);
        approvals[msg.sender] = true;
        voteCount++;
        if(voteCount == 2){
            acceptedModerator = pendingModerator;
            pendingModerator = address(0);
        }
    }

    function disapproveModerator () public bettorsOnly {
        require(approvals[msg.sender] == false);
        voteCount = 0;
        pendingModerator = address(0);
        approvals[initBettor] = false;
        approvals[acceptBettor] = false;
    }

    function settleBet (address payable winner) public payable {
        require(msg.sender == acceptedModerator);
        require(winner == initBettor || winner == acceptBettor);
        require(depositors[initBettor] == true && depositors[acceptBettor] == true);
        balance = address(this).balance;
        winner.transfer(address(this).balance);
    }
    
    function summary () public view returns(address,address,address,address,uint,uint,string memory,uint) {
        return (initBettor,
                acceptBettor,
                pendingModerator,
                acceptedModerator,
                betAmount,
                balance,
                betStatement,
                voteCount);
    }
}


