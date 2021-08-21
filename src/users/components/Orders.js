import React, { useState, useEffect, useContext } from "react";
import Tabs from "@material-ui/core/Tabs";
import PropTypes from "prop-types";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import NativeSelect from "@material-ui/core/NativeSelect";

import "./Orders.css";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Orders = () => {
  const [value, setValue] = React.useState(0);
  const [myOrders, setMyOrders] = useState();
  const [myCompOrders, setMyCompOrders] = useState();

  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const steps = ["Active", "Processing", "Ready to collect", "Completed"];

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/orders/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setMyOrders(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();

    const getMyCompOrders = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users/completedorders/${auth.userId}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        setMyCompOrders(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    getMyCompOrders();
  }, [sendRequest, auth.token, auth.userId]);

  const [status, setStatus] = useState(null);
  const handleStatusChange = async (event, id) => {
    console.log(steps.indexOf(event.target.value));
    console.log(id);
    //setStatus(event.target.value);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/updateorderstatus`,
        "POST",
        JSON.stringify({
          orderId: id,
          status: steps.indexOf(event.target.value),
          userId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setMyOrders(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (id) => {
    console.log(id);
    console.log(status);
  };

  return (
    <div className="order-container">
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Current Orders" {...a11yProps(0)} />
          <Tab label="Completed Orders" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {myOrders ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myOrders.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      12.12.2021
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleClickOpen}
                      >
                        View Items
                      </Button>
                      <Dialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                      >
                        <DialogContent dividers>
                          {row.fooditems.map((cr, index) => {
                            return (
                              <>
                                <div className="cartItem">
                                  <div className="cartItem-top">
                                    <img src={cr.foodImage} alt="" />
                                    <span>
                                      {cr.foodName} x {cr.quantity}
                                    </span>
                                  </div>
                                  <p>
                                    {cr.foodName} - {cr.qPrice} €
                                  </p>
                                </div>
                              </>
                            );
                          })}
                          {/* <div className="total">
                            <h4>Total Price: {row.totalprice} €</h4>
                          </div> */}
                        </DialogContent>
                        <DialogActions>
                          <Button
                            autoFocus
                            onClick={handleClose}
                            color="primary"
                          >
                            Okay
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                    <TableCell align="right">{row.totalprice}</TableCell>
                    <TableCell align="right">
                      {/* {steps[row.status]}{" "} */}
                      <NativeSelect
                        value={steps[row.status]}
                        name="age"
                        onChange={(e) => handleStatusChange(e, row._id)}
                        inputProps={{ "aria-label": "age" }}
                      >
                        <option value={steps[0]}>{steps[0]}</option>
                        <option value={steps[1]}>{steps[1]}</option>
                        <option value={steps[2]}>{steps[2]}</option>
                        <option value={steps[3]}>{steps[3]}</option>
                      </NativeSelect>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {myCompOrders ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Total Price</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myCompOrders.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      12.12.2021
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleClickOpen}
                      >
                        View Items
                      </Button>
                      <Dialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                      >
                        <DialogContent dividers>
                          {row.fooditems.map((cr, index) => {
                            return (
                              <>
                                <div className="cartItem">
                                  <div className="cartItem-top">
                                    <img src={cr.foodImage} alt="" />
                                    <span>
                                      {cr.foodName} x {cr.quantity}
                                    </span>
                                  </div>
                                  <p>
                                    {cr.foodName} - {cr.qPrice} €
                                  </p>
                                </div>
                              </>
                            );
                          })}
                          {/* <div className="total">
                            <h4>Total Price: {row.totalprice} €</h4>
                          </div> */}
                        </DialogContent>
                        <DialogActions>
                          <Button
                            autoFocus
                            onClick={handleClose}
                            color="primary"
                          >
                            Okay
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                    <TableCell align="right">{row.totalprice}</TableCell>
                    <TableCell align="right">
                      {steps[row.status]}{" "}
                      {/* <NativeSelect
                        value={steps[row.status]}
                        name="age"
                        onChange={(e) => handleStatusChange(e, row._id)}
                        inputProps={{ "aria-label": "age" }}
                      >
                        <option value={steps[0]}>{steps[0]}</option>
                        <option value={steps[1]}>{steps[1]}</option>
                        <option value={steps[2]}>{steps[2]}</option>
                        <option value={steps[3]}>{steps[3]}</option>
                      </NativeSelect> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </TabPanel>
    </div>
  );
};

export default Orders;
