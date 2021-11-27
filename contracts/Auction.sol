// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auction {
    address public owner;

    mapping(uint256 => address) public productIdToOwner;

    mapping(uint256 => Product) products;
    uint256 totalProductCount = 0;

    struct Product {
        string name;
        string description;
        string imageLink;
        uint256 id;
        uint256 price;
        uint256 expireTime;
        bool isSold;
    }

    event ProductCreated(Product product);
    event ProductSold(address _owner, uint256 _productId);
    event NewBid(address _from, uint256 _productId, uint256 _newPrice);

    constructor() {
        owner = msg.sender;
    }

    /***
    /// @notice Explain to an end user what this does
    /// @dev Explain to a developer any extra details
    /// @param _auctionDuration auction duration for the product (in seconds)
    /// @return Documents the return variables of a contract’s function state variable
    /// @inheritdoc	Copies all missing tags from the base function (must be followed by the contract name)
 */
    function addProduct(
        string calldata _name,
        string calldata _imageLink,
        string calldata _description,
        uint256 _floorPrice,
        uint32 _auctionDuration
    ) public onlyOwner {
        require(_auctionDuration > 0); // auctionDuration must be at least 5 seconds
        uint256 expireTime = block.timestamp + _auctionDuration * 60;
        Product memory newProduct = Product(
            _name,
            _description,
            _imageLink,
            totalProductCount,
            _floorPrice,
            expireTime,
            false
        );

        products[totalProductCount] = newProduct;
        totalProductCount++;

        emit ProductCreated(newProduct);
    }

    function bid(uint256 _productId) external payable {
        Product storage product = products[_productId];

        require(block.timestamp < product.expireTime);
        require(!product.isSold);
        require(msg.value > product.price);

        product.price = msg.value;
        productIdToOwner[_productId] = msg.sender;
        emit NewBid(msg.sender, _productId, msg.value);
    }

    function claimProduct(uint256 _productId) external {
        Product storage product = products[_productId];
        require(block.timestamp > product.expireTime); // Check if the auction is finished
        require(!product.isSold); // Make sure that the product is not sold before
        require(msg.sender == productIdToOwner[_productId]); // Check if the product owner is the function caller
        product.isSold = true;

        emit ProductSold(msg.sender, _productId);
    }

    function getProductOwner(uint256 _productId)
        external
        view
        returns (address)
    {
        return productIdToOwner[_productId];
    }

    function getProducts() external view returns (Product[] memory) {
        Product[] memory result = new Product[](totalProductCount);
        for (uint256 i = 0; i < totalProductCount; i++) {
            result[i] = products[i];
        }
        return result;
    }

    function getProduct(uint256 _productId)
        external
        view
        returns (Product memory)
    {
        return products[_productId];
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
