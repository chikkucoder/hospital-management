require("dotenv").config();

const app = require("./app");
// const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("MONGO_URI is not defined in .env");
//   process.exit(1);
// }

// connectDb(MONGO_URI)
//   .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
//   })
//   .catch((error) => {
//     console.error("Database connection failed:", error.message);
//     process.exit(1);
//   });