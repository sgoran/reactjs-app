
import React from 'react';
import ReactDom from 'react-dom';

// components
import Dashboard from './Dashboard.jsx';
import Loader from './Loader.jsx';
import Login from './login.jsx';


import Api from '../Api';

// redux
import {Provider} from 'react-redux';
import { connect} from 'react-redux';
import {doLogin, setMetrics} from '../actions/index';

import store from '../store';


var App = React.createClass({
	render: function(){

		var loggedIn = this.props.loggedIn,
			metricsSet = (this.props.metrics && Object.keys(this.props.metrics).length>0),
			View =  Login; // default view

		// metrics are loaded, user goes to dashboard
		if(loggedIn && metricsSet)
			View = Dashboard;
		

		// if users is loggedIn on page reload , loading screen needs to be set and metrics loaded
		// when metrics are loaded - dashboard will be rendered in case above
		else if(loggedIn && !metricsSet){
			
			View =  Loader;

			// load metrics and add a litle delay just for better UI
			Api.loadMetrics(function(metricsData){
				setTimeout(function(){
					store.dispatch(setMetrics(metricsData));
				}, 800);
			});

		}

		return <View/>;

	}
});

/**
 * Main view is connected to login and metrics reducers
 * so view can be switched regarding to login state
 * also, app will get loading screen while metrics are loading
 */
function mapStateToProps(state) {
  return {
    loggedIn: state.user.loggedIn,
    metrics: state.metrics.data
  }
}

App = connect(mapStateToProps)(App);

ReactDom.render(<Provider store={store}><App/></Provider>, document.getElementById('app'));


