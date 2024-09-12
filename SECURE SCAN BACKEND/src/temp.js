// import mongoose from 'mongoose';
import fs from 'fs/promises';
// import { Summary } from './models/summary.model.js';

// Function to save summary data
async function saveSummaryData(repositoryUrl, summaryData) {
    console.log(summaryData);
    try {
        for (const [fileName, data] of Object.entries(summaryData)) {
            const summary = new Summary({
                repositoryUrl: repositoryUrl,
                fileName: fileName,
                summary: data
            });

            await summary.save();
            console.log(`${fileName} data saved successfully!`);
        }
    } catch (error) {
        console.error('Error saving summary data:', error);
    }
}

// Function to read JSON file and process it
async function processJsonFile(filePath, repositoryUrl) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const summaryData = JSON.parse(data);
        await saveSummaryData(repositoryUrl, summaryData);
    } catch (error) {
        console.error('Error reading or processing the JSON file:', error);
    }
}

// Example usage
const repositoryUrl = 'https://example.com/repo'; // Replace with the actual repository URL
const jsonFilePath = './utils/Summary.json';
processJsonFile(jsonFilePath, repositoryUrl)