// ProfesseurOak

// JSON QUERYING MODULE

// -------------------------------------------------
// Load contributors JSON file !
exports.get = (url) => {
	url = url || 0;
	let result = new Array();
	if (url !== 0) {
		return new Promise((resolve,reject)=>{
			getJSONFile(url)
				.then(response => {
					result.push(true);
					result.push(response);
					resolve(result);
				})
				.catch(error => {
					result.push(false);
					result.push(error);
					reject(result);
				});
		}
	} else {
		result.push(false);
		result.push("No URL provided !");
		return result;
	}
}

// -------------------------------------------------
// Get contributors.json !
function getJSONFile(url) {
	var http = require('http');
	return new Promise((resolve,reject)=>{
		http.get(url, (res) => {
			var { statusCode } = res;
			var contentType = res.headers['content-type'];
			
			let error;
			if (statusCode !== 200) {
				error = new Error('Request failure. ' +
								`Status code : ${statusCode}`);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error('Content type invalid : ' +
								`Expected application/json, received ${contentType}`);
			}
			if (error) {
				console.error(error.message);
				// consume response data to free up memory
				res.resume();
			}
			
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					resolve(parsedData);					
				} catch (e) {
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject(`Error received : ${e.message}`);
		}).end();
	})
}