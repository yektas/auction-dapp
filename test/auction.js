const truffleAssert = require("truffle-assertions");

const Auction = artifacts.require("Auction");

contract("Auction", function (accounts) {
  let auction;
  const owner = accounts[0];
  const bidderAccount = accounts[3];

  beforeEach(async () => {
    auction = await Auction.new({ from: owner });

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

  it("owner can add new product", async function () {
    const result = await auction.addProduct(
      "Adidas",
      "http://adidas.com",
      "New pair of shoes",
      web3.utils.toWei("0.005", "ether"),
      5,
      { from: owner }
    );

    const product = await auction.getProduct(1);
    assert(product.name === "Adidas");

    truffleAssert.eventEmitted(result, "ProductCreated", (event) => {
      return (event.product = product);
    });
  });

  it("random person cannot add new product", async function () {
    await truffleAssert.reverts(
      auction.addProduct(
        "Adidas",
        "http://adidas.com",
        "New pair of shoes",
        web3.utils.toWei("0.005", "ether"),
        5,
        { from: bidderAccount }
      )
    );
  });

  it("can bid", async function () {
    let bidAmount = web3.utils.toWei("0.002", "ether");
    await auction.bid(0, {
      from: bidderAccount,
      value: bidAmount,
    });

    const product = await auction.getProduct(0);
    assert(product.price == bidAmount);

    const currentOwner = await auction.getProductOwner(0);
    assert(currentOwner == bidderAccount);
  });

  it("can claim product", function () {
    //Wait for 5 seconds after bidding
    setTimeout(async () => {
      await auction.claimProduct(0, {
        from: bidderAccount,
      });

      const product = await auction.getProduct(0);
      assert(product.isSold);

      const currentOwner = await auction.getProductOwner(0);
      assert(currentOwner == bidderAccount);
    }, 5000);
  });
});
