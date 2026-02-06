import dotenv from "dotenv";
dotenv.config();

// 🔒 This now pulls the key from your hidden .env file
const API_KEY = process.env.GEMINI_API_KEY;

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("🔍 Connecting to Google Servers to list YOUR models...");

if (!API_KEY) {
    console.error("❌ ERROR: API Key is missing. Check your .env file!");
    process.exit(1);
}

fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("❌ API Error:", data.error.message);
        } else {
            console.log("\n✅ SUCCESS! Here are the models you can use:");
            console.log("------------------------------------------------");
            data.models.forEach(model => {
                // We only care about models that support 'generateContent'
                if (model.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`👉 ${model.name.replace("models/", "")}`);
                }
            });
            console.log("------------------------------------------------");
            console.log("Copy one of the names above exactly into your executor.js file.");
        }
    })
    .catch(err => console.error("❌ Network Error:", err));