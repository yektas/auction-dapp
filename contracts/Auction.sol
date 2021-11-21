// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Store.sol";

contract Auction is Store {
    mapping(address => uint256) ownerToProductId;

    event NewBid(address _from, uint256 _productId, uint256 _newPrice);
    event ProductSold(address _owner, uint256 _productId);

    function bid(uint256 _productId) external payable {
        Product storage product = products[_productId];

        require(block.timestamp < product.expireTime);
        require(!product.isSold);
        require(msg.value > product.price);

        product.price = msg.value;
        productIdToOwner[_productId] = msg.sender;
        ownerToProductId[msg.sender] = _productId;
        emit NewBid(msg.sender, _productId, msg.value);
    }

    function getProductId(address owner) external view returns (uint256) {
        return ownerToProductId[owner];
    }

    function claimProduct(uint256 _productId) external {
        Product storage product = products[_productId];
        require(block.timestamp > product.expireTime); // Check if the auction is finished
        require(!product.isSold); // Make sure that the product is not sold before
        require(msg.sender == productIdToOwner[_productId]); // Check if the product owner is the function caller
        product.isSold = true;

        emit ProductSold(msg.sender, _productId);
    }
}
