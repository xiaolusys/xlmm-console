import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  provinces: [],
  cities: [],
  districts: [],
};

const apiBase = '/rest/v1/districts/';

const names = {
  provinces: 'PROVINCES',
  cities: 'CITIES',
  districts: 'DISTRICT',
};

export default createReducer({
  [`FETCH_${names.provinces}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.provinces}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    provinces: payload.data,
  }),
  [`FETCH_${names.provinces}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.cities}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.cities}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    cities: payload.data.data,
    districts: [],
  }),
  [`FETCH_${names.cities}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.districts}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.districts}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    districts: payload.data.data,
  }),
  [`FETCH_${names.districts}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),

}, initialState);

export const fetchProvinces = () => ({
  url: `${apiBase}province_list`,
  method: 'get',
  type: `FETCH_${names.provinces}`,
});

export const fetchCities = (provinceId) => ({
  url: `${apiBase}city_list`,
  method: 'get',
  type: `FETCH_${names.cities}`,
  params: {
    id: provinceId,
  },
});

export const fetchDistricts = (cityId) => ({
  url: `${apiBase}country_list`,
  method: 'get',
  type: `FETCH_${names.districts}`,
  params: {
    id: cityId,
  },
});
