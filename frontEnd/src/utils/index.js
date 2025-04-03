import axios from "axios";
import { HOST_URL } from "../constant";

const createURLDownloadFile = (data, id) => {
  const fileUrl = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = `prescription-${id}.pdf`;
  a.click();
};

const API = axios.create({
  baseURL: HOST_URL, // Your backend URL
  withCredentials: true, // Sends cookies with requests
});

export { createURLDownloadFile, API };
