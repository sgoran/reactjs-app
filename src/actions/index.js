export function doLogin(data) {
	return {
		type: 'login',
		loggedIn: data
	}
}

export function setMetrics(data) {
	return {
		type: 'set',
		data: data
	}
}

export function updateMetrics(data) {
	return {
		type: 'update',
		data: data.updates,
		time: data.time
	}
}