const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Standard addresses for Hardhat Localhost (Chain ID 31337) with Nonce 0 start
const EXPECTED_ADDRESSES = {
    EDUToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    CertificateNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    CourseMarketplace: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    HackathonPool: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
};

const STUDENT_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Account #1

async function main() {
    console.log("─────────────────────────────────────────────");
    console.log("   🚀 Learn2Earn Smart Contract Deployment");
    console.log("─────────────────────────────────────────────");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // 1. Check consistency state
    const nonce = await hre.ethers.provider.getTransactionCount(deployer.address);
    console.log("Current Nonce:", nonce);

    let eduTokenAddress, certificateNFTAddress, courseMarketplaceAddress, hackathonPoolAddress;
    let eduToken, certificateNFT, courseMarketplace, hackathonPool;

    // Check if we are in a 'dirty' state (Node not restarted)
    if (nonce > 0) {
        console.log("⚠️  Node not fresh (Nonce > 0). Checking for existing contracts...");

        const code = await hre.ethers.provider.getCode(EXPECTED_ADDRESSES.EDUToken);
        if (code !== "0x") {
            console.log("✅ Contracts found at expected addresses. Skipping deployment.");
            eduTokenAddress = EXPECTED_ADDRESSES.EDUToken;
            certificateNFTAddress = EXPECTED_ADDRESSES.CertificateNFT;
            courseMarketplaceAddress = EXPECTED_ADDRESSES.CourseMarketplace;
            hackathonPoolAddress = EXPECTED_ADDRESSES.HackathonPool;

            // Attach to existing
            eduToken = await hre.ethers.getContractAt("EDUToken", eduTokenAddress);
            certificateNFT = await hre.ethers.getContractAt("CertificateNFT", certificateNFTAddress);
            courseMarketplace = await hre.ethers.getContractAt("CourseMarketplace", courseMarketplaceAddress);
            hackathonPool = await hre.ethers.getContractAt("HackathonPool", hackathonPoolAddress);
        } else {
            console.error("\n❌ CRITICAL ERROR: Nonce is > 0 but contracts are missing.");
            console.error("   This results in changed contract addresses.");
            console.error("   To fix: STOP your 'npx hardhat node' terminal, RESTART it, and run this script again.");
            process.exit(1);
        }
    } else {
        // Fresh Deployment
        console.log("✅ Fresh Node detected (Nonce 0). Deploying to standard addresses...");

        // ─── 1. Deploy EDU Token ─────────────────────────────
        console.log("\n1. Deploying EDUToken...");
        const EDUToken = await hre.ethers.getContractFactory("EDUToken");
        eduToken = await EDUToken.deploy();
        await eduToken.waitForDeployment();
        eduTokenAddress = await eduToken.getAddress();
        console.log("   Deployed to:", eduTokenAddress);

        // ─── 2. Deploy Certificate NFT ──────────────────────
        console.log("\n2. Deploying CertificateNFT...");
        const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
        certificateNFT = await CertificateNFT.deploy();
        await certificateNFT.waitForDeployment();
        certificateNFTAddress = await certificateNFT.getAddress();
        console.log("   Deployed to:", certificateNFTAddress);

        // ─── 3. Deploy Course Marketplace ────────────────────
        console.log("\n3. Deploying CourseMarketplace...");
        const CourseMarketplace = await hre.ethers.getContractFactory("CourseMarketplace");
        courseMarketplace = await CourseMarketplace.deploy(eduTokenAddress);
        await courseMarketplace.waitForDeployment();
        courseMarketplaceAddress = await courseMarketplace.getAddress();
        console.log("   Deployed to:", courseMarketplaceAddress);

        // ─── 4. Deploy Hackathon Pool ────────────────────────
        console.log("\n4. Deploying HackathonPool...");
        const HackathonPool = await hre.ethers.getContractFactory("HackathonPool");
        hackathonPool = await HackathonPool.deploy(eduTokenAddress);
        await hackathonPool.waitForDeployment();
        hackathonPoolAddress = await hackathonPool.getAddress();
        console.log("   Deployed to:", hackathonPoolAddress);

        // Verify Address Consistency
        if (eduTokenAddress !== EXPECTED_ADDRESSES.EDUToken) {
            console.warn("⚠️  WARNING: Deployment addresses differ from expected standards!");
        }
    }

    // ─── 5. Seed Data (Idempotent) ──────────────────────
    console.log("\n5. Verifying/Seeding Courses...");
    const courses = [
        { name: "Professional Resume Review", price: "75", spots: 0 },
        { name: "T&P Training Program", price: "350", spots: 50 },
        { name: "Web Development Bootcamp", price: "400", spots: 30 },
        { name: "Mock Interview Session", price: "100", spots: 0 },
        { name: "Data Science Workshop", price: "300", spots: 40 },
        { name: "LinkedIn Profile Optimization", price: "50", spots: 0 },
        { name: "Communication Skills Workshop", price: "150", spots: 25 },
        { name: "Cloud Computing Basics", price: "250", spots: 35 },
        { name: "Career Counseling Session", price: "80", spots: 0 },
        { name: "DSA Crash Course", price: "200", spots: 60 },
        { name: "Portfolio Website Review", price: "60", spots: 0 },
        { name: "Cybersecurity Fundamentals", price: "275", spots: 25 },
    ];

    const courseCount = await courseMarketplace.getCourseCount();
    if (Number(courseCount) === 0) {
        for (const course of courses) {
            const tx = await courseMarketplace.createCourse(
                course.name,
                hre.ethers.parseEther(course.price),
                course.spots
            );
            await tx.wait();
            console.log(`   Created: ${course.name}`);
        }
    } else {
        console.log("   Courses already seeded.");
    }

    console.log("\n6. Verifying/Seeding Hackathons...");
    const hackathonList = [
        { name: "Blockchain Innovation Challenge", entryFee: "200", maxParticipants: 300 },
        { name: "AI/ML Hackathon 2026", entryFee: "150", maxParticipants: 400 },
        { name: "Web Development Sprint", entryFee: "100", maxParticipants: 200 },
        { name: "Cybersecurity CTF", entryFee: "175", maxParticipants: 120 },
        { name: "Mobile App Challenge", entryFee: "125", maxParticipants: 150 },
        { name: "IoT Innovation Lab", entryFee: "100", maxParticipants: 100 },
    ];

    const hackathonCount = await hackathonPool.getHackathonCount();
    if (Number(hackathonCount) === 0) {
        for (const h of hackathonList) {
            const tx = await hackathonPool.createHackathon(
                h.name,
                hre.ethers.parseEther(h.entryFee),
                h.maxParticipants
            );
            await tx.wait();
            console.log(`   Created: ${h.name}`);
        }
    } else {
        console.log("   Hackathons already seeded.");
    }

    // ─── 6. Fund Student ────────────────────────────────
    console.log("\n7. Managing Student Wallet Funds...");
    const studentBalance = await eduToken.balanceOf(STUDENT_ADDRESS);
    const minBalance = hre.ethers.parseEther("500");
    const targetBalance = hre.ethers.parseEther("1000");

    if (studentBalance < minBalance) {
        console.log(`   Student low balance: ${hre.ethers.formatEther(studentBalance)} EDU`);
        console.log("   Refunding student to 1000 EDU...");
        const tx = await eduToken.transfer(STUDENT_ADDRESS, targetBalance);
        await tx.wait();
        console.log("   ✅ Fund Success!");
    } else {
        console.log(`   Student has sufficient funds: ${hre.ethers.formatEther(studentBalance)} EDU`);
    }

    // ─── 7. Save Addresses ──────────────────────────────
    const addresses = {
        EDUToken: eduTokenAddress,
        CertificateNFT: certificateNFTAddress,
        CourseMarketplace: courseMarketplaceAddress,
        HackathonPool: hackathonPoolAddress,
        deployer: deployer.address,
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
        deployedAt: new Date().toISOString(),
    };

    // Save to blockchain dir
    const blockchainAddressPath = path.join(__dirname, "..", "addresses.json");
    fs.writeFileSync(blockchainAddressPath, JSON.stringify(addresses, null, 2));

    // Save to frontend dir
    const frontendAddressPath = path.join(__dirname, "..", "..", "frontend", "app", "lib", "blockchain", "addresses.json");
    const frontendDir = path.dirname(frontendAddressPath);
    if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir, { recursive: true });
    }
    fs.writeFileSync(frontendAddressPath, JSON.stringify(addresses, null, 2));
    console.log("\n✅ Addresses synced to Frontend");

    // ─── 8. Copy ABIs ───────────────────────────────────
    const abiDir = path.join(__dirname, "..", "..", "frontend", "app", "lib", "blockchain", "abis");
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
    }
    const contractNames = ["EDUToken", "CertificateNFT", "CourseMarketplace", "HackathonPool"];
    for (const name of contractNames) {
        const artifact = require(`../artifacts/contracts/${name}.sol/${name}.json`);
        fs.writeFileSync(path.join(abiDir, `${name}.json`), JSON.stringify({ abi: artifact.abi }, null, 2));
    }
    console.log("✅ ABIs synced to Frontend");

    console.log("─────────────────────────────────────────────");
    console.log("deployment complete.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
