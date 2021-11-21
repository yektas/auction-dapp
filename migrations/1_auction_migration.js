const Auction = artifacts.require("Auction");
const Store = artifacts.require("Store");

module.exports = function (deployer) {
  deployer.deploy(Store).then(() => {
    deployer.deploy(Auction);
  });
};
