const ROLE_MAP = {
  doctor: "1",
  pharmacy: "2",
  patient: "3",
  shipper: "4",
};
const SUCCESS_CODE = 1;

const HOST_URL = "http://localhost:3000";
const GET_PATIENT_LIST = `${HOST_URL}/prescription/patient`;
const GET_PHARMACY_LIST = `${HOST_URL}/prescription/pharmacy`;
const SUBMIT_PRESCRIPTION = `${HOST_URL}/prescription/submit`;
const ADD_PATIENT = `${HOST_URL}/prescription/addPatient`;

export {
  HOST_URL,
  ROLE_MAP,
  GET_PATIENT_LIST,
  SUCCESS_CODE,
  SUBMIT_PRESCRIPTION,
  ADD_PATIENT,
  GET_PHARMACY_LIST,
};
