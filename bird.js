
function fetchBird() {
	fetch('http://5.22.220.255:5001/graphql', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},

		body: JSON.stringify({
			query: `query{
						allBirds(orderBy: ENGLISH_ASC){
							nodes{
								english
							}
						}
					}`,
		})
	})
	.then(res => res.json())
	.then(res => selectList(JSON.stringify(res)));
}

function selectList(dataString) {
	//	console.log(dataString);
	let resData = JSON.parse(dataString);
	let options = resData.data.allBirds.nodes;
	let optionList = document.getElementById('birdName').options;
	options.forEach(option =>
		optionList.add(
			new Option(option.english)
		)
	);
}

function add() {
	let input_bird = document.getElementById('birdName').value;
	let input_dateTime = document.getElementById('dateTime').value;
	let input_location = document.getElementById('location').value;
	let input_email = document.getElementById('email').value;

	console.log(input_bird, input_dateTime, input_location, input_email);

	fetch('http://5.22.220.255:5001/graphql', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},

		body: JSON.stringify({
			query: 'mutation createObservation($Input: CreateObservationInput!){\
				createObservation(input:$Input){\
				  name:observation{\
					bird\
					datetime\
					location\
					email\
				  }\
				}\
			  }\
			',
			variables: {
				Input: {
					"observation":{
						"bird": input_bird,
						"datetime": input_dateTime,
						"location": input_location,
						"email": input_email
					}
				}
			}
		})
	})
	.then(res => console.log(res));
}

function fetchObservationList() {
	fetch('http://5.22.220.255:5001/graphql', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},

		body: JSON.stringify({
			query: `query{
						allObservations{
							nodes{
								bird
								datetime
								location
								email
							}
						}
					}`,
		})
	})
	.then(res => res.json())
	.then(res => printObservationList(JSON.stringify(res)));
}

function printObservationList(dataString) {
	console.log(dataString);
	let resData = JSON.parse(dataString);
	let observations = resData.data.allObservations.nodes;
	let observationTable = document.querySelector('#observationTable');
	let headers = ['Bird', "Date and Time", "Location", "email"];

	let table = document.createElement('table');
	let headerRow = document.createElement('tr');

	headers.forEach(headerText => {
		let header = document.createElement('th');
		let textNode = document.createTextNode(headerText);
		header.appendChild(textNode);
		headerRow.appendChild(header);
	})

	table.appendChild(headerRow);

	observations.forEach(obsrv => {
		let row = document.createElement('tr');

		Object.values(obsrv).forEach(text => {
			let cell = document.createElement('td');
			let textNode = document.createTextNode(text);
			cell.appendChild(textNode);
			row.appendChild(cell);
		})

		table.appendChild(row);
	})
	let oldTable = document.getElementById('observationTable');
	console.log(oldTable.childElementCount);
	
	if(oldTable.hasChildNodes()){
		observationTable.replaceChild(table,oldTable.childNodes[0]);
	}else{
		observationTable.appendChild(table);
	}
}