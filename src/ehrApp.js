const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json()); // Middleware to parse JSON request body

// API to create a new patient
app.post('/create-patient', async (req, res) => {
    const { id, name, age, gender, diagnosis, treatment, doctorName, lastUpdated } = req.body;

    try {
        // Load the network connection profile
        const ccpPath = '/home/sayeedm/myledger/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('appUser');
        if (!identity) {
            return res.status(400).json({ message: 'An identity for the user "appUser" does not exist in the wallet' });
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('ehr');

        // Submit the transaction to create a new patient
        await contract.submitTransaction('CreatePatient', id, name, age, gender, diagnosis, treatment, doctorName, lastUpdated);
        console.log('Patient created.');

        res.json({ message: 'Patient created successfully' });

        gateway.disconnect();
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ message: 'Failed to create patient' });
    }
});

// API to query a patient record by ID
app.get('/query-patient', async (req, res) => {
    const { id } = req.query;

    try {
        // Load the network connection profile
        const ccpPath = '/home/sayeedm/myledger/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('appUser');
        if (!identity) {
            return res.status(400).json({ message: 'An identity for the user "appUser" does not exist in the wallet' });
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('ehr');

        // Query the patient record
        const result = await contract.evaluateTransaction('QueryPatient', id);
        console.log(`Patient record: ${result.toString()}`);

        res.json(JSON.parse(result.toString()));

        gateway.disconnect();
    } catch (error) {
        console.error('Error querying patient:', error);
        res.status(500).json({ message: 'Failed to query patient' });
    }
});

// API to update a patient's record
app.post('/update-patient', async (req, res) => {
    const { id, diagnosis, treatment } = req.body;

    try {
        // Load the network connection profile
        const ccpPath = '/home/sayeedm/myledger/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('appUser');
        if (!identity) {
            return res.status(400).json({ message: 'An identity for the user "appUser" does not exist in the wallet' });
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'appUser',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('ehr');

        // Submit the transaction to update the patient record
        await contract.submitTransaction('UpdatePatient', id, diagnosis, treatment);
        console.log('Patient record updated.');

        res.json({ message: 'Patient record updated successfully' });

        gateway.disconnect();
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ message: 'Failed to update patient' });
    }
});

// Start the Express server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

