const express = require("express");
const path = require("path");
const fs = require('fs');
const bodyParser = require("body-parser");
const multer = require("multer");
// const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const mongoConnect = require("./utils/database").mongoConnect;
const {port} = require('./config');

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  )
    return cb(null, true);
  else return cb(null, false);
};

const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

const app = express();
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multer({ fileFilter: fileFilter, storage: storage }).single("image"));

app.use(compression());
app.use(helmet());
app.use(morgan('combined', {stream: logStream}));

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// app.use(cors());

app.use("/auth", authRoutes);
app.use(chatRoutes);

app.use((err, req, res, next) => {
  let error = {};
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Something went wrong!";

  res.status(error.statusCode).json({ error: error });
});

mongoConnect(() => {
  const io = require("./utils/socketio").init(app.listen(port));
  io.on('connection', () => console.log('A client was connected!'));
});
