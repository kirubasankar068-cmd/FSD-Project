try {
  const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
  console.log("Imports successful");
  console.log("SchemaType:", SchemaType);
} catch (e) {
  console.error("Import failed:", e.message);
}
