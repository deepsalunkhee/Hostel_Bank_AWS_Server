const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");
const UserRouter = require("./Routes/users");
const GroupRouter = require("./Routes/groups");
const TransactionRouter = require("./Routes/transaction");
const NotificationRouter = require("./Routes/notifications");
const HistoryRouter = require("./Routes/history");
const emailnotificationsRouter = require("./Routes/emailnotifications");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function startserver() {
  try {
    connectDB();

    // Routes

    // Users
    app.use("/users", UserRouter);
    app.use("/groups", GroupRouter);
    app.use("/transaction", TransactionRouter);
    app.use("/notification", NotificationRouter);
    app.use("/history", HistoryRouter);
    app.use("/emailnotifications", emailnotificationsRouter);
    app.get("/",(req,res)=>{
        res.send("Hostel Bank Server Running");
        })

    // Start the server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Hostel Bank Server running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startserver();
