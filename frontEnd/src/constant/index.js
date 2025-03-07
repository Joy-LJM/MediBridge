const ROLE_MAP = {
  doctor: "67b270820a93bde65f142af1",
  pharmacy: "67b270940a93bde65f142af2",
  patient: "67b270a10a93bde65f142af3",
  shipper: "67b270b10a93bde65f142af4",
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
