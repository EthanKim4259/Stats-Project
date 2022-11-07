const express = require("express");
const path = require("path");
const {DbWrapper} = require("./DbWrapper.js");
const port = 3000;

const app = express();
const dbWrapper = new DbWrapper(process.env.URL);

app.use("/static", express.static("static"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "survey.html"));
});

let type = 0;
app.get("/get_survey", (req, res) => {
	type ^= 1;
	res.json({type});
});

let index = 0;
app.post("/post_survey", async (req, res) => {
	const {type, hours, classes, difficulty} = req.body;
	await dbWrapper.addData(type, hours, classes, difficulty);
	res.sendFile(path.join(__dirname, "finish.html"));
});

app.listen(port, () => {
	console.log(`Listening @ port ${port}!`);
});