
// SPDX-License-Identifier: MIT

import {CPTH} from "./CPTH.sol";
import {NFTHouse} from "./NFTHouse.sol";

pragma solidity ^0.8.19;

CPTH cpthToken;
NFTHouse nftHouse;

contract RentalAgreement {
    IERC20 public cphtToken;
    IERC721 public nftHouse;
    uint256 public constant MINIMUM_RENTAL_PERIOD = 90 days;

    struct House {
        uint houseId;
        string houseAddress;
        uint rentalPrice;
    }

    enum ContractState {
        Created,
        Active,
        Terminated
    }

    House public house;
    address public landlord;
    address public tenant;
    ContractState public state;

    uint[] public paidRents;

    constructor(uint _houseId, string memory _address, uint _rentalPrice) {
        house = House(_houseId, _address, _rentalPrice);
        landlord = msg.sender;
        state = ContractState.Created;
    }

    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only landlord can call this function");
        _;
    }

    modifier onlyTenant() {
        require(msg.sender == tenant, "Only tenant can call this function");
        _;
    }

    modifier inState(ContractState _state) {
        require(state == _state, "Contract is not in the expected state");
        _;
    }

    function setHouse(
        uint _houseId,
        string memory _address,
        uint _rentalPrice
    ) public {
        house = House(_houseId, _address, _rentalPrice);
    }

    function rentHouse() public {
        tenant = msg.sender;
        state = ContractState.Active;
    }

    function getCurrentState() public view returns (ContractState) {
        return state;
    }

    function getRentalPrice() public view returns (uint) {
        return house.rentalPrice;
    }

    function getHouseAddress() public view returns (string memory) {
        return house.houseAddress;
    }

    function startContract(
        address _tenant
    ) public onlyLandlord inState(ContractState.Created) {
        tenant = _tenant;
        state = ContractState.Active;
    }

    function payRent(
        uint _amount
    ) public onlyTenant inState(ContractState.Active) {
        require(
            _amount >= house.rentalPrice,
            "Payment amount is less than the rental price"
        );

        (bool success, ) = landlord.call{value: _amount}("");
        require(success, "Payment failed");

        paidRents.push(_amount);
    }

    function terminateRentalAgreement() public {
        require(
            msg.sender == landlord,
            "Only the landlord can terminate the rental agreement."
        );
        state = ContractState.Terminated;
    }

    function terminateContract()
        public
        onlyLandlord
        inState(ContractState.Active)
    {
        state = ContractState.Terminated;
    }

    function refundTenant()
        public
        onlyLandlord
        inState(ContractState.Terminated)
    {
        require(paidRents.length > 0, "No rents have been paid.");
        uint totalPaidRents = 0;
        for (uint i = 0; i < paidRents.length; i++) {
            totalPaidRents += paidRents[i];
        }
        (bool success, ) = tenant.call{value: totalPaidRents}("");
        require(success, "Refund failed.");
        paidRents = new uint[](0);
    }

    function updateRentalPrice(
        uint _newRentalPrice
    ) public onlyLandlord inState(ContractState.Created) {
        house.rentalPrice = _newRentalPrice;
    }

    enum DisputeState {
        Resolved,
        Ongoing
    }

    struct Dispute {
        address disputer;
        string description;
        DisputeState state;
    }

    Dispute[] public disputes;

    function createDispute(
        string memory _description
    ) public onlyTenant inState(ContractState.Active) {
        Dispute memory newDispute = Dispute({
            disputer: msg.sender,
            description: _description,
            state: DisputeState.Ongoing
        });
        disputes.push(newDispute);
    }

    function resolveDispute(
        uint _disputeIndex,
        bool _landlordWon
    ) public onlyLandlord {
        Dispute storage dispute = disputes[_disputeIndex];
        require(
            dispute.state == DisputeState.Ongoing,
            "Dispute is already resolved."
        );
        dispute.state = DisputeState.Resolved;
        if (_landlordWon) {
            // handle landlord winning the dispute
        } else {
            // handle tenant winning the dispute
        }
    }

    enum ReturnState {
        Returned,
        NotReturned
    }

    struct Return {
        address returner;
        ReturnState state;
    }

    Return[] public returnsRent;

    function returnProperty() public onlyTenant {
        Return memory newReturn = Return({
            returner: msg.sender,
            state: ReturnState.Returned
        });
        returnsRent.push(newReturn);
    }

    function confirmReturn() public onlyLandlord {
        require(returnsRent.length > 0, "Property has not been returned.");
        Return storage return_ = returnsRent[returnsRent.length - 1];
        require(
            return_.state == ReturnState.Returned,
            "Property has not been returned."
        );
        // handle return confirmation
        returnsRent.pop();
    }
}