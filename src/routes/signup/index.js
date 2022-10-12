import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ErrorMessage from "../../components/ErrorMessage";
import { useMergeState } from "../../utils/custom-hooks";
import { APP_TOKEN } from "../../utils/constants";
import { signup } from "../../api";

export default function SignUpContainer(props) {
  const { getUserInfo } = props;

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: {},
  });

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.firstName) {
      payload = { firstName: true, ...payload };
      isValid = false;
    }

    if (!state.lastName) {
      payload = { lastName: true, ...payload };
      isValid = false;
    }

    if (!state.email) {
      payload = { email: true, ...payload };
      isValid = false;
    }

    if (!state.password) {
      payload = { password: true, ...payload };
      isValid = false;
    }

    if (!state.confirmPassword || state.password !== state.confirmPassword) {
      payload = { confirmPassword: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSignUp = async () => {
    if (!isFormValid()) {
      return;
    }

    const payload = {
      firstName: state?.firstName,
      lastName: state?.lastName,
      email: state?.email,
      password: state?.password,
      confirmPassword: state?.confirmPassword,
    };

    const response = await signup(payload);

    if (response?.success) {
      localStorage.setItem(APP_TOKEN, response?.data?.token);

      await getUserInfo();

      navigate("/dashboard");
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-2/5">
        <div className="my-10 text-2xl font-semibold text-center">Register</div>

        <div className="my-4">
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            name="firstName"
            value={state?.firstName}
            onChange={handleChange}
            required
            error={state?.errors?.firstName}
          />

          {state?.errors?.firstName && (
            <ErrorMessage message="First name is required" />
          )}
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={state?.lastName}
            onChange={handleChange}
            required
            error={state?.errors?.lastName}
          />

          {state?.errors?.lastName && (
            <ErrorMessage message="Last name is required" />
          )}
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={state?.email}
            onChange={handleChange}
            required
            error={state?.errors?.email}
          />

          {state?.errors?.email && <ErrorMessage message="Email is required" />}
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            name="password"
            value={state?.password}
            onChange={handleChange}
            required
            error={state?.errors?.password}
          />

          {state?.errors?.password && (
            <ErrorMessage message="Password is required" />
          )}
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            name="confirmPassword"
            value={state?.confirmPassword}
            onChange={handleChange}
            required
            error={state?.errors?.confirmPassword}
          />

          {state?.errors?.confirmPassword && (
            <ErrorMessage message="Confirm password is required" />
          )}
        </div>

        <div className="my-4">
          <Button fullWidth variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
