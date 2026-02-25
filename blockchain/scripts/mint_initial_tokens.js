
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    const [admin, student] = await hre.ethers.getSigners();
    console.log("Admin address:", admin.address);
    console.log("Student address:", student.address);

    const addressesPath = path.join(__dirname, '../../frontend/app/lib/blockchain/addresses.json');

    if (!fs.existsSync(addressesPath)) {
        console.error("Addresses file not found!");
        return;
    }

    const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
    // key is EDUToken in addresses.json
    const eduTokenAddress = addresses.EDUToken;

    console.log("EDU Token Address:", eduTokenAddress);

    // Contract name is EDUToken (case sensitive)
    const EduToken = await hre.ethers.getContractFactory("EDUToken");
    const eduToken = EduToken.attach(eduTokenAddress);

    // Mint 5000 tokens to the student (Address #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8)
    const amount = hre.ethers.parseEther("5000");

    console.log("Minting 5000 EDU to student...");
    const tx = await eduToken.connect(admin).mint(student.address, amount, "Initial Student Mint");
    await tx.wait();

    console.log(`Successfully minted 5000 EDU to ${student.address}`);

    // Also mint some to admin for distribution
    const adminAmount = hre.ethers.parseEther("1000000");
    await eduToken.connect(admin).mint(admin.address, adminAmount, "Admin Treasury Refill");
    console.log(`Minted 1,000,000 EDU to Admin Treasury`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
