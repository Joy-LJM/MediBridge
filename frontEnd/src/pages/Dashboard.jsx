// import * as React from "react";

import { Button, Grid2 } from "@mui/material";

import "../styles/Dashboard.css";
import TabContent from "../components/TabContent";

export default function Dashboard() {
  return (
    <TabContent label="Upload Prescription">
      <Grid2 container spacing={2} marginBottom={2}>
        <Grid2 size={4}>
          <label>Upload Prescription:</label>
        </Grid2>
        <Grid2 size={8}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={
              <span className="material-symbols-outlined">upload_file</span>
            }
          >
            Upload
            <input
              type="file"
              className="upload"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>
        </Grid2>
        <Grid2 size={4}>
          <label>Search a pharmacy:</label>
        </Grid2>
        <Grid2 size={8}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d23166.897137708867!2d-80.510976!3d43.463475200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sca!4v1739562474123!5m2!1sen!2sca"
            width="300"
            height="250"
            loading="lazy"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen=""
          ></iframe>
        </Grid2>
        <Grid2 size={4}>
          <label>Remark:</label>
        </Grid2>
        <Grid2 size={8}>
          <textarea rows={6} cols={33} />
        </Grid2>
      </Grid2>
      <Button color="success" variant="contained">
        Submit
      </Button>
    </TabContent>
  );
}
