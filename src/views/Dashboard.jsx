import React from 'react';
import Widget from './Widget.jsx';
import Api from '../Api.js';

import {Tooltip, Slider, IconButton, Menu, MenuItem, CardText, Layout, Header, 
		Navigation, Content, Grid, Cell, Drawer, Icon} from 'react-mdl';

//redux		
import { connect } from 'react-redux';
import { doLogin, setMetrics, updateMetrics } from '../actions/index';

var Dashboard =  React.createClass({

	getInitialState: function(){
		return {visible: 'all', view: 'view_quilt', refreshRate: 5};
	},

	componentDidMount: function(){ 

		var me = this;

		/** 
		 * Open channel and start storing ws updates along with current time
		 * Callback function is executed in channel.on("update"...
		 */
		Api.loadUpdates(function(data){
			me.props.dispatch(updateMetrics(data));
		});

		 //ws simulation, uncomenting this and commenting api call above should simulate ws update
		 

	},

	/**
	 * Api logout and dispatch needed actions
	 * so user data is clean after login
	 */
	logout: function(){
		Api.logout();
		this.props.dispatch(doLogin(false)); // will trigger view change in main view
		this.props.dispatch(setMetrics({})); // remove metrics
	},

	/**
	 * Filters chart visibility by chart category
	 * @param  {dom el}
	 */
	changeCat: function(item){
		this.setState({visible: item.target.getAttribute('data')});
	},

	/**
	 * Chage view layout
	 * @param  {dom el}
	 */
	changeView: function(item){   
		this.fireOnResizeEvent();
		this.setState({view: item.target.textContent});
	},

	/**
	 * Returns column width regarding of view type
	 * @param {string} can be: view_quilt, view_module or view_stream
	 */
	getColumnSize: function(metric){

		if(this.state.view=='view_quilt')
			return (metric.id==="us1" || metric.type==="profit" ) ? 12 : 6;
		else if(this.state.view=='view_module')
			return 6;
		else
			return 12;
	},

	/**
	 * This way charts recreate properly when we change view look
	 */
	fireOnResizeEvent: function() {
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 50);
		
	},

	/**
	 * Set Charts refresh rate
	 */
	setRefreshRate: function(val){
		this.setState({refreshRate: val.target.value});
		this.refreshRateFn();
	},

	refreshRateFn: function(){
		return this.state.refreshRate;
	},
	render: function(){
		
		var me = this;

		return <Layout  id="dashboard-layout" fixedHeader>
					<Header title={<span><span style={{ color: '#ddd' }}>Dashboard / </span><strong>Wellcome</strong></span>}>
						<Navigation>
			                <a href="javascript:void(0);"  onClick={this.logout} ><Icon name="account_circle" /> Logout (Admin)</a>
			            </Navigation>
					</Header>
					<Drawer title="Settings">
			            <Navigation>
			                <a href="#"><Icon name="home" /> Dashboard (demo)</a>
			                <a href="#"><Icon name="drafts" /> Notifications (demo)</a>
			                <a href="#"><Icon name="settings" /> Settings (demo)</a>
			             </Navigation>
			        </Drawer>
			        	<Content>
							<Grid>
								<Cell col={12} tablet={8}>
									
									{/* View switcher */}
									<IconButton name="view_quilt" className={"dash-command"} onClick={this.changeView} />
									<IconButton name="view_module" className={"dash-command"} onClick={this.changeView} />
									<IconButton name="view_stream" className={"dash-command"} onClick={this.changeView} />
									
									{/* Category menu */}
									<IconButton style={{float: 'right'}} className={"dash-command"} name="more_vert" id="dash-menu" title="Filter Category"/>
									<Tooltip label="Charts Refresh Rate" position="left" id={"refresh-rate-slider"}>
										<div>
											<div style={{float: 'left', fontWeight: 'bold', color: 'gray'}}>{this.state.refreshRate} sec</div>
											<Slider min={1} max={100} defaultValue={this.state.refreshRate} onChange={this.setRefreshRate}/>
										</div>
									</Tooltip>
								    <Menu target="dash-menu" align="right" style={{float: 'right'}}>
								        <MenuItem onClick={this.changeCat} data={"all"}>All</MenuItem>
								        <MenuItem onClick={this.changeCat} data={"shop"}>Shops</MenuItem>
								        <MenuItem onClick={this.changeCat} data={"pedestrians"}>Pedestrians</MenuItem>
								        <MenuItem onClick={this.changeCat} data={"profit"}>Profit</MenuItem>
								    </Menu>

								</Cell>
								{/* Rendering metric boxes depending of metric category and view type */}
						        {this.props.metrics && this.props.metrics.map(function(metric){
						        	
									var metricType = metric.type,
										col = me.getColumnSize(metric);
									
									var isShop = (me.state.visible==='shop' && metricType==='shop') ,
									 	isPedestrians = (me.state.visible==='pedestrians' && metricType==='pedestrians') ,
									 	isProfit = (me.state.visible==='profit' && metricType==='profit') ,
									 	isAll = (me.state.visible==='all');

									// return all or just selected category
									if( isShop || isPedestrians || isProfit || isAll)
										return <Cell key={metric.id} col={col} tablet={8}>
											<Widget fn={me.refreshRateFn} metricId={metric.id} type={metric.type} name={metric.name} description={metric.description}/>
										</Cell>;
						        })}
						    </Grid>
						</Content>
				</Layout>;
	}
});

function mapStateToProps(state) {
  return {
    metrics: state.metrics.data
  }
}
export default connect(mapStateToProps)(Dashboard);