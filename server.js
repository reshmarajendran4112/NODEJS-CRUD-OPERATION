const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const DATA_FILE = "data.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Read data from JSON file
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

// Write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
};

// Get all names
app.get("/names", (req, res) => {
  res.json(readData());
});

// Add a new name
app.post("/names", (req, res) => {
  const names = readData();
  const newName = { id: Date.now(), name: req.body.name };
  names.push(newName);
  writeData(names);
  res.json(newName);
});

// Update a name
app.put("/names/:id", (req, res) => {
  let names = readData();
  const id = parseInt(req.params.id);
  names = names.map((item) => (item.id === id ? { ...item, name: req.body.name } : item));
  writeData(names);
  res.json({ message: "Updated successfully" });
});

// Delete a name
app.delete("/names/:id", (req, res) => {
  let names = readData();
  const id = parseInt(req.params.id);
  names = names.filter((item) => item.id !== id);
  writeData(names);
  res.json({ message: "Deleted successfully" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
