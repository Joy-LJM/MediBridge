const express = require("express");
const path = require("path"); // module to help with file path
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const doctorDashboardRoutes = require("./routes/doctorDashboard");
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");
const { Connection, default: mongoose } = require("mongoose");

const app = express();
const port = process.env.PORT || "3000";

// const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/paintball`;
const dbUrl = "mongodb://localhost:27017/mediBridge"; //default port is 27017
// const client = new MongoClient(dbUrl);
// sgMail.setApiKey(process.env.API_KEY);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request

//allow requests from all servers
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// app.use(parser());

app.post("/register", async (request, response) => {
  //for POST data, retrieve field data using request.body.<field-name>
  //for a GET form, use app.get() and request.query.<field-name> to retrieve the GET form data

  //retrieve values from submitted POST form
  let firstname = request.body.firstname;
  let lastname = request.body.lastname;
  let email = request.body.email;
  let pass = request.body.password;
  let phone = request.body.phone;
  let address = request.body.address;
  let city = request.body.city;
  let province = request.body.province;
  let acc = request.body.account;
  let create = new Date();
  let deleted = null;
  bcrypt.hash(pass, 12).then((hash) => {
    let infor = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hash,
      phone: phone,
      address: address,
      city: city,
      province: province,
      account: acc,
      created_at: create,
      deleted_at: deleted,
    };
    account(infor);
    response.json("success");
  });
  //redirect back to sign in page
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // db = await connection();
  const db = mongoose.connection;
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
      accountType: user.account,
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

/**FUNCTION TO RETRIEVE DATA */

/* Async function to retrieve all provinces from scenarios collection. */
async function getProvinces() {
  // db = await connection(); //await result of connection() and store the returned db
  const db = mongoose.connection;
  var results = await db.collection("provinces").find({}); //{} as the query means no filter, so select all
  res = results.toArray();
  return res;
}
/* Async function to retrieve all cities from scenarios collection. */
async function getCities(provinceId) {
  // db = await connection(); //await result of connection() and store the returned db
  const db = mongoose.connection;
  const reid = new ObjectId(provinceId);
  var results = db.collection("cities").find({ provinceId: reid }).toArray(); //{} as the query means no filter, so select all
  return results;
}

/**END FUNCTION TO RETRIEVE DATA */

/**FUNCTION TO ADD DATA */
/* Async function to insert account information of a customer into customers collection. */

async function account(userData) {
  // db = await connection(); //await result of connection() and store the returned db
  const db = mongoose.connection;
  let status = await db.collection("users").insertOne(userData);
  console.log(status);
}

//
app.use("/prescription", doctorDashboardRoutes);

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//MongoDB functions
// async function connection() {
//   await client.connect();
//   db = client.db("mediBridge"); //select paintball database
//   return db;
// }
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
