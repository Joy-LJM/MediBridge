const express = require("express");
const path = require("path"); // module to help with file path
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");

dotenv.config();
// const doctorDashboardRoutes = require("./routes/doctorDashboard");
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");
// const { Connection, default: mongoose } = require("mongoose");

const app = express();
const port = process.env.PORT || "3000";

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/mediBridge`;
const client = new MongoClient(dbUrl);
sgMail.setApiKey(process.env.API_KEY);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request

//allow requests from all servers
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// verifictaion code will be saved temporary here.
const verificationCodes = {};
const verification_time = 15 * 60 * 1000; // 15 minutes
// app.use(parser());

app.post("/register", async (request, response) => {
  //for POST data, retrieve field data using request.body.<field-name>
  //for a GET form, use app.get() and request.query.<field-name> to retrieve the GET form data
  //retrieve values from submitted POST form
  let {
    firstname,
    lastname,
    email,
    password,
    phone,
    address,
    city,
    province,
    account,
    license,
  } = request.body;

  if (verificationCodes[email]) {
    return res.json("Verification already pending. Enter the code.");
  }

  let verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
  verificationCodes[email] = {
    verificationCode,
    userData: {
      firstname,
      lastname,
      email,
      password,
      phone,
      address,
      city,
      province,
      account,
      license,
    },
    expiresAt: Date.now() + verification_time,
  };

  // Send verification email
  const emailData = {
    to: email,
    from: "hathaonhin@gmail.com",
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}`,
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
  };

  await sgMail.send(emailData);

  response.json("success");
  //redirect back to sign in page
});

app.post("/verify", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!verificationCodes[email]) {
      return res.status(400).json({
        success: false,
        message: "No verification request found for this email.",
      });
    }

    // Check if the verification code has expired
    const { expiresAt, verificationCode: storedCode } =
      verificationCodes[email];
    if (Date.now() > expiresAt) {
      delete verificationCodes[email]; // Remove expired code
      return res.status(400).json({
        success: false,
        message: "Verification code has expired.",
      });
    }

    if (parseInt(verificationCode) !== storedCode) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code." });
    }

    // Hash password and insert user into database
    const userData = verificationCodes[email].userData;
    // console.log(userData);
    userData.password = await bcrypt.hash(userData.password, 12);

    userData.created_at = new Date();
    userData.deleted_at = null;

    await account(userData);

    delete verificationCodes[email]; // Remove temporary data after successful verification

    res.json({
      success: true,
      message: "User verified and registered successfully.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Verification failed." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  db = await connection();
  //const db = mongoose.connection;
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.json({ code: 0, message: "Invalid username !" });
  }
  // To check a password:
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ code: 0, message: "Invalid  password !" });
  }

  res.json({
    code: 1,
    message: "Login successful",
    user: {
      username: user.username,
      email: user.email,
      id: user._id,
      account: user.account,
    },
  });
});
// Return list of provinces
app.get("/api/provinces", async (request, response) => {
  let provinces = await getProvinces();
  response.json(provinces); //send JSON object with appropriate JSON headers
});

// Return list of cities follow province
app.get("/api/cities/:provinceId", async (request, response) => {
  const { provinceId } = request.params; // Get the provinceId from the request URL
  let cities = await getCities(provinceId);
  response.json(cities);
});

//Return list of accounts
app.get("/api/accounts", async (request, response) => {
  let accounts = await getAccounts();
  response.json(accounts); //send JSON object with appropriate JSON headers
});

// Return list of precriptions in pharmacy dashboard
app.get("/api/prescriptions", async (request, response) => {
  let pres = await getPrescriptions();
  response.json(pres); //send JSON object with appropriate JSON headers
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

/**FUNCTION TO RETRIEVE DATA */

/* Async function to retrieve all provinces from scenarios collection. */
async function getProvinces() {
  db = await connection(); //await result of connection() and store the returned db
  //const db = mongoose.connection;
  var results = await db.collection("provinces").find({}); //{} as the query means no filter, so select all
  res = results.toArray();
  return res;
}
/* Async function to retrieve all cities from scenarios collection. */
async function getCities(provinceId) {
  db = await connection(); //await result of connection() and store the returned db
  //const db = mongoose.connection;
  const reid = new ObjectId(provinceId);
  var results = db.collection("cities").find({ provinceId: reid }).toArray(); //{} as the query means no filter, so select all
  return results;
}
/* Async function to retrieve all accounts from accounts collection. */
async function getAccounts() {
  db = await connection(); //await result of connection() and store the returned db
  // const db = mongoose.connection;
  var results = db.collection("accounts").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve all prescriptions from prescriptions collection. */
async function getPrescriptions() {
  db = await connection(); //await result of connection() and store the returned db
  // const db = mongoose.connection;
  var results = db.collection("prescriptions"); //{} as the query means no filter, so select all
  const combinedData = await results.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },

    {
      $project: {
        _id: 1,
        doctorId: 1,
        "doctor.firstname": 1,
        "doctor.lastname": 1,
        prescription_file: 1,
        created: 1,
      },
    },
  ]);

  const res = await combinedData.toArray();
  console.log(res);
  return res;
}
/**END FUNCTION TO RETRIEVE DATA */

/**FUNCTION TO ADD DATA */
/* Async function to insert account information of a customer into customers collection. */

async function account(userData) {
  db = await connection(); //await result of connection() and store the returned db
  //const db = mongoose.connection;
  let status = await db.collection("users").insertOne(userData);
  console.log(status);
}

// dashboard routes
// app.use("/prescription", doctorDashboardRoutes);

//MongoDB functions
async function connection() {
  await client.connect();
  db = client.db("mediBridge"); //select paintball database
  return db;
}
// mongoose
//   .connect(dbUrl)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
