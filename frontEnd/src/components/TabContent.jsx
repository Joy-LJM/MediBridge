import * as React from "react";
import PropTypes, { string } from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Card } from "@mui/material";
import "../styles/Dashboard.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function TabContent({ label, children }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "#D1E3C4", display: "flex", height: "100vh" }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="dashboard"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label={label} aria-selected {...a11yProps(0)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Card
          sx={{
            width: "60vw",
            paddingTop: 4,
            paddingBottom: 2,
            textAlign: "center",
          }}
        >
          {children}
        </Card>
      </TabPanel>
    </Box>
  );
}

TabContent.propTypes = {
  children: React.Children,
  label: string,
};
