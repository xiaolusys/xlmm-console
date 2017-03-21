import createReducer from "redux/createReducer"
import { apisBase } from 'constants';

const initialState = {
	count:0,
	items:[],

};

const name = 'PACKAGEORDER';

export default createReducer({
	[`FETCH_${name}_SUCCESS`]:(state, {payload, status}) =>({
		...state,
		...status,
		// count : 777,
		items:payload.data.results,
		count:payload.data.count,
	}),
	[`FETCH_${name}_FAILURE`]:(state,{payload,status}) =>({
		...state,
		...status,
	}),
},initialState);


export const fetchPacakgeOrder = () =>({
	url: `${apisBase.trades}package_order.json`,
	// url: `${apisBase.item}stock_product`,
	method:"get",
	type: `FETCH_${name}`
});

