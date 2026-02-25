const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying TaskController with account:", deployer.address);

    // Load existing addresses
    const addressesPath = path.join(__dirname, "../../frontend/app/lib/blockchain/addresses.json");
    let addresses = {};
    if (fs.existsSync(addressesPath)) {
        addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
    }

    const eduTokenAddress = addresses.EDUToken;
    if (!eduTokenAddress) {
        console.error("EDUToken address not found. Please deploy EDUToken first.");
        process.exit(1);
    }

    console.log("Using EDUToken at:", eduTokenAddress);

    const TaskController = await hre.ethers.getContractFactory("TaskController");
    const taskController = await TaskController.deploy(eduTokenAddress);

    await taskController.waitForDeployment();
    const taskControllerAddress = await taskController.getAddress();

    console.log("TaskController deployed to:", taskControllerAddress);

    // Update addresses.json
    addresses.TaskController = taskControllerAddress;
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

    // Approve allowance for automated transfers
    const EDUToken = await hre.ethers.getContractFactory("EDUToken");
    const eduToken = EDUToken.attach(eduTokenAddress);

    const allowanceAmount = hre.ethers.parseEther("1000000"); // 1 Million EDU
    console.log("Approving TaskController to spend 1M EDU...");

    const tx = await eduToken.connect(deployer).approve(taskControllerAddress, allowanceAmount);
    await tx.wait();

    console.log("Allowance approved!");

    // Verify on Etherscan (if needed, but local usage usually skips this)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
