const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Seeding tasks with account:", deployer.address);

    // Load addresses
    const addressesPath = path.join(__dirname, "../../frontend/app/lib/blockchain/addresses.json");
    if (!fs.existsSync(addressesPath)) {
        console.error("Addresses file not found!");
        process.exit(1);
    }
    const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
    const taskControllerAddress = addresses.TaskController;

    if (!taskControllerAddress) {
        console.error("TaskController not found in addresses.json");
        process.exit(1);
    }

    console.log("Connecting to TaskController at:", taskControllerAddress);
    const TaskController = await hre.ethers.getContractFactory("TaskController");
    const taskController = TaskController.attach(taskControllerAddress);

    const tasksToSeed = [
        { id: 1, title: "Attendance", condition: "Must have > 90% attendance", reward: "50", type: 0, minBalance: 0 },
        { id: 2, title: "Assignments", condition: "All assignments submitted on time", reward: "25", type: 0, minBalance: 0 },
        { id: 3, title: "CGPA Milestones", condition: "CGPA > 8.0", reward: "200", type: 0, minBalance: 0 },
        { id: 4, title: "Semester Completion", condition: "Pass in all subjects", reward: "100", type: 0, minBalance: 0 },
        { id: 5, title: "Record Submissions", condition: "Signed/Approved Record", reward: "30", type: 0, minBalance: 0 },
        { id: 6, title: "Course Completions", condition: "Valid Course Certificate", reward: "75", type: 0, minBalance: 0 },
        { id: 7, title: "Certifications", condition: "Industry Recognized Certification", reward: "150", type: 0, minBalance: 0 },
        { id: 8, title: "Technical Activities", condition: "Participation Certificate", reward: "100", type: 0, minBalance: 0 },
        { id: 9, title: "Cultural Activities", condition: "Participation Proof", reward: "50", type: 0, minBalance: 0 },
        { id: 10, title: "Extracurricular", condition: "Activity Log / Certificate", reward: "40", type: 0, minBalance: 0 },
        { id: 11, title: "NFT Certificates", condition: "NFT Metadata Linked", reward: "250", type: 0, minBalance: 0 },
        { id: 12, title: "Monthly Attendance", condition: "Instructor Code Verification", reward: "50", type: 0, minBalance: 0 },
    ];

    for (const task of tasksToSeed) {
        console.log(`Creating Task ${task.id}: ${task.title}...`);
        try {
            const tx = await taskController.createTask(
                task.title,
                task.condition, // Pass new condition param
                hre.ethers.parseEther(task.reward),
                task.type, // VerificationType.INSTANT
                task.minBalance
            );
            await tx.wait();
            console.log(`Task ${task.id} created!`);
        } catch (error) {
            console.log(`Error creating Task ${task.id}:`, error.message);
        }
    }

    console.log("Seeding complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
