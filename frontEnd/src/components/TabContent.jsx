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
          <Typography variant="h6">{children}</Typography>
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
      sx={{
        flexGrow: 1,
        bgcolor: "white", // Sidebar background color
        display: "flex",
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="dashboard"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          backgroundColor: "#689D6D",
          color: "white",
          "& .MuiTab-root": { color: "white !important" }, // Sets default text color to white
          "& .Mui-selected": {
            color: "white !important",
            fontWeight: "bold",
            fontSize: 20,
          }, // Ensures selected tab is also white
        }}
      >
        <Tab
          label={label}
          sx={{ color: "white" }}
          aria-selected
          {...a11yProps(0)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Card
          sx={{
            width: "60vw",
            paddingTop: 4,
            paddingBottom: 2,
            textAlign: "center",
            boxShadow: "none",
            margin: 0,
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
