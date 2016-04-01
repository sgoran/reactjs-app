/**
 * Each metric is presented with this widget
 * Widget is listening for websocket updates via dispatcher
 * and updates accordingly
 */

import React from 'react';
import {Icon, Card, CardTitle, CardText, CardActions, CardMenu, Button, IconButton } from 'react-mdl';
import { connect } from 'react-redux';

var Widget = React.createClass({
    intervalId: '',
    componentDidMount: function() {

        var me = this;

        // prepare a chart with blank data
        me.drawChart(me.getType());

        // delay first chart update a bit
        setTimeout(function() {
            me.updateChart();
        }, 2000);

        
        var initialRefreshRate = this.props.fn();
         
        // run charts sync from with slider value, 5 sec
        me.syncCharts(initialRefreshRate); 

        // check every seccond if slider value is changed than reset chart sync
        // not a brilian solution, should be improved sometimes
        // although calling charts sync while draging slider is avoided
        setInterval(function() {

            var newInterval = me.props.fn();

            if(initialRefreshRate!==newInterval){

                clearInterval(me.intervalId);

                me.syncCharts(newInterval);

                initialRefreshRate = newInterval;
            }

        }, 1000);
        
        

    },

    /**
     * Prepare a grid so we can just update later
     * @return {chart}
     */
    drawChart: function(chType) {
        
        var id = this.props.metricId,
            data = {
               
            };

        var options = {
            low: 0,
            showArea: true,
            fullWidth: true,
            showPoint: false,
            showLine: false,
            axisX: {
                showLabel: true,
                showGrid: true
            }
        };
        
        var chart;

        try{
            chart = new Chartist[chType]('#'+id, data, options);
        }catch(e){
            console.log(e);
        }
        
        this.chart = chart;
        // chart animation
        chart.on('draw', function(data) {
          if(data.type.toLowerCase() === 'line' || data.type.toLowerCase() === 'area') {
            data.element.animate({
              d: {
                begin: 800 * data.index,
                dur: 800,
                from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeInOutQuart
              }
            });
          }
        });

        return chart;
    },

    /**
     * Updates chart with new values from store
     */
    updateChart: function(){

        var me = this,
            last = this.getLast(),
            data = last.data;
            //labels = last.labels;
            
            if(data.length<2)
                data = [0,0,0];
            
        try{
           // labels don't look very nice
            me.chart.update({
                series: [data.slice(0,15)]
                /*labels: labels.slice(0,15)*/
            });
        }catch(e){
            console.log(e);
        }   
        
    },

    syncCharts: function(interval){
       
        var me = this;
        
        this.intervalId = setInterval(function() {
        
            me.updateChart();

        }, interval*1000);

    },
    /**
     * Can define which chart type should look like
     * Pedestrians are Bar chart for example
     */
    getType: function(){
        return (this.props.type == 'pedestrians') ? 'Bar' : 'Line';
    },

    // finish this
    switchChart: function(item){

        var chartType = 'Line';
        var type = item.target.textContent;

        if(type==='equalizer')
            chartType = 'Bar';

        this.drawChart(chartType);
        this.updateChart();
        
    },
    /**
     * Returns set of last gathered records like time, metric set, average etc
     * @return {object]}
     */
    getLast: function() {

        var id = this.props.metricId,
            data = this.props.metrics[id];

        return {
            metric: data.last || 'xxx',
            average: data.average || 'xxx',
            lastTime: data.lastTime || '00:00:00 AM',
            labels: data.labels || [],
            data: data.data || [],
        }
    },

    render: function() {

        var id = this.props.metricId;
        var last = this.getLast();


        return <Card shadow={0} style = {{width: '100%'}}>
            
            <CardTitle className="widget-title" > 
                {this.props.name} <span className={"currentMetric"} >({last.metric})</span>
                Average<span className={"averageMetric"} > ({last.average})</span> 
                <CardMenu style={{top: '8px'}}>
                    <IconButton name="show_chart" val="Line" onClick={this.switchChart}/>
                    <IconButton name="equalizer" val="Bar" onClick={this.switchChart} />
                </CardMenu>
            </CardTitle> 
            
            {/*will render grid here*/}
            <CardText id={id}  className={"ct-golden-section"} style={{maxHeight: '320px', width: '95%'}}></CardText>
            
            <CardActions border>
                <span className={"widget-desc"}> * {this.props.description}</span> 
                <span className={"widget-desc"} style={{float: 'right'}}> 
                    Updated: {last.lastTime} 
                </span>

            </CardActions>

        </Card>;

    }
});

function mapStateToProps(state) {
    return {
        metrics: state.metricData
    }
}
export default connect(mapStateToProps)(Widget);