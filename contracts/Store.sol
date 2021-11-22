// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Store {
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
