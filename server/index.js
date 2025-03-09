const express = require("express");
const path = require("path"); // module to help with file path
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const upload = multer({ storage: multer.memoryStorage() });
dotenv.config();

// const doctorDashboardRoutes = require("./routes/doctorDashboard");
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");

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
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.json({ code: 0, message: "Invalid username !" });
  }
  // To check a password:
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!user.password || !isPasswordValid) {
    return res.json({ code: 0, message: "Invalid password !" });
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

/** START OF PHARMACY SECTION */
// Return list of precriptions in pharmacy dashboard
app.get("/api/pharmacy/prescriptions/:id", async (request, response) => {
  let userId = request.params.id;
  let pres = await getPharmacyPrescriptions(userId);
  response.json(pres); //send JSON object with appropriate JSON headers
});

/**END PHARMACY SECTION */

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

/**FUNCTION TO RETRIEVE DATA */

/* Async function to retrieve all provinces from scenarios collection. */
async function getProvinces() {
  db = await connection(); //await result of connection() and store the returned db

  var results = await db.collection("provinces").find({}); //{} as the query means no filter, so select all
  res = results.toArray();
  return res;
}
/* Async function to retrieve all cities from scenarios collection. */
async function getCities(provinceId) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(provinceId);
  var results = db.collection("cities").find({ provinceId: reid }).toArray(); //{} as the query means no filter, so select all
  return results;
}
/* Async function to retrieve all accounts from accounts collection. */
async function getAccounts() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("accounts").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve all prescriptions from prescriptions collection for pharmacy. */
async function getPharmacyPrescriptions(id) {
  db = await connection(); //await result of connection() and store the returned db
  const userId = new ObjectId(id);
  var results = db.collection("prescriptions"); //{} as the query means no filter, so select all
  const combinedData = await results.aggregate([
    { $match: { pharmacyId: userId } },
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
      $lookup: {
        from: "deliveryStatus",
        localField: "deliveryStatus",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    { $match: { "status.status": "New" } },
    {
      $project: {
        _id: 1,
        doctorId: 1,
        "doctor.firstname": 1,
        "doctor.lastname": 1,
        prescription_file: 1,
        "status.status": 1,
        pharmacyId: 1,
        created: 1,
      },
    },
  ]);

  const res = await combinedData.toArray();
  return res;
}

/**END FUNCTION TO RETRIEVE DATA */

/**FUNCTION TO ADD DATA */
/* Async function to insert account information of a customer into customers collection. */

async function account(userData) {
  db = await connection(); //await result of connection() and store the returned db
  let status = await db.collection("users").insertOne(userData);
  
  // console.log(status);
}

// Async function to update status of prescription
async function status(id) {
  db = await connection();
  const preId = new ObjectId(id);
  const result = db.collection("prescriptions").findOne({ _id: preId });
  return result;
}

/**END FUNCTION TO ADD DATA */

// dashboard routes

app.post(
  "/prescription/submit",
  upload.single("prescription_file"),
  async (req, res, next) => {
    try {
      const { patient_id, doctor_id, pharmacy_id, ...data } = req.body;
      const file = req.file;
      console.log(req.body, "req.body");

      console.log("Received File:", file);

      if (!file) {
        return res.status(400).json({ code: 0, message: "File is required!" });
      }

      const db = await connection();
      const result = await db.collection("prescription").insertOne({
        ...data,
        patient_id: new ObjectId(patient_id),
        doctor_id: new ObjectId(doctor_id),
        // pharmacy_id: new ObjectId(pharmacy_id),
        prescription_file: file.buffer.toString("base64"),
      });

      console.log("DB Insert Result:", result);

      if (result.acknowledged) {
        return res.json({
          code: 1,
          message: "Prescription submitted successfully!",
        });
      } else {
        return res.status(500).json({
          code: 0,
          message: "Failed to insert into the database.",
        });
      }
    } catch (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ code: 0, message: "Internal Server Error" });
    }
  }
);

app.get("/prescription/patient", async (req, res, next) => {
  try {
    db = await connection();

    const patientList = await db
      .collection("users")
      .find({ account: "3" })
      .toArray();

    const patientRes = patientList.map(
      ({ _id, firstname, lastname, account, email, address }) => {
        const res = { _id, firstname, lastname, account, email, address };
        return res;
      }
    );

    res.json({
      patientList: patientRes,
    });
  } catch (err) {
    next(err);
  }
});
app.get("/prescription/pharmacy", async (req, res, next) => {
  try {
    db = await connection();

    const pharmacyList = await db
      .collection("users")
      .find({ account: "2" })
      .toArray();

    const pharmacyRes = pharmacyList.map(
      ({
        _id,
        firstname,
        lastname,
        account,
        email,
        address,
        city,
        province,
      }) => {
        const res = {
          _id,
          firstname,
          lastname,
          account,
          email,
          address,
          city,
          province,
        };
        return res;
      }
    );
    console.log(pharmacyRes, "pharmacyRes");
    res.json({
      pharmacyList: pharmacyRes,
    });
  } catch (err) {
    next(err);
  }
});
app.get("/prescription/city/:city", async (req, res, next) => {
  try {
    db = await connection();
    const { city } = req.params;
    console.log(city, "sssss");
    const cityName = await db
      .collection("cities")
      .find({ _id: new ObjectId(city) })
      .toArray();

    res.json({
      cityName,
    });
  } catch (err) {
    next(err);
  }
});
app.get("/prescription/province/:province", async (req, res, next) => {
  try {
    db = await connection();
    const { province } = req.params;

    const provinceName = await db
      .collection("provinces")
      .find({ _id: new ObjectId(province) })
      .toArray();

    res.json({
      provinceName,
    });
  } catch (err) {
    next(err);
  }
});
app.post("/prescription/addPatient", async (req, res, next) => {
  try {
    const data = req.body || {};
    const { email } = data;
    db = await connection();
    db.collection("users")
      .insertOne(data)
      .then(() => {
        // send email to user

        res.json({
          code: 1,
          message: "Add patient successfully!",
        });
      });
  } catch (err) {
    next(err);
  }
});
// MongoDB functions

async function connection() {
  await client.connect();
  db = client.db("mediBridge"); //select paintball database
  return db;
}
