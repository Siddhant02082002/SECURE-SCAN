import { exec } from "child_process";
import { Router } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import ScanResult from "../models/ScanResults.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GitHub Personal Access Token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.OWNER;
const REPO = process.env.REPO;
const WORKFLOW_ID = process.env.WORKFLOW_ID;

// Function to ask user input from terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function triggerWorkflow(inputUrl, branch) {
  const uniqueId = uuidv4();
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`,
      {
        ref: branch, // Specify the branch to run the workflow on
        inputs: {
          repo_url: inputUrl,
          unique_id: uniqueId,
        },
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    console.log(
      `Workflow triggered successfully on branch ${branch} with unique ID ${uniqueId}.`
    );
    return uniqueId;
  } catch (error) {
    console.error(
      "Error triggering workflow:",
      error.response ? error.response.data : error.message
    );
  }
}

async function getWorkflowRun(branch) {
  await new Promise((resolve) => setTimeout(resolve, 6000));
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const runs = response.data.workflow_runs.filter(
      (run) => run.head_branch === branch
    );

    const latestRun = runs.find(
      (run) => run.status === "in_progress" || "queued"
    );
    console.log(latestRun.run_number);
    console.log(latestRun.id);
    return latestRun.id;
  } catch (error) {
    console.error(
      "Error fetching workflow run:",
      error.response ? error.response.data : error.message
    );
  }
}

async function downloadArtifacts(runId) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs/${runId}/artifacts`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const artifacts = response.data.artifacts;
    for (const artifact of artifacts) {
      const downloadResponse = await axios.get(artifact.archive_download_url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        responseType: "stream",
      });
      const outputPath = path.join(
        __dirname,
        "..",
        "Result",
        `${artifact.name}.zip`
      );
      const writer = fs.createWriteStream(outputPath);
      downloadResponse.data.pipe(writer);

      writer.on("finish", async () => {
        console.log(`Downloaded ${artifact.name} to ${outputPath}`);
        // Extract the zip file into the extracted folder
        const extractPath = path.join(
          __dirname,
          "..",
          "extracted",
          artifact.name
        );
        await fs.promises.mkdir(extractPath, { recursive: true });
        fs.createReadStream(outputPath)
          .pipe(unzipper.Extract({ path: extractPath }))
          .on("close", () => {
            console.log(`Extracted ${artifact.name} to ${extractPath}`);
          });
      });
    }
  } catch (error) {
    console.error(
      "Error downloading artifacts:",
      error.response ? error.response.data : error.message
    );
  }
}

async function refines() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Function to determine the primary risk level
  function determineRiskLevel(riskdesc) {
    let primaryRisk = riskdesc.split(" ")[0].toLowerCase();
    return primaryRisk.charAt(0).toUpperCase() + primaryRisk.slice(1);
  }

  // Function to parse JSON file and count vulnerabilities
  function parseAndCountVulnerabilities(filePath) {
    let vulnerabilitySummary = {
      Informational: {
        count: 0,
        types: [],
        apis: [],
      },
      Low: {
        count: 0,
        types: [],
        apis: [],
      },
      Medium: {
        count: 0,
        types: [],
        apis: [],
      },
      High: {
        count: 0,
        types: [],
        apis: [],
      },
    };

    try {
      // Read and parse the JSON file
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(fileContent);

      // Extract the alerts from the JSON data
      const sites = jsonData.site || [];
      sites.forEach((site) => {
        const alerts = site.alerts || [];
        alerts.forEach((alert) => {
          if (alert.riskdesc) {
            let riskLevel = determineRiskLevel(alert.riskdesc);

            // Handle specific cases where riskdesc includes additional information
            if (riskLevel === "Low" && alert.riskdesc.includes("(Medium)")) {
              riskLevel = "Medium";
            } else if (
              riskLevel === "Medium" &&
              alert.riskdesc.includes("(Low)")
            ) {
              riskLevel = "Low";
            } else if (
              riskLevel === "High" &&
              alert.riskdesc.includes("(Medium)")
            ) {
              riskLevel = "High";
            }

            // Increase the corresponding risk count and add alert type and API
            if (vulnerabilitySummary[riskLevel] !== undefined) {
              vulnerabilitySummary[riskLevel].count++;
              vulnerabilitySummary[riskLevel].types.push(alert.alert);
              if (alert.uri) {
                vulnerabilitySummary[riskLevel].apis.push(alert.uri);
              }
            }
          }
        });
      });
    } catch (error) {
      console.error(`Error parsing or processing file ${filePath}:`, error);
    }

    return vulnerabilitySummary;
  }

  // Function to process all JSON files in a folder and create a summary
  function processFolderAndCreateSummary(folderPath, summaryFilePath) {
    const summaryArray = [];

    // Read all files in the directory
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      // Filter JSON files and process each
      const jsonFiles = files.filter((file) => file.endsWith(".json"));
      jsonFiles.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const summaryData = parseAndCountVulnerabilities(filePath);

        // Add the file summary to the array as an object
        summaryArray.push({
          fileName: file,
          ...summaryData,
        });
      });

      // Write the array of summaries to a JSON file
      fs.writeFileSync(
        summaryFilePath,
        JSON.stringify(summaryArray, null, 2),
        "utf-8"
      );
      console.log(`Summary has been saved to ${summaryFilePath}`);
      return summaryArray;
    });
  }

  // Path to the folder containing JSON files
  const folderPath = path.join(__dirname, "..", "extracted", "zap-reports");

  // Path for the summary JSON file
  const summaryFilePath = path.join(__dirname, "..", "utils", "Summary.json");

  // Process the folder and create the summary file
  processFolderAndCreateSummary(folderPath, summaryFilePath);
}
const router = Router();

router.post("/", async (req, res) => {
  try {
    // const { url, branch } = req.body;
    const url = "https://github.com/TanTrumMaster/backend-testing2.0";
    const branch = "main";
    if (!url || !branch) {
      return res.status(400).json({ message: "URL and branch are required" });
    }

    console.log(`Received URL: ${url} and branch: ${branch}`);

    // Trigger the workflow
    await triggerWorkflow(url, branch);
    console.log(`Waiting for the workflow to complete on branch ${branch}...`);

    // Polling the workflow status
    // let runID = await getWorkflowRun(branch);

    // while (!run || run.status !== 'completed') {
    //     await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before checking again
    // }

    let runId = await getWorkflowRun(branch);
    console.log(runId);
    if (!runId) {
      return res
        .status(500)
        .json({ message: "Unable to get workflow run ID." });
    }

    // if (run.conclusion === "success") {
    //   console.log(
    //     "Workflow completed successfully. Downloading and extracting artifacts..."
    //   );
    //   await downloadArtifacts(run.id);
    //   res.json({
    //     message: "Workflow completed successfully and artifacts downloaded.",
    //   });
    // } else {
    //   res.json({ message: "Workflow did not complete successfully." });

    // }

    let runCompleted = false; // todo
    while (!runCompleted) {
      // todo
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds before checking again

      // Fetch the status of the workflow run
      try {
        const runResponse = await axios.get(
          `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs/${runId}`,
          {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        const runStatus = runResponse.data.status;
        // const runStatus = "completed"; // todo
        const runConclusion = runResponse.data.conclusion;

        if (runStatus === "completed") {
          runCompleted = true;

          if (runConclusion === "success") {
            console.log(
              "Workflow completed successfully. Downloading and extracting artifacts..."
            );
            await downloadArtifacts(runId);
            /*res.json({
              message:
                "Workflow completed successfully and artifacts downloaded.",
            });*/

            const pika = await refines();
            console.log(pika);
            const datas = JSON.parse(
              fs.readFileSync(
                path.join(__dirname, "..", "utils", "Summary.json"),
                "utf8"
              )
            );
            datas.map(async (data) => {
              await ScanResult.deleteMany({ fileName: data.fileName });
              const tmp = await ScanResult.create(data);
              
              await tmp.save();
            });
          } else {
            res.json({ message: "Workflow did not complete successfully." });
          }
        }
      } catch (error) {
        console.error(
          "Error fetching workflow run status:",
          error.response ? error.response.data : error.message
        );
        // Optional: You can handle retries or abort here if needed
      }
    }
    res.status(200).json({ message: "run successfully" });
  } catch (error) {
    console.error("Error in POST request handler:", error.message);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
});

export default router;
