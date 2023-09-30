pragma solidity ^0.8.0;

contract Voting {
    // Admin address
    address private admin;

    // Voting status
    bool private isVotingRunning;

    struct Voter {
        address voterAddress;
        bool isAllowed;
        bool isVoted;
        string hashedCandidateNo;
    }
    mapping(address => Voter) private voters;
    address[] private voterAddresses;

    constructor() {
        admin = msg.sender;
        isVotingRunning = false;
    }

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function.");
        _;
    }

    modifier onlyVotingRunning() {
        require(isVotingRunning == true, "Voting is not running.");
        _;
    }

    modifier onlyVotingStopped() {
        require(isVotingRunning == false, "Voting is still running");
        _;
    }

    modifier onlyAllowedAddress() {
        require(
            voters[msg.sender].isAllowed == true,
            "This address is not whitelisted to vote"
        );
        _;
    }

    modifier onlyVoter() {
        require(voters[msg.sender].isVoted == false, "You have already voted.");
        _;
    }

    // Events
    event VotingStarted();
    event VotingStopped();
    event VoteCasted(address voter, string hashedCandidateNo);
    event VoterAdded(address voter);
    event VoterDeleted(address voter);

    function getVotingStatus() public view returns (bool) {
        return isVotingRunning;
    }

    function startVoting() public onlyAdmin onlyVotingStopped {
        isVotingRunning = true;
        emit VotingStarted();
    }

    function stopVoting() public onlyAdmin onlyVotingRunning {
        isVotingRunning = false;
        emit VotingStopped();
    }

    function addAllowedVoter(address _voterAddress) public onlyAdmin {
        require(!voters[_voterAddress].isAllowed, "Voter already added.");
        voters[_voterAddress] = Voter({
            voterAddress: _voterAddress,
            isVoted: false,
            hashedCandidateNo: "",
            isAllowed: true
        });
        voterAddresses.push(_voterAddress);
        emit VoterAdded(_voterAddress);
    }

    function getAllVoterAddresses() public view returns (address[] memory) {
        return voterAddresses;
    }

    function castVote(
        string memory _hashedCandidateNo
    ) public onlyVotingRunning onlyVoter onlyAllowedAddress {
        voters[msg.sender].isVoted = true;
        voters[msg.sender].hashedCandidateNo = _hashedCandidateNo;

        emit VoteCasted(msg.sender, _hashedCandidateNo);
    }

    function getAllVoters() public view returns (Voter[] memory) {
        Voter[] memory allVoters = new Voter[](voterAddresses.length);

        for (uint i = 0; i < voterAddresses.length; i++) {
            allVoters[i] = voters[voterAddresses[i]];
        }
        return allVoters;
    }

    function getMyVote(
        address _voterAddress
    ) public view returns (string memory) {
        require(voters[_voterAddress].isAllowed, "Voter is not allowed.");
        return voters[_voterAddress].hashedCandidateNo;
    }

    function deleteVoter(address _voterAddress) public onlyAdmin {
        delete voters[_voterAddress];

        // Remove the voter address from the array
        for (uint i = 0; i < voterAddresses.length; i++) {
            if (voterAddresses[i] == _voterAddress) {
                voterAddresses[i] = voterAddresses[voterAddresses.length - 1];
                voterAddresses.pop();
                break;
            }
        }

        emit VoterDeleted(_voterAddress);
    }
}
