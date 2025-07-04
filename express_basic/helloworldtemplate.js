import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    title: "This is an exprees App",
    subtitle: "Using EJS as template engine",
  });
});

app.listen(port, () => {
  console.log("Server listening...");
});
