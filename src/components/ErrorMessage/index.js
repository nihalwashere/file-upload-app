import Typography from "@mui/material/Typography";

export default function ErrorMessage(props) {
  const { message } = props;

  return (
    <Typography variant="subtitle2" color="#d32f2f" mt={0.2}>
      {message}
    </Typography>
  );
}
