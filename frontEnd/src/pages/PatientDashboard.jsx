import { useState, useEffect, useCallback, useContext, useRef } from "react";
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
  Grid2,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import moment from "moment";
import { ADD_REVIEWS, HOST_URL, USER_ORDERS, SUCCESS_CODE } from "../constant";
import TabContent from "../components/TabContent";
import { API, createURLDownloadFile } from "../utils";
import { UserContext } from "../../context";
import { useNavigate } from "react-router-dom";
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
const initialCommentVal = {
  ratingVal: null,
  comment: "",
};
const PatientDashboard = () => {
  const [orders, setOrders] = useState([]);

  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) navigate("/");
  }, [navigate, userInfo]);
  const loadingRef = useRef(false); // Track loading without causing re-renders
  const id = userInfo.id;
  const fetchOrders = useCallback(async () => {
    if (loadingRef.current) return; // Prevent multiple API calls

    loadingRef.current = true; // Set loading before API call

    try {
      const { data } = await API.get(USER_ORDERS, {
        params: { userId: id, idType: "patient_id" },
      });
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      loadingRef.current = false; // Reset loading after API call
    }
  }, [id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const [open, setOpen] = useState(false);

  const [commentData, setCommentData] = useState(initialCommentVal);
  const addComment = useCallback(() => {
    console.log(commentData);
    if (!commentData.ratingVal || !commentData.comment) {
      toast.error("Please input comment or rate before submit your comment!");
      return;
    }

    const { id } = userInfo || {};
    axios
      .post(ADD_REVIEWS, { ...commentData, user_id: id })
      .then((res) => {
        const { data } = res;
        if (data.code === SUCCESS_CODE) {
          toast.success(data.message);
          setOpen(false);
          setCommentData(initialCommentVal);
        }
      })
      .catch((err) => {
        console.log(err, "add comment error");
      });
  }, [commentData, userInfo]);

  const downloadPres = useCallback(async (id) => {
    try {
      const res = await API.get(`${HOST_URL}/prescription/${id}/download`, {
        responseType: "blob",
      });
      createURLDownloadFile(res.data, id);
    } catch (err) {
      const errorMessage =
        err.response?.status===403?"Invalid Token" : "Failed to download prescription";
      toast.error(errorMessage);
    }
  }, []);

  return (
    <>
      <TabContent label="My Orders">
        <Grid container spacing={4} justifyContent="center">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Grid item fontSize="1rem" key={order._id}>
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
                        marginBottom: "40px",
                        textTransform: "uppercase",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Order: {order._id}
                    </Typography>
                    {order.delivery_status_value === "Completed" && (
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "30px",
                          fontSize: "16px",
                          marginBottom: "20px",
                        }}
                        onClick={() => setOpen(true)}
                      >
                        Add Comment
                      </Button>
                    )}
                    <Grid2 size={{ xs: 12, sm: 6 }} container spacing={2}>
                      <Grid2 size={4}>Prescription:</Grid2>
                      <Grid2 size={8}>
                        <Button
                          variant="outlined"
                          onClick={() => downloadPres(order._id)}
                        >
                          Download
                        </Button>
                      </Grid2>
                      <Grid2 size={4}>Uploaded Date:</Grid2>
                      <Grid2 size={8}>
                        {moment(order.uploaded_date).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </Grid2>
                      {order.remark && (
                        <>
                          <Grid2 size={4}>Remark:</Grid2>
                          <Grid2 size={8}>{order.remark}</Grid2>
                        </>
                      )}
                      <Grid2 size={5}>Status:</Grid2>
                      <Grid2 size={7}>
                        <OrderStepper status={order.delivery_status_value} />
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : loadingRef.current ? (
            <CircularProgress disableShrink />
          ) : (
            "No orders found"
          )}
        </Grid>
      </TabContent>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setCommentData(initialCommentVal);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Add Comment</DialogTitle>
        <DialogContent>
          <Box className="box">
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
OrderStepper.propTypes = {
  status: PropTypes.string,
};
export default PatientDashboard;
