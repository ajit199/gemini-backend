const express = require("express");
const getPosts = require("./gemini-chat");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is working");
});

app.post("/get-posts", getPosts);

app.listen(5500, () => {
  console.log(`Server is running.`);
});
