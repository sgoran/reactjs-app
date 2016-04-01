import {combineReducers} from 'redux';
import Api from '../Api';

var initialState = {
    loggedIn: Api.isLoggedIn()
};

/** 
 * Update user store with loggedIn true or false
 * Dispatch of this action will trigger view change, Api.login/Api.logout etc
 */
function user(state = initialState, action) {

    switch (action.type) {

        case 'login':

            var state = Object.assign({}, state, {
                loggedIn: action.loggedIn
            });

            return state;

        default:
            return state

    }

}

/**
 * Metrics reducer
 * @param  curent state
 * @param  action with new data
 * @return new cloned state
 */
function metrics(state = {}, action) {

    switch (action.type) {

        case 'set':

            return Object.assign({}, state, {
                data: action.data
            })

        default:

            return state

    }

}

/**
 * Maybe the most important part  
 * Storing ws data her
 * on action.type==set, a map of metrics is created, which will be used for storing updates
 * on action.type==update data from sockets are stored into metricsData map
 */
function metricData(state = {}, action) {

    switch (action.type) {
        /**
         * creates a map like this
         *
         * {
         *     us1: {data: [], labels: []}
         *     us2: {data: [], labels: []},
         *     etc...
         * }
         */
        case 'set':

            var tmpObj = {};

            if (Array.isArray(action.data))
                action.data.forEach(function(item) {

                    tmpObj[item.id] = {
                        data: [],
                        labels: []
                    };

                });

            return Object.assign({}, tmpObj);

        /**
         * updating the map above with ws updates
         * also adding other data like calculating average for the current state
         * NOTE: this average can be calculated on different ways/time frames etc
         *       currently just calculating average of last 100 records per metric
         */
        case 'update':

            var data = action.data,
                time = action.time,
                stateClone = Object.assign({}, state);

            for (var i = 0; i < data.length; i++) {

                var record = data[i],
                    storeRecord = stateClone[record.id];

                if (storeRecord) {

                    storeRecord

                    // records for average calculating and chart
                    storeRecord.data.unshift(record.value); // new records to front, old to the end
                    storeRecord.data.splice(100); // keep just 100 last records for each metric 

                    // time of update, will use for chart labels
                    storeRecord.labels.unshift(time);
                    storeRecord.labels.splice(100);

                    // average metric, but just regarding to last N
                    storeRecord.average = (function(arr) {

                        var sum = arr.reduce(function(a, b) {
                            return a + b;
                        });
                        return Math.round(sum / arr.length);

                    })(storeRecord.data);

                    // last added
                    storeRecord.last = record.value;
                    storeRecord.lastTime = time;

                }

            }

            return stateClone;

        default:

            return state

    }

}

export default combineReducers({
    user,
    metrics,
    metricData
});