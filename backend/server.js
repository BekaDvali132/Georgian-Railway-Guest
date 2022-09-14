const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { upload } = require("./functions/imageUpload");
const { unlink } = require('fs');
const port = process.env.PORT || 5000;
const {path} = require('path')

const app = express();

// middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

app.post("/api/images", upload.single("image"), (req, res) => {
  res.status(200).json({
    status: "success",
    image_path: req.file.path,
  });
});

app.delete("/api/images", (req, res) => {
  // const imagePath = path.join(path.resolve(__dirname, '..'), req.query.image_path);
  
  unlink(req.query.image_path, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        status: "success",
      });
    }
  });
});

app.use("/api/countries", require("./routes/countryRoutes"));

app.listen(port, () => console.log(`server started on port ${port}`));
