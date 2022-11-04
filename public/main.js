const questions = [
	{
		question: "How many hours do you spend on homework every day?",
		name: "hours",
		min: 0,
		max: 12,
		step: 0.5,
		value: 0
	},
	{
		question: "How many classes do you have a B or below in?",
		name: "classes",
		min: 0,
		max: 7,
		step: 1,
		value: 0
	},
	{
		question: "On a scale from 1-10, how hard are your classes?",
		name: "difficulty",
		min: 1,
		max: 10,
		step: 0.5,
		value: 1
	}
];

const orders = [
	[0, 1, 2],
	[2, 1, 0]
];

function displayByType(type) {
	const order = orders[type];
	
	// Create form element
	const form = document.createElement("form");
	form.setAttribute("action", "/post_survey");
	form.setAttribute("method", "POST");

	// Add questions in order
	for (let i = 0; i < order.length; i++) {
		// Destructure question object
		const {question, name, min, max, step, value} = questions[order[i]];
		
		// Create question wrapper
		const wrapper = document.createElement("div");
		wrapper.setAttribute("class", "question_wrapper");
		wrapper.setAttribute("state", "hidden");
		
		// Create requisite question elements
		const header = document.createElement("h2");
		header.setAttribute("class", "question_header");
		header.textContent = `Question #${i + 1}`;
		
		const label = document.createElement("h3");
		label.setAttribute("class", "question_label");
		label.textContent = question;

		const slider = document.createElement("div");
		slider.setAttribute("class", "question_slider");
		
		const input = document.createElement("input");
		input.setAttribute("class", "question_input");
		input.setAttribute("oninput", "this.nextElementSibling.textContent = this.value;");
		input.setAttribute("name", name);
		input.setAttribute("min", min);
		input.setAttribute("max", max);
		input.setAttribute("step", step);
		input.setAttribute("value", value);
		input.setAttribute("type", "range");
		
		const output = document.createElement("output");
		output.setAttribute("class", "question_output");
		output.textContent = value;

		const button = document.createElement("button");
		button.setAttribute("class", "question_button");
		button.setAttribute("type", "button");
		button.setAttribute("onclick", `activateButton(${i});`);
		button.textContent = nameButton(i);

		// Append slider elements to slider
		slider.appendChild(input);
		slider.appendChild(output);

		// Append question elements to wrapper
		wrapper.appendChild(header);
		wrapper.appendChild(label);
		wrapper.appendChild(slider);
		wrapper.appendChild(button);

		// Append wrapper to form
		form.appendChild(wrapper);
	}

	// Add hidden type field
	const hidden = document.createElement("input");
	hidden.setAttribute("name", "type");
	hidden.setAttribute("type", "hidden");
	hidden.setAttribute("value", type);

	// Append hidden type field to form
	form.appendChild(hidden);
	
	// Append entire form to document body
	const body = document.querySelector("body");
	body.appendChild(form);

	// Activate first wrapper
	nthWrapper(0).setAttribute("state", "active");

	// Adjust scroll to first wrapper
	window.scrollTo(0, 0);
}

function nthWrapper(i) {
	// Return nth wrapper
	return document.querySelector(`.question_wrapper:nth-child(${i + 1})`);
}

function nameButton(i) {
	// If final button, show 'Submit'
	if (i == questions.length - 1) return "Submit";
	return "Next";
}

function activateButton(i) {
	// Mark current wrapper as complete
	nthWrapper(i).setAttribute("state", "complete");
	// Activate next wrapper
	if (i + 1 < questions.length) nthWrapper(i + 1).setAttribute("state", "active");
	// If final button, submit
	if (i == questions.length - 1) document.querySelector("form").submit();
}

(async () => {
	// Fetch survey type
	const {type} = await fetch("./get_survey")
		.then(i => i.json());
	// Build webpage
	displayByType(type);
})();