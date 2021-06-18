import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [values, setValues] = React.useState({
    uname: "",
    email: "",
    password: "",
  });
  const [signUpMode, setSignUpMode] = React.useState(true);

  const { isLoading, errorMsg, sendRequest, clearError } = useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(values);

    if (signUpMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            username: values.uname,
            address: values.address,
            phone: values.phone,
            email: values.email,
            password: values.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeMode = () => {
    setSignUpMode((prevMode) => !prevMode);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  return (
    <Container maxWidth="sm">
      <div className="authContainer">
        <div className="formHeader">
          <div>
            <h2>{signUpMode ? "Sign Up" : "Login"}</h2>
          </div>
          <div>
            <span>Switch to</span>
            <button onClick={changeMode}>
              {signUpMode ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
        <form noValidate autoComplete="off" onSubmit={authSubmitHandler}>
          <Grid container spacing={3}>
            {signUpMode ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="uname"
                    label="Restaurant Name"
                    onChange={handleChange("uname")}
                    value={values.uname}
                    type="text"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    label="address"
                    onChange={handleChange("address")}
                    value={values.address}
                    type="text"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Phone"
                    onChange={handleChange("phone")}
                    value={values.phone}
                    type="text"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </>
            ) : null}

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                onChange={handleChange("email")}
                value={values.email}
                type="Email"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                label="Password"
                onChange={handleChange("password")}
                value={values.password}
                type="password"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary" type="submit">
                {signUpMode ? "Sign In" : "Login"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Auth;
