const express = require("express");
const path = require("path"); // module to help with file path
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const multer = require("multer");
dotenv.config();

const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || "3000";

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/mediBridge`;
// const dbUrl = "mongodb://localhost:27017/mediBridge"; //default port is 27017
const client = new MongoClient(dbUrl);
sgMail.setApiKey(process.env.API_KEY);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request
// app.use("/uploads", express.static("uploads"));
// Set the Content Security Policy header
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
    postCode,
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
      postCode,
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
  const user = await db
    .collection("users")
    .aggregate([
      { $match: { email } },
      {
        $lookup: {
          from: "provinces",
          localField: "province",
          foreignField: "_id",
          as: "provinceDetails",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "city",
          foreignField: "_id",
          as: "cityDetails",
        },
      },
      {
        $unwind: { path: "$provinceDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$cityDetails", preserveNullAndEmptyArrays: true },
      },
    ])
    .toArray(); // FIXED: Convert cursor to array
  if (!user.length) {
    return res.json({ code: 0, message: "Invalid username!" });
  }

  const userData = user[0] || {};
  console.log(userData, "userData");
  // To check a password:
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!userData.password || !isPasswordValid) {
    return res.json({ code: 0, message: "Invalid password !" });
  }

  res.json({
    code: 1,
    message: "Login successful",
    user: {
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      id: userData._id,
      account: userData.account,
      address: userData.address,
      province: userData.province,
      phone: userData.phone,
      city: userData.city,
    },
  });
});

let validateCode = {};
app.post("/validateEmail", async (req, res) => {
  const { email } = req.body;
  db = await connection();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.json({ code: 0, message: "Email is not found!" });
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  const emailData = {
    to: email,
    from: "hathaonhin@gmail.com",
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };
  console.log(code, "code");

  validateCode.code = code;
  validateCode.email = email;
  validateCode.expiresAt = Date.now() + verification_time;

  const emailRes = await sgMail.send(emailData);
  if (emailRes) {
    res.json({
      code: 1,
      message: "Send code successfully",
      userInfo: {
        _id: user._id,
      },
    });
  }
});
app.post("/validateCode", async (req, res) => {
  const { email, code } = req.body;
  db = await connection();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.json({ code: 0, message: "Email is not found!" });
  }

  if (Date.now() > validateCode.expiresAt) {
    validateCode = {}; // Remove expired code
    return res.json({
      code: 0,
      message: "Verification code has expired.",
    });
  }

  if (parseInt(code) !== validateCode.code) {
    return res.json({ code: 0, message: "Invalid verification code." });
  }

  res.json({
    code: 1,
    message: "Valid verification code",
  });
});
app.post("/resetPsw", async (req, res) => {
  try {
    const { _id, password } = req.body;

    db = await connection();
    const hasPsw = await bcrypt.hash(password, 12);
    const user = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(_id) }, { $set: { password: hasPsw } });
    if (user.modifiedCount === 0) {
      return res.json({ code: 0, message: "Password reset failed!" });
    }

    res.json({
      code: 1,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: "Internal server error." });
  }
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
  // console.log(userId);
  let pres = await getPharmacyPrescriptions(userId);
  console.log(pres);
  response.json(pres); //send JSON object with appropriate JSON headers
});

//Update status of prescription
app.put("/api/pharmacy/prescription/update/:id", async (req, res) => {
  let preId = req.params.id;
  let { deliveryStatus } = req.body;

  const statusId = await getStatusId(deliveryStatus);
  const result = await updateStatus(preId, statusId);

  // Respond with appropriate status and message
  res.status(result.status).json({
    status: result.status === 200 ? "success" : "error",
    message: result.message,
  });
});

/**END PHARMACY SECTION */

//Return list of orders
app.get("/api/orders", async (request, response) => {
  let orders = await getOrders();
  console.log(orders);
  response.json(orders); //send JSON object with appropriate JSON headers
});

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

/* Async function to retrieve all orders*/
async function getOrders() {
  db = await connection();

  var results = await db
    .collection("prescriptions")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "pharmacy_id",
          foreignField: "_id",
          as: "pharmacyDetails",
        },
      },
      {
        $unwind: { path: "$pharmacyDetails", preserveNullAndEmptyArrays: true },
      }, // Unwind to get single patient object
      {
        $lookup: {
          from: "users",
          localField: "patient_id",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $unwind: { path: "$patientDetails", preserveNullAndEmptyArrays: true },
      }, // ✅ Unwind to get single patient object
      {
        $lookup: {
          from: "deliveryStatus",
          localField: "delivery_status",
          foreignField: "_id",
          as: "statusDetails",
        },
      },
      { $unwind: { path: "$statusDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          pharmacyLocation: "$pharmacyDetails.address",
          customerLocation: "$patientDetails.address", // ✅ Extract only the address
          remark: 1,
          status: "$statusDetails.status", // ✅ Extract status
        },
      },
    ])
    .toArray();

  console.log("Orders with Patient Address:", results); // ✅ Debugging log
  return results;
}

/* Async function to retrieve all cities from scenarios collection. */
async function getCities(provinceId) {
  db = await connection(); //await result of connection() and store the returned db

  const reid = new ObjectId(provinceId);
  var results = db.collection("cities").find({ provinceId: reid }).toArray(); //{} as the query means no filter, so select all
  return results;
}
/* Async function to retrieve all accounts from scenarios collection. */
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
    { $match: { pharmacy_id: userId } }, // changed pharmacyId to pharmacy_id
    {
      $lookup: {
        from: "users",
        localField: "doctor_id", // changed doctorId to doctor_id
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "deliveryStatus",
        localField: "delivery_status",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        doctor_id: 1, //
        "doctor.firstname": 1,
        "doctor.lastname": 1,
        prescription_file: 1,
        "status.status": 1,
        pharmacy_id: 1, //
        created: 1,
      },
    },
  ]);

  const res = await combinedData.toArray();
  console.log("results", res);
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

//Async function to get status id through status name
async function getStatusId(deliveryStatus) {
  db = await connection();
  const statusDoc = await db
    .collection("deliveryStatus")
    .findOne({ status: deliveryStatus });
  return statusDoc._id;
}

// Async function to update status of prescription
async function updateStatus(id, statusId) {
  db = await connection();
  const preId = new ObjectId(id);
  const result = await db
    .collection("prescriptions")
    .updateOne(
      { _id: preId },
      { $set: { deliveryStatus: statusId, updated_at: new Date() } }
    );

  if (result.modifiedCount === 0) {
    return { status: 404, message: "Prescription not found" };
  }

  const updatedStatus = db.collection("prescriptions").findOne({ _id: preId });
  return {
    status: 200,
    message: "A Status updated successfully",
    schedule: updatedStatus,
  };
}

/**END FUNCTION TO ADD DATA */

// doctor dashboard routes
const upload = multer({ dest: "uploads/" });
app.post(
  "/prescription/submit",
  upload.single("prescription_file"),
  async (req, res, next) => {
    try {
      const { patient_id, doctor_id, pharmacy_id, ...data } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ code: 0, message: "File is required!" });
      }

      const db = await connection();
      const result = await db.collection("prescriptions").insertOne({
        ...data,
        patient_id: new ObjectId(patient_id),
        doctor_id: new ObjectId(doctor_id),
        pharmacy_id: new ObjectId(pharmacy_id),
        prescription_file: file,
      });

      console.log("DB Insert Result:", result);

      if (result.acknowledged) {
        return res.json({
          code: 1,
          message: "Prescription is submitted successfully!",
        });
      }
    } catch (err) {
      next(err);
    }
  }
);
app.get("/prescription/patient", async (req, res, next) => {
  try {
    db = await connection();

    const patientList = await db
      .collection("users")
      .find({ account: "67b270a10a93bde65f142af3" })
      .toArray();

    const patientRes = await Promise.all(
      patientList.map(
        async ({
          _id,
          firstname,
          lastname,
          account,
          email,
          address,
          city,
          province,
          postCode,
        }) => {
          const [cityData, provinceData] = await Promise.all([
            db.collection("cities").findOne({ _id: new ObjectId(city) }),
            db.collection("provinces").findOne({ _id: new ObjectId(province) }),
          ]);

          return {
            _id,
            firstname,
            lastname,
            account,
            email,
            address: `${address}${cityData ? "," + cityData.name : ""}${
              provinceData ? "," + provinceData.name : ""
            },${postCode}`,
          };
        }
      )
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
      .find({ account: "67b270940a93bde65f142af2" })
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
        // postalCode
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

    const cityName = await db
      .collection("cities")
      .findOne({ _id: new ObjectId(city) });

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
      .findOne({ _id: new ObjectId(province) });

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
    const initialPsw = "123456";
    const hasPsw = await bcrypt.hash(initialPsw, 12);
    db = await connection();
    db.collection("users")
      .insertOne({ ...data, password: hasPsw })
      .then(async () => {
        // Send verification email
        const websiteUrl = "http://localhost:5173/";
        const emailData = {
          to: email,
          from: "hathaonhin@gmail.com",
          subject: "Welcome to MediBridge!",
          text: `Your MediBridge account is registered successfully. `,
          html: `<p>Your MediBridge account is registered successfully. Your initial password is: <strong>${initialPsw}</strong>, please update your password via ${websiteUrl}.</p>`,
        };

        await sgMail.send(emailData);
        res.json({
          code: 1,
          message: "Add patient successfully!",
        });
      });
  } catch (err) {
    next(err);
  }
});
// patient dashboard
app.get("/user/orders", async (req, res, next) => {
  try {
    const { userId, idType } = req.query;
    console.log(userId, "userId");

    db = await connection();
    var results = await db
      .collection("prescriptions")
      .aggregate([
        {
          $match: { [idType]: new ObjectId(userId) },
        },
        {
          $lookup: {
            from: "deliveryStatus",
            let: { delivery_status: "$delivery_status" }, //defining a variable called delivery_status and assigning it the value of the delivery_status field from the prescriptions collection
            pipeline: [
              //define a series of aggregation stages that will be executed in order
              {
                $match: {
                  $expr: {
                    //$expr evaluate an expression that checks if the _id field of the current document in the deliveryStatus collection is equal to the delivery_status variable we defined earlier.
                    $eq: ["$_id", { $toObjectId: "$$delivery_status" }], //converts the delivery_status variable to an ObjectId.
                  },
                },
              },
              {
                $project: {
                  //transform documents by adding or removing fields.
                  _id: 0, //removing the _id field
                  status: 1, //keep status field
                },
              },
            ],
            as: "delivery_status_value",
          },
        },
        {
          $addFields: {
            delivery_status_value: {
              $arrayElemAt: ["$delivery_status_value.status", 0], //extract the first element of the status array and assign to the new field delivery_status_value
            },
          },
        },

        {
          $sort: {
            //sorts the results by the uploaded_date field in descending order
            uploaded_date: -1,
          },
        },
      ])
      .toArray();
    console.log(results, "results");
    return res.json(results);
  } catch (err) {
    next(err);
  }
});
app.post("/patient/addReview", async (req, res, next) => {
  try {
    const data = req.body;

    const db = await connection();
    db.collection("review")
      .insertOne({ ...data, user_id: new ObjectId(data.user_id) })
      .then(() => {
        res.json({
          code: 1,
          message: "Comment is submitted successfully!",
        });
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
const uploadDir = path.join(__dirname, "uploads");

app.get("/prescription/:id/download", async (req, res, next) => {
  try {
    const id = req.params.id;
    const db = await connection();

    db.collection("prescriptions")
      .findOne({ _id: new ObjectId(id) })
      .then((prescription) => {
        if (!prescription) {
          return res.status(404).send({ message: "Prescription not found" });
        }
        const filePath = path.join(
          uploadDir,
          prescription.prescription_file.filename
        );
        res.download(filePath, prescription.prescription_file.originalname);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
// uer profile
app.post("/user/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    db = await connection();
    const user = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: data });
    if (user.modifiedCount === 0) {
      return res.json({ code: 0, message: "Information update failed!" });
    }

    res.json({
      code: 1,
      message: "Information update successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: "Internal server error." });
  }
});
app.get("/user/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;

    db = await connection();
    const user = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    if (user.deletedCount === 0) {
      return res.json({ code: 0, message: "Account deletion failed!" });
    }

    res.json({
      code: 1,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: "Internal server error." });
  }
});
app.get("/prescription/:id/view", async (req, res, next) => {
  try {
    const id = req.params.id;
    const db = await connection();

    db.collection("prescriptions")
      .findOne({ _id: new ObjectId(id) })
      .then((prescription) => {
        console.log(prescription, "prescription");

        if (!prescription) {
          return res.status(404).send({ message: "Prescription not found" });
        }
        const filePath = path.join(
          __dirname,
          "uploads",
          prescription.prescription_file.filename
        );
        // Set the appropriate Content-Type for display
        res.setHeader("Content-Type", prescription.prescription_file.mimetype);
        // Send file for inline viewing
        res.sendFile(filePath);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// MongoDB functions
async function connection() {
  await client.connect();
  db = client.db("mediBridge"); //select paintball database
  return db;
}
