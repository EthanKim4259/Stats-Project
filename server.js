const express = require("express");
const path = require("path");
const {DbWrapper} = require("./DbWrapper.js");
const port = 3000;

const app = express();
const dbWrapper = new DbWrapper(process.env.URL);

app.use(express.urlencoded({extended: true}));

let type = 0;
app.get("/api/get_survey", (req, res) => {
	type ^= 1;
	res.json({type});
});

let index = 0;
app.post("/api/post_survey", async (req, res) => {
	const {type, hours, classes, difficulty} = req.body;
	await dbWrapper.addData(type, hours, classes, difficulty);
	res.redirect("/finish.html")
});

app.listen(port, () => {
	console.log(`Listening @ port ${port}!`);
});
