import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ErrorMessage from "../../components/ErrorMessage";
import { useMergeState } from "../../utils/custom-hooks";
import { uploadFile, getFileById, updateFile } from "../../api";

export default function UploadFileContainer() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const fileId = searchParams.get("id");

  const [state, setState] = useMergeState({
    // firstName: "",
    // lastName: "",
    fileDescription: "",
    isEditMode: false,
    file: null,
    fileBase64: null,
    isEditingFile: false,
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

    // if (!state.firstName) {
    //   payload = { firstName: true, ...payload };
    //   isValid = false;
    // }

    // if (!state.lastName) {
    //   payload = { lastName: true, ...payload };
    //   isValid = false;
    // }

    if (!state.fileDescription) {
      payload = { fileDescription: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const fileUploadRef = useRef();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileUpload = async (event) => {
    const file = event?.target?.files && event?.target?.files[0];

    if (!file) {
      return;
    }

    event.target.value = "";

    const base64 = await toBase64(file);

    setState({
      file,
      fileBase64: base64,
      isEditingFile: true,
    });
  };

  const handleFileUploadRef = () => {
    fileUploadRef.current.click();
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    const payload = {
      fileDescription: state?.fileDescription,
    };

    if (state?.fileBase64) {
      payload.fileName = state?.file?.name;
      payload.fileBase64 = state?.fileBase64;
      payload.fileContentType = state.file?.type;
    }

    let response = {};

    if (state?.isEditMode) {
      payload.id = fileId;
      response = await updateFile(payload);
    } else {
      response = await uploadFile(payload);
    }

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
      navigate("/dashboard");
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }
  };

  useEffect(() => {
    const asyncHandler = async () => {
      const response = await getFileById(fileId);

      if (response?.success) {
        setState({
          file: response?.data?.fileUrl,
          fileDescription: response?.data?.fileDescription,
          isEditMode: true,
        });
      }
    };

    if (fileId) {
      asyncHandler();
    }
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-2/5">
        <div className="my-4">
          <div className="font-semibold mb-4">
            Which file would you like to upload?
          </div>

          <img
            className="rounded-md"
            src={state?.isEditingFile ? state?.fileBase64 : state?.file}
            alt={state?.file?.name}
          />

          <div className="mt-4 mb-10">
            <Button
              variant="contained"
              color="info"
              onClick={handleFileUploadRef}
            >
              Choose File
            </Button>
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileUploadRef}
            onChange={handleFileUpload}
          />
        </div>

        <div className="my-4">
          <TextField
            fullWidth
            label="File Description"
            variant="outlined"
            name="fileDescription"
            value={state?.fileDescription}
            onChange={handleChange}
            required
            error={state?.errors?.fileDescription}
          />

          {state?.errors?.fileDescription && (
            <ErrorMessage message="File description is required" />
          )}
        </div>

        <div className="my-4">
          <Button fullWidth variant="contained" onClick={handleSubmit}>
            {state?.isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
