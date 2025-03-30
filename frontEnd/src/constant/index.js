const ROLE_MAP = {
  doctor: "67b270820a93bde65f142af1",
  pharmacy: "67b270940a93bde65f142af2",
  patient: "67b270a10a93bde65f142af3",
  shipper: "67b270b10a93bde65f142af4",
};
const ORDER_STATUS_MAP = {
  NEW: "67ca8e5d3b3a4ffbb7d77b95",
};
const SUCCESS_CODE = 1;

const HOST_URL = "http://localhost:3000";
const LOGIN = `${HOST_URL}/login`;
const VALIDATE_EMAIL = `${HOST_URL}/validateEmail`;
const VERIFY_CODE = `${HOST_URL}/validateCode`;
const RESET_PSW = `${HOST_URL}/resetPsw`;
const GET_PATIENT_LIST = `${HOST_URL}/prescription/patient`;
const GET_PHARMACY_LIST = `${HOST_URL}/prescription/pharmacy`;
const SUBMIT_PRESCRIPTION = `${HOST_URL}/prescription/submit`;
const ADD_PATIENT = `${HOST_URL}/prescription/addPatient`;
const FETCH_PROVINCES = `${HOST_URL}/api/provinces`;
const FETCH_CITIES = `${HOST_URL}/api/cities`;
const PATIENT_ORDERS = `${HOST_URL}/patient/orders`;
const ADD_REVIEWS = `${HOST_URL}/patient/addReview`;
const USER_ACTION = `${HOST_URL}/user`;

const PHONE_REGEX = /^\(?(\d{3})\)?(\d{3})(\d{4})$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const POSTCODE_REGEX = /^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/;

export {
  HOST_URL,
  LOGIN,
  ROLE_MAP,
  VALIDATE_EMAIL,
  GET_PATIENT_LIST,
  SUCCESS_CODE,
  SUBMIT_PRESCRIPTION,
  ADD_PATIENT,
  GET_PHARMACY_LIST,
  VERIFY_CODE,
  ORDER_STATUS_MAP,
  RESET_PSW,
  POSTCODE_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  FETCH_PROVINCES,
  FETCH_CITIES,
  PATIENT_ORDERS,
  ADD_REVIEWS,
  USER_ACTION,
};
