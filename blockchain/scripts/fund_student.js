const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [admin] = await hre.ethers.getSigners();
    // Default Hardhat Account #1
    const studentAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    console.log("Funding student wallet...");
    console.log("From (Admin):", admin.address);
    console.log("To (Student):", studentAddress);

    // Read deployment addresses
    const addressesPath = path.join(__dirname, "../addresses.json");
    if (!fs.existsSync(addressesPath)) {
        console.error("addresses.json not found! Please deploy contracts first.");
        return;
    }
    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    const eduTokenAddress = addresses.EDUToken;

    const EDUToken = await hre.ethers.getContractAt("EDUToken", eduTokenAddress);

    // Check initial balance
    const balBefore = await EDUToken.balanceOf(studentAddress);
    console.log("Initial Balance:", hre.ethers.formatEther(balBefore), "EDU");

    // Transfer 1000 EDU
    const amount = hre.ethers.parseEther("1000");
    const tx = await EDUToken.transfer(studentAddress, amount);
    console.log("Tx Hash:", tx.hash);
    await tx.wait();

    const balAfter = await EDUToken.balanceOf(studentAddress);
    console.log("New Balance:", hre.ethers.formatEther(balAfter), "EDU");
    console.log("Funded successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
