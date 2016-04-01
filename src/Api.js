import Cookies from 'js-cookie';

var  dateFormat =  require('dateformat');

export default (function() {

	const LOGIN_EXPIRATION = 1, // 1 day - cookie expiration time
		API_URL = 'http://api-url.com',

		AUTH_PARAMS = {
			api: '/api/auth',
			type: 'POST',
			contentType: 'application/json'
		},

		METRIC_PARAMS = {
			api: '/api/metrics',
			type: 'GET',
			'auth-token': ''

		},
		WEB_SOCKET_PARAMS = {
			api: "ws://api-url/updates",
			'auth-token': ''
		};

	/**
	 * Simple ajax function, used by other api methods
	 * 
	 * @param  apiParams  - constansts from above, AUTH_PARAMS etc
	 * @param  data       - some optional data to send like  {username: user, password: pass}
	 * @param  {Function} - callback to execute after load, usually a store.dispatch(response)
	 *						for updating  store with new data
	 */
	function fetch(apiParams, data, fn) {

		var httpRequest = new XMLHttpRequest();

		httpRequest.addEventListener("load", fn);

		httpRequest.open(apiParams.type || "GET", API_URL + (apiParams.api || ''));

		if (apiParams.contentType)
			httpRequest.setRequestHeader('Content-Type', apiParams.contentType);

		if (apiParams['auth-token'])
			httpRequest.setRequestHeader('auth-token', getAuthToken());

		if (data)
			httpRequest.send(JSON.stringify(data));
		else
			httpRequest.send();
	}

	/**
	 * Simulating user session with cookie
	 */
	function setAuthToken(token) {
		Cookies.set('auth-token', token, {
			expires: LOGIN_EXPIRATION
		});
	}

	/**
	 * Justs check is cookie there
	 */
	function getAuthToken() {
		return Cookies.get('auth-token');
	}

	/**
	 * after successful login auth-token is stored into cookies
	 *  
	 * @param  data - {username: '', password: ''}
	 *         data should be validated before it comes here
	 *         
	 * @param  {Function} - callback function
	 */
	function login(data, fn) {

		var user = data.username,
			pass = data.password;

		if(user === 'admin' && pass === 'admin'){
			setAuthToken('session-id');
			fn();
		}

		/*
		 * this would be server login
		 fetch(AUTH_PARAMS, {
			username: user,
			password: pass
		}, function() {
			var response = JSON.parse(this.responseText);
			if (response.success && response['auth-token']) {
				setAuthToken(response['auth-token']);
			}
			fn(response);
		});
		*/

	}

	/**
	 * See if cookie is still present
	 */
	function isLoggedIn() {
		return getAuthToken() ? true : false;
	}

	/**
	 * Leave websocket channel
	 * Remove auth-token, rest will sort out in main views via dispatcher
	 * Check Dashboard.jsx logout() function
	 */
	function logout() {

		stopUpdates();

		Cookies.remove('auth-token');

	}

	/**
	 * Fetch metrics 
	 */
	function loadMetrics(fn) {

		if (isLoggedIn()) {

			fn([{
				description : "The number of visitors present in shop 1",
				id : "us1",
				name : "Visitors in shop 1",
				type : "shop"
			},{
				description : "The number of visitors present in shop 2",
				id : "us2",
				name : "Visitors in shop 2", 
				type : "shop"
			},{
				description : "The number of visitors present in shop 3",
				id : "us3",
				name : "Visitors in shop 3",
				type : "shop"
			}, {
				description : "The number of pedenstrians in geo area 1",
				id : "ped1",
				name : "Pedenstrians geo 1",
				type : "pedestrians"
			}, {
				description : "The number of pedenstrians in geo area 2",
				id : "ped2",
				name : "Pedenstrians geo 2",
				type : "pedestrians"
			}, {
				description : "The current profit across retail locations",
				id : "rev1",
				name : "Profit",
				type : "profit"
			}]);



			/*
			 * This request would get metrics hardcoded above
			 *
			METRIC_PARAMS['auth-token'] = getAuthToken();

			fetch(METRIC_PARAMS, null, function() {
				var response = JSON.parse(this.responseText);
				fn(response);
			});
			*/

		}
	}

	/**
	 * Loading updates via websocket 
	 */
	function loadUpdates(fn) {

		if (isLoggedIn()) {

			// simulating weebsocket updates
			setInterval(function(){
			
				var data = {
					updates: wsSimulate(),
					time : dateFormat(new Date(), 'HH:MM:ss')
				}
				
				fn(data);

			}, 500);

			// updates would be loaded with websockets

		}
	}

	/**
	 * simulating websockets updates
	 * when things don't work in office :)
	 * @return [{},{}...]
	 */
	function wsSimulate(){

		
    	var r = function(min, max){  return Math.floor(Math.random() * (max - min + 1)) + min;}

    	var update = [
    		{
    			id: 'us1',
    			value: r(0,900)
    		}, {
    			id: 'us2',
    			value: r(0,900)
    		},{
    			id: 'us3',
    			value: r(0,900)
    		}, {
    			id: 'ped1',
    			value: r(0,900)
    		},{
    			id: 'ped2',
    			value: r(0,900)
    		},{
    			id: 'rev1',
    			value: r(0,900)
    		}
    	];

    	return update.slice(r(0,2), r(3,8));

	}

	/**
	 * Close ws channel
	 */
	function stopUpdates() {

	}


	// Export public Api methods
	return {
		login: login,
		logout: logout,
		isLoggedIn: isLoggedIn,
		loadMetrics: loadMetrics,
		loadUpdates: loadUpdates,
		stopUpdates: stopUpdates
	};

}(Cookies));