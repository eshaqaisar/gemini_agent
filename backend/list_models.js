// list_models.js
const API_KEY = "AIzaSyASfXVQ8PxN6rZ3VdA1FnxjOlol6nq0EWI"; 

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("🔍 Connecting to Google Servers to list YOUR models...");

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