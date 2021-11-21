const Auction = artifacts.require("Auction");
const Store = artifacts.require("Store");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Auction", function (accounts) {
  it("should assert true", async function () {
    await Auction.deployed();
    return assert.isTrue(true);
  });

  it("can add new product", async function () {
    let auction = await auction.deployed();
    await auction.addProduct(
      "Nike airmax",
      "http://nike.com",
      "New pair of shoes",
      web3.utils.toWei("0.001", "ether"),
      5
    );

    const products = await auction.getProducts();
    assert(products.length > 0);
    assert(products[0].name === "Nike airmax");
  });

  /*   it("can bid", async function () {
    let auction = await Auction.deployed();

    await auction.addProduct(
      "Nike airmax 2",
      "http://nike.com",
      "New pair of shoes",
      web3.utils.toWei("0.001", "ether"),
      5
    );

    let bidAmount = web3.utils.toWei("0.002", "ether");

    await auction.bid(0, {
      from: accounts[2],
      value: bidAmount,
    });

     const products = await auction.getProducts();
    console.log(products);
        const ownerAddress = await store.getProductOwner();
    const ownerAddress2 = await store.getProductOwner();
    const test = await auction.getProductId(accounts[2]);
    console.log(test);

    console.log("Owner address ", ownerAddress);
    console.log("Owner address 2 ", ownerAddress2);
    assert.equal(ownerAddress == accounts[1]);
    assert.equal(products[0].price == bidAmount);
  }); */
});
