// ProfesseurOak

// JSON QUERYING MODULE

// REQUEST AND RETURN JSON FILE
exports.get = (url) => {
	url = url || 0;
	let result = new Array();
	if (url !== 0) {
		if(url[4] !== "s") {
			return new Promise((resolve,reject)=>{
				getJSONFile(url)
					.then(response => {
						resolve(response);
					})
					.catch(error => {
						reject(error);
					});
			})
		} else {
			return new Promise((resolve,reject)=>{
				getJSONFileHTTPS(url)
					.then(response => {
						resolve(response);
					})
					.catch(error => {
						reject(error);
					});
			})
		}
	} else {
		return "No URL provided !";
	}
}

// -------------------------------------------------
// GET JSON FILE (HTTP)
function getJSONFile(url) {
	let http = require('http');
	return new Promise((resolve,reject)=>{
		http.get(url, (res) => {
			let { statusCode } = res;
			let contentType = res.headers['content-type'];
			
			let error;
			if (statusCode !== 200) {
				error = new Error('Request failure. ' +
								`Status code : ${statusCode}`);
			}/* else if (!/^application\/json/.test(contentType)) {
				error = new Error('Content type invalid : ' +
								`Expected application/json, received ${contentType}`);
			}*/
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

// -------------------------------------------------
// GET JSON FILE (HTTPS)
function getJSONFileHTTPS(url) {
	let https = require('https');
	return new Promise((resolve,reject)=>{
		https.get(url, (res) => {
			let { statusCode } = res;
			let contentType = res.headers['content-type'];
			
			let error;
			if (statusCode !== 200) {
				error = new Error('Request failure. ' +
								`Status code : ${statusCode}`);
			}/* else if (!/^application\/json/.test(contentType)) {
				error = new Error('Content type invalid : ' +
								`Expected application/json, received ${contentType}`);
			}*/
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