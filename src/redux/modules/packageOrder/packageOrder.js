import createReducer from "redux/createReducer"
import { apisBase } from 'constants';

const initialState = {
	count:0,
	items:[],

};

const name = "PACKETORDER"

export default createReducer({
	['FETCH_${name}_SUCCESS']:(state, {payload, status}) =>({
	             ...state,
	             ...status,
	    items: payload.data.results,
	    count: payload.data.count,
	}),
	['FETCH_${name}_FAILURE']:(state,{payload,status}) =>({
		...state,
		...status,
	}),
},initialState);


export const fetchPacakgeOrder = () =>({
	url: `${apisBase.supply}supplier`,
	method:"get",
	type:"FETCH_PACKETORDER",
});

