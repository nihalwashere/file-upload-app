import Link from "@mui/material/Link";
import { APP_TOKEN } from "../../utils/constants";

export default function NavBar() {
  const handleLogout = () => {
    localStorage.removeItem(APP_TOKEN);
    window.location.href = "/signin";
  };

  return (
    <div className="p-4 w-full h-16 flex justify-between items-center bg-red-light">
      <div className="font-semibold">File Upload App</div>

      <div className="flex justify-between items-center">
        <div>
          {window.location.pathname.includes("/upload-file") ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <Link href="/upload-file">Upload File</Link>
          )}
        </div>

        <div className="ml-4 cursor-pointer w-fit">
          <Link onClick={handleLogout}>Logout</Link>
        </div>
      </div>
    </div>
  );
}
