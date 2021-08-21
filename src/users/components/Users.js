import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./users.css";

import { useForm } from "react-hook-form";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { makeStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";

import QRCode from "qrcode.react";
import ReactToPdf from "react-to-pdf";
import { Divider } from "@material-ui/core";
import Orders from "./Orders";

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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 894,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const Users = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const [restInfo, setRestInfo] = useState();

  const [catname, setCatname] = useState();
  const [allCat, setAllCat] = useState();

  const [value, setValue] = useState(0);
  const classes = useStyles();

  const [qrUrl, setQrUrl] = useState();

  const [foodCat, setFoodCat] = useState();

  const [createdFoods, setCreatedFoods] = useState();

  const ref = React.createRef();

  const { register, handleSubmit } = useForm();

  const options = {
    orientation: "portrait",
    unit: "in",
    format: [6, 8],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);

  /* useEffect(() => {
    const getUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        setLoadedUsers(responseData.users);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [sendRequest, auth.token]); */

  const onChangeHandler = (e) => {
    setCatname(e.target.value);
  };

  const createCategory = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/editrestinfo`,
        "POST",
        JSON.stringify({
          category: catname,
          email: restInfo.email,
          userID: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);
      setAllCat(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpen = (id) => {
    setFoodCat(id);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const createFood = async (event) => {
    event.preventDefault();
    console.log("creating food");
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/addfooditem`,
        "POST",
        JSON.stringify({
          fooditem: food,
          email: restInfo.email,
          category: foodCat,
          userID: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCreatedFoods(responseData.fooditems);
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data.foodImage[0]);
    const formData = new FormData();
    formData.append("image", data.foodImage[0]);
    let uploadedimage;
    try {
      uploadedimage = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/uploadfoodimage`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(uploadedimage.imageUrl);
    } catch (error) {
      console.error(error);
    }

    /* try {
      data.latitude = props.coordinates.latitude;
      data.longitude = props.coordinates.longitude;
      data.image = uploadedimage.imageUrl;
      const response = await createTravelEntry(data);
      props.onFormClose();
      console.log(response);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    } */
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/addfooditem`,
        "POST",
        JSON.stringify({
          foodName: data.foodName,
          foodPrice: data.foodPrice,
          foodImage: uploadedimage.imageUrl,
          email: restInfo.email,
          category: foodCat,
          userID: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCreatedFoods(responseData.fooditems);
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const [food, setFood] = useState({
    foodName: "",
    foodPrice: "",
  });
  const foodHandler = (prop) => (event) => {
    setFood({ ...food, [prop]: event.target.value });
  };

  const body = (
    <div>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
    </div>
  );

  const [updatedMsg, setUpdatedMsg] = useState("");
  const updateRestInfo = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/editrestprofileinfo`,
        "POST",
        JSON.stringify({
          restproInfo: restInfo,
          userID: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setUpdatedMsg(responseData.msg);
    } catch (error) {
      console.log(error);
    }
  };

  /* const [updatedRestInfo, setUpdatedRestInfo] = useState({
    username: "",
    address: "",
    phone: "",
    email: "",
  }); */
  const updateRestHandler = (prop) => (event) => {
    setRestInfo({ ...restInfo, [prop]: event.target.value });
  };

  const deleteCat = async (id) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/deletecategory/${id}`,
        "DELETE",
        JSON.stringify({
          email: restInfo.email,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setAllCat(responseData);
    } catch (err) {}
  };

  const deleteFood = async (id) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/api/users/deletefood/${id}`,
        "DELETE",
        JSON.stringify({
          email: restInfo.email,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCreatedFoods(responseData);
    } catch (err) {}
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/api/users`,
          "POST",
          JSON.stringify({
            userID: auth.userId,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );

        setRestInfo(responseData);
        setQrUrl(`http://localhost:3006/${responseData._id}`);
        setAllCat(responseData.categories);
        setCreatedFoods(responseData.fooditems);
        console.log(restInfo);
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [sendRequest, auth.token, auth.userId]);

  return (
    <>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className="tab-main"
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Restaurant Info" {...a11yProps(0)} />
          <Tab label="Add Food Categories" {...a11yProps(1)} />
          <Tab label="Add Food Items" {...a11yProps(2)} />
          <Tab label="Barcode" {...a11yProps(3)} />
          <Tab label="Manage Orders" {...a11yProps(5)} />
          {/* <Tab label="Item Six" {...a11yProps(5)} />
          <Tab label="Item Seven" {...a11yProps(6)} /> */}
        </Tabs>
        <TabPanel value={value} index={0}>
          <div>
            <h2>Restaurant Info:</h2>
            {restInfo ? (
              <form noValidate autoComplete="off" onSubmit={updateRestInfo}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="username"
                      label="Restaurant Name"
                      value={restInfo.username}
                      onChange={updateRestHandler("username")}
                      type="text"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="restAddress"
                      label="Restaurant Address"
                      value={restInfo.address}
                      onChange={updateRestHandler("address")}
                      type="text"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="restPhone"
                      label="Restaurant Phone"
                      value={restInfo.phone}
                      onChange={updateRestHandler("phone")}
                      type="text"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="restEmail"
                      label="Restaurant Email"
                      value={restInfo.email}
                      onChange={updateRestHandler("email")}
                      type="text"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" color="primary" type="submit">
                      Update Info
                    </Button>
                    {updatedMsg ? <p class="successMsg">{updatedMsg}</p> : null}
                  </Grid>
                </Grid>
              </form>
            ) : null}
            {/* {restInfo ? (
              <ul>
                <li>Name: {restInfo.username}</li>
                <li>Address: {restInfo.address}</li>
                <li>Phone: {restInfo.phone}</li>
                <li>Email: {restInfo.email}</li>
              </ul>
            ) : null} */}
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="add-cat">
            <h2>Organize your Menu</h2>
            <form noValidate autoComplete="off" onSubmit={createCategory}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="catname"
                    label="Category Name"
                    value={catname}
                    onChange={onChangeHandler}
                    type="text"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" color="primary" type="submit">
                    Add a category
                  </Button>
                </Grid>
              </Grid>
            </form>
            <div>
              {allCat ? (
                <div className="category-sec">
                  {allCat.map((cat) => {
                    return (
                      <div className="cat-item">
                        <p>{cat.catName}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2} className="tabpanel">
          <div>
            {allCat ? (
              <div>
                <div className="category-sec">
                  {allCat.map((cat) => {
                    return (
                      <Accordion>
                        <AccordionSummary
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <div className="cat-item">
                            <p>{cat.catName}</p>
                            <div>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleClickOpen(cat._id)}
                              >
                                Add item +
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => deleteCat(cat._id)}
                              >
                                Delete category
                              </Button>
                            </div>
                            <Dialog
                              onClose={handleClose}
                              aria-labelledby="customized-dialog-title"
                              open={open}
                            >
                              <DialogTitle
                                id="customized-dialog-title"
                                onClose={handleClose}
                              >
                                Add a food item on your category
                              </DialogTitle>
                              <form
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit(onSubmit)}
                              >
                                <DialogContent dividers>
                                  <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        id="foodName"
                                        name="foodName"
                                        label="Food Name"
                                        {...register("foodName", {
                                          required: true,
                                        })}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                      />
                                      {/* <label htmlFor="title">
                                        Place Name:{" "}
                                      </label>
                                      <input
                                        name="title"
                                        type="text"
                                        {...register("title", {
                                          required: true,
                                        })}
                                        required
                                      /> */}
                                    </Grid>
                                    <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        id="foodPrice"
                                        name="foodPrice"
                                        label="Food Price"
                                        {...register("foodPrice", {
                                          required: true,
                                        })}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                      />
                                      {/* <label htmlFor="desc">Place Name: </label>
                                      <input
                                        name="desc"
                                        type="text"
                                        required
                                        {...register("title", {
                                          required: true,
                                        })}
                                      /> */}
                                    </Grid>
                                    <Grid>
                                      <label htmlFor="image">Image: </label>
                                      <input
                                        name="foodImage"
                                        type="file"
                                        {...register("foodImage", {
                                          required: true,
                                        })}
                                      />
                                    </Grid>
                                  </Grid>
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    autoFocus
                                    onClick={handleClose}
                                    color="primary"
                                    type="submit"
                                  >
                                    Add
                                  </Button>
                                </DialogActions>
                              </form>
                            </Dialog>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          {createdFoods ? (
                            <div className="foodItems">
                              {createdFoods.map((cf) => {
                                if (cf.foodCategory === cat._id)
                                  return (
                                    <div className="foodItem">
                                      <div className="foodItem-left">
                                        <img src={cf.foodImage} alt="" />
                                        <p>
                                          {cf.foodName} - {cf.foodPrice} €
                                        </p>
                                      </div>
                                      <div>
                                        <button type="submit">Update</button>
                                        <button
                                          onClick={() => deleteFood(cf._id)}
                                          type="submit"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  );
                              })}
                            </div>
                          ) : null}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div>
            <div ref={ref}>
              <div className="qr-code">
                {restInfo ? <QRCode value={qrUrl} size={375} /> : null}
                <p>{qrUrl}</p>
              </div>
              <h3>Scan the QR code to get the menu</h3>
            </div>
          </div>
          <ReactToPdf
            targetRef={ref}
            filename="Restaurant-QRcode.pdf"
            options={options}
            x={0.5}
            y={0.5}
            scale={0.8}
          >
            {({ toPdf }) => (
              <Button variant="outlined" color="primary" onClick={toPdf}>
                Generate pdf
              </Button>
            )}
          </ReactToPdf>
        </TabPanel>
        <TabPanel value={value} index={4} className="tab-order">
          <Orders />
        </TabPanel>
        {/* <TabPanel value={value} index={5}>
          item 6
        </TabPanel>
        <TabPanel value={value} index={6}>
          Item Seven
        </TabPanel> */}
      </div>
    </>
  );
};

export default Users;
