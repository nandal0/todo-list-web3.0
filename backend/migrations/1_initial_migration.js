const Task = artifacts.require("Task");

module.exports = function(deployer) {
  deployer.deploy(Task);
};
