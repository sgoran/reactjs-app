/**
 * Usual login screen with validation and error messages
 * 
 * If validation passes 
 *    dispatch(doLogin(Api.isLoggedIn()))   is fired 
 *    
 *  Main view (index.jsx) is listening this 
 *  so layout updates and Dashboard is showed   
 *
 *  Same is for logout
 * 
 */
import React from 'react';
import ReactDom from 'react-dom';
import Loader from './Loader.jsx';
import Api from '../Api.js';

import { Layout, Button, Card, CardTitle, CardActions, CardText, 
		CardMenu, List, ListItem, Textfield} from 'react-mdl';

import { connect } from 'react-redux';

import {doLogin, setMetrics} from '../actions/index';

var Login = React.createClass({
	getInitialState: function(){ 
		// skip validation on first load
		return {username: '', password: '', validate: false};
	},

	/**
	 * Store new username and password into state
	 * This should trigger reneder so as validate()
	 */
	onFieldChange: function(event){

		var state = {};

		state[event.target.name] = event.target.value;

		this.setState(state);
	},

	/**
	 * On first submit enable validation 
	 * Try to login
	 */
	onFormSubmit: function(event){

		event.preventDefault();

		if(!this.state.validate)
			this.setState({validate: true}, function(){
				this.doLogin();		
			});
		else
			this.doLogin();	

	},

	/**
	 * If data is valid call Api.login and dispatch information about
	 * user status so main view can load proper view
	 */
	doLogin: function(){

		var me = this,
			username = this.validate('username'),
			password = this.validate('password');
		
		if(username.valid && password.valid)
		
			Api.login(this.state, function(){
				me.props.dispatch(doLogin(Api.isLoggedIn())); // will trigger view change in main view
			});
		
	},

	/**
	 * A few basic validations
	 * returns  {valid: boolean, msg: string}
	 */
	validate: function(field){ 
		
		var msg = '',
			pattern = /^[a-z]+$/,
			value = this.state[field];
		
		if(this.state.validate){

			if(value==='')
				msg = 'Please fill this field.'
			else if(!pattern.test(value))
				msg = 'Only a-z (lowercase) letters are allowed.'
			else if(value!=='admin')
				msg = 'Wrong '+field;

		}

		return {
			msg: msg, 
			valid: (msg==='')
		};
		
	},
	render: function(){
		

		return <Layout  id="login-layout"  fixedHeader >
					<Card id="login-card" shadow={0} >
						<CardTitle className="login-header">Wellcome</CardTitle>
					    <CardText >
							<form action="#" onSubmit={this.onFormSubmit}>
								<List>
									<ListItem>
										<Textfield  
											name="username" 
											onChange={this.onFieldChange} 
											label="Username..."  
											error={this.validate('username').msg}
										/>
									</ListItem>
									<ListItem>
										<Textfield 
											name="password" 
											onChange={this.onFieldChange} 
											label="Password..." 
											type="password"  
											error={this.validate('password').msg}
										/>
									</ListItem>
									<ListItem><Button accent raised ripple style={{width: '100%'}}>Login</Button></ListItem>
								</List>
							</form>
					    </CardText>
					</Card>
			</Layout>;
	}
});


export default connect()(Login);


