const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const nodemailer = require("nodemailer");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static('public')); // Change 'public' to your actual folder
app.use(express.static(path.join(__dirname)));

// Use Sessions
app.use(session({
    secret: 'k0@4iAdi', // Replace with a strong key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 } // 1-hour session
}));

// Example in Node.js/Express
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (not recommended for production)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "yasirwebsitedatabase",
});

// Middleware to Parse Data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MySQL
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected");
  }
});

// fetch laptop form databasse

app.get("/api/laptop", (req, res) => {
  const query = "SELECT * FROM laptops"; // Fetch all laptops from database

  db.query(query, (err, result) => {
      if (err) {
          return res.status(500).json({ error: "Database error" });
      }
      res.json(result);
  });
});

// Endpoint to get laptop details by ID
app.get('/laptop/:id', (req, res) => {
  const laptopId = req.params.id;

  // Query to fetch laptop details
  const query = 'SELECT * FROM laptops WHERE id = ?';
  db.query(query, [laptopId], (err, results) => {
      if (err) {
          console.error('Error fetching laptop details:', err);
          res.status(500).send('Error fetching laptop details');
          return;
      }

      if (results.length === 0) {
          res.status(404).send('Laptop not found');
          return;
      }

      const laptop = results[0];
      res.json(laptop); // Send laptop details as JSON
  });
});


app.get('/related-laptops/:category', (req, res) => {
  const category = req.params.category;

  // Query to fetch related laptops
  const query = 'SELECT * FROM laptops WHERE category = ? LIMIT 4'; // Limit to 4 related laptops
  db.query(query, [category], (err, results) => {
      if (err) {
          console.error('Error fetching related laptops:', err);
          res.status(500).send('Error fetching related laptops');
          return;
      }

      res.json(results); // Send related laptops as JSON
  });
});


// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
      const laptopName = req.body.name ? req.body.name.replace(/\s+/g, "_").toLowerCase() : "laptop";
      cb(null, laptopName + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Insert data into 'laptops' table

app.post("/addLaptop", upload.single("image"), (req, res) => {
  const {
      category, name, price, description, model, generation, processor, ram,
      storage, display, keyboard_light, numeric_keyboard, color, weight, 
      operating_system, warranty
  } = req.body;
  
  const image = req.file ? req.file.filename : null;

  if (!image) {
      return res.status(400).json({ message: "Image upload failed" });
  }

  const query = `
      INSERT INTO laptops (category, name, price, description, model, generation, processor, ram, storage, 
          display, keyboard_light, numeric_keyboard, color, weight, operating_system, warranty, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [category, name, price, description, model, generation, processor, ram, storage, display,
      keyboard_light, numeric_keyboard, color, weight, operating_system, warranty, image], (err, result) => {
      if (err) {
          console.error("Database insert error:", err);
          return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ message: "Laptop added successfully!", id: result.insertId });
  });
});


// Email Transporter

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

// send mail

const sendEmail = (name, senderEmail, message) => {
  const mailOptions = {
      from: process.env.EMAIL_USER, // Your email
      to: process.env.RECEIVER_EMAIL, // Your receiving email
      subject: "New Contact Form Submission",
      html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
          <p><strong>Message:</strong> ${message}</p>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log("Error sending email:", error);
      } else {
          console.log("Email sent:", info.response);
      }
  });
};

// email api

app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
  }

  sendEmail(name, email, message);

  res.json({ message: "Message sent successfully!" });
});

// Serve Static Files
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Routes

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

// Login Route

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE name = ?";
  db.query(sql, [username], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.length === 0) {
          return res.status(401).json({ message: "User not found" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user session
      req.session.user = { id: user.id, username: user.name };

      res.json({ success: true, message: "Login successful", username: user.name });
  });
});

// Check user login Status

app.get("/api/user", (req, res) => {
  if (req.session.user) {
      return res.json({ loggedIn: true, username: req.session.user.username });
  }
  res.json({ loggedIn: false });
});

// Logout

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: "Logged out successfully" });
});

// Signin Route

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    const sql = "INSERT INTO users (name, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // Store user session after successful signup
      req.session.user = { id: result.insertId, username: username };

      res.json({ success: true, message: "User registered successfully!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Check if user is signed in
app.get("/api/users", (req, res) => {
  if (req.session.user) {
    return res.json({ signIn: true, username: req.session.user.username });
  }
  res.json({ signIn: false });
});


// Serve HTML Pages

app.get("/home.html", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "signin.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/signin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "signin.html"));
});

app.get("/accesories.html", (req, res) => {
    res.sendFile(path.join(__dirname, "accesories.html"));
});

app.get("/chromobook.html", (req, res) => {
    res.sendFile(path.join(__dirname, "chromobook.html"));
});

app.get("/dell.html", (req, res) => {
    res.sendFile(path.join(__dirname, "dell.html"));
});

app.get("/hp.html", (req, res) => {
    res.sendFile(path.join(__dirname, "hp.html"));
});

app.get("/lenovo.html", (req, res) => {
    res.sendFile(path.join(__dirname, "lenovo.html"));
});

app.get("/macbook.html", (req, res) => {
    res.sendFile(path.join(__dirname, "macbook.html"));
});

app.get("/services.html", (req, res) => {
  res.sendFile(path.join(__dirname, "services.html"));
});

app.get("/about.html", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/contactus.html", (req, res) => {
  res.sendFile(path.join(__dirname, "contactus.html"));
});

app.get("/adminpanel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "adminpanel.html"));
});

app.get("/chart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "chart.html"));
});

app.get("/checkout.html", (req, res) => {
  res.sendFile(path.join(__dirname, "checkout.html"));
});

app.get("/desc.html", (req, res) => {
  res.sendFile(path.join(__dirname, "desc.html"));
});


// Start the Server
app.listen(5000, () => {
  console.log("Server Started on port 5000");
});


// Hii this is for my only the test is it showing on another place