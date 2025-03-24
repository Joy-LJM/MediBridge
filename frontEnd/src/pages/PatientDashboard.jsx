import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  TextareaAutosize,
  Dialog,
  FormLabel,
  Rating,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { ADD_REVIEWS, PATIENT_ORDERS, SUCCESS_CODE } from "../constant";
import TabContent from "../components/TabContent";
const deliveryStatusMap = {
  new: "New",
  preparing: "Preparing",
  pending: "Pending",
  delivering: "Delivering",
  completed: "Completed",
  declined: "Declined",
  accepted: "Accepted",
};
const steps = [
  { [deliveryStatusMap.new]: "Doctor Uploaded" },
  { [deliveryStatusMap.accepted]: "Accepted by Pharmacy" },
  { [deliveryStatusMap.declined]: "Declined by Pharmacy" },
  { [deliveryStatusMap.preparing]: "Order Preparing" },
  { [deliveryStatusMap.pending]: "Ready to Deliver" },
  { [deliveryStatusMap.delivering]: "Delivering" },
  { [deliveryStatusMap.completed]: "Completed" },
];
const PatientDashboard = () => {
  const [orders, setOrders] = useState([]);
  // const [orderStatusList, setOrderStatusList] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { id } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(PATIENT_ORDERS, {
        params: { userId: id },
      });
      console.log("Fetched Orders:", data);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const [open, setOpen] = useState(false);

  const [commentData, setCommentData] = useState({
    ratingVal: null,
    comment: "",
  });
  const addComment = useCallback(() => {
    console.log(commentData);
    if (!commentData.ratingVal || !commentData.comment) {
      toast.error("Please input comment or rate before submit your comment!");
      return;
    }
    const userInfo = localStorage.getItem("userInfo");
    const { id } = JSON.parse(userInfo) || {};
    axios
      .post(ADD_REVIEWS, { ...commentData, user_id: id })
      .then((res) => {
        const { data } = res;
        if (data.code === SUCCESS_CODE) {
          toast.success(data.message);
          setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err, "eee");
      });
  }, [commentData]);
  return (
    <>
      <TabContent label="Upload Prescription">
        <Grid container spacing={4} justifyContent="center">
          {orders.map((order) => (
            <Grid item xs={12} sm={12} key={order._id}>
              <Card
                sx={{
                  backgroundColor: "#EAF4E1",
                  borderRadius: "15px",
                  boxShadow: "2px 4px 8px rgba(0,0,0,0.1)",
                  padding: "15px",
                  textAlign: "center",
                  maxWidth: "650px",
                  margin: "auto",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  height: 400,
                  overflowY: "auto",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      marginBottom: "40px",
                      textTransform: "uppercase",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    Order: {order._id}
                    <Button
                      variant="contained"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "30px",
                      }}
                    >
                      Download
                    </Button>
                  </Typography>
                  <OrderStepper status={order.delivery_status_value} />
                  {order.delivery_status_value === "Completed" && (
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: "30px",
                        padding: "10px 40px",
                        fontSize: "16px",
                        marginTop: "20px",
                      }}
                      onClick={()=> setOpen(true)}
                    >
                      Comment
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabContent>
      <Dialog
        open={open}
        onClose={()=> setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Add Comment</DialogTitle>
        <DialogContent>
          <Box className="box">
            <form
            // onSubmit={handleSubmit}
            >
              <FormControl sx={{ m: 1, width: 300 }}>
                <FormLabel>How do you think of our app?</FormLabel>
                <TextareaAutosize
                  minRows={4}
                  value={setCommentData.comment}
                  onChange={(e) => {
                    setCommentData((pre) => ({
                      ...pre,
                      comment: e.target.value,
                    }));
                  }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>
                <FormLabel>Rating</FormLabel>
                <Rating
                  name="simple-controlled"
                  value={commentData.ratingVal}
                  onChange={(event, newValue) => {
                    setCommentData((pre) => ({ ...pre, ratingVal: newValue }));
                  }}
                />
              </FormControl>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" onClick={addComment}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
const OrderStepper = ({ status }) => {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const idx = steps.findIndex((step) => step[status]);
    console.log(idx, "dddd");

    setActiveStep(idx);
  }, [status]);

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map((step, index) => {
        return (
          <Step key={index}>
            <StepLabel>{Object.values(step)[0]}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};
OrderStepper.propTypes={
  status:PropTypes.string
}
export default PatientDashboard;
