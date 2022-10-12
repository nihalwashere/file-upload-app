import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ErrorMessage from "../../components/ErrorMessage";
import { useMergeState } from "../../utils/custom-hooks";
import { APP_TOKEN } from "../../utils/constants";
import { signin } from "../../api";

export default function SignInContainer(props) {
  const { getUserInfo } = props;

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    email: "",
    password: "",
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

    if (!state.email) {
      payload = { email: true, ...payload };
      isValid = false;
    }

    if (!state.password) {
      payload = { password: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSignIn = async () => {
    if (!isFormValid()) {
      return;
    }

    const payload = {
      email: state?.email,
      password: state?.password,
    };

    const response = await signin(payload);

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
        <div className="my-10 text-2xl font-semibold text-center">Login</div>

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
          <Button fullWidth variant="contained" onClick={handleSignIn}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
