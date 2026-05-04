const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employees");
const mfindRoutes = require("./routes/mfinds");
const bathroomRoutes = require("./routes/bathroom");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "ALDO Management System API is running" });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/mfinds", mfindRoutes);
app.use("/api/bathroom", bathroomRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});