import BeatLoader from "react-spinners/BeatLoader";

export default function Spinner({ loading }) {
  return <BeatLoader color="#66b2b2" loading={loading} />;
}
