import React from 'react';

import { ProgressBar } from 'react-mdl';

export default React.createClass({
	render: function(){
		return <div id="loader-screen">
				<p className="loader-text">Almost there...</p>
				<ProgressBar indeterminate style={{width: '100%'}}/>
			</div>;
	}
});