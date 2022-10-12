import React, { useEffect } from "react";
import Link from "@mui/material/Link";
import axios from "axios";
import { useSnackbar } from "notistack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useMergeState } from "../../utils/custom-hooks";
import { formatDate } from "../../utils/date";
import { getFiles, deleteFile } from "../../api";

export default function DashboardContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({ files: [] });

  const init = async () => {
    const response = await getFiles();

    if (response?.success) {
      setState({
        files: response?.data,
      });
    }
  };

  const handleViewFile = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleDownloadFile = (file) => {
    axios({
      url: file?.fileUrl,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const href = URL.createObjectURL(response?.data);

      const link = document.createElement("a");

      link.href = href;

      link.setAttribute("download", file?.fileName);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(href);
    });
  };

  const handleDeleteFile = async (id) => {
    const response = await deleteFile({ id });

    if (response?.success) {
      enqueueSnackbar(response?.message, { variant: "success" });
      await init();
    } else {
      enqueueSnackbar(response?.message, { variant: "error" });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-3/4 mt-10">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>File Description</TableCell>
                  <TableCell>Uploaded At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state?.files?.map((file) => (
                  <TableRow key={file?._id}>
                    <TableCell component="th" scope="row">
                      {file?.user?.firstName}
                    </TableCell>
                    <TableCell>{file?.user?.lastName}</TableCell>
                    <TableCell>
                      <div
                        className="w-fit underline text-blue-400 cursor-pointer"
                        onClick={() => handleViewFile(file?.fileUrl)}
                      >
                        {file?.fileDescription}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(file?.createdAt, "lll")}</TableCell>
                    <TableCell>{formatDate(file?.updatedAt, "lll")}</TableCell>
                    <TableCell>
                      <div className="flex justify-between items-center">
                        <div
                          className="w-fit underline text-blue-400 cursor-pointer mr-3"
                          onClick={() => handleDownloadFile(file)}
                        >
                          Download
                        </div>

                        <Link href={`/upload-file?id=${file?._id}`}>
                          <EditIcon />
                        </Link>

                        <IconButton onClick={() => handleDeleteFile(file?._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
