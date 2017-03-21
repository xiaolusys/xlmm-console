import React from 'react';
import { Route ,IndexRoute } from 'react-router';
// import  Home  from 'modules/ninepic/Home';
import { Home } from 'modules/packageOrder/Home';


export default (
	<Route path = "/packageorder" breadcrumbName = "包裹">
		<IndexRoute component={Home} />
	</Route>
	);

// export default (
//   <Route path="/ninepics2" breadcrumbName="九张图">
//     <IndexRoute component={Home} />
//   </Route>
// );


