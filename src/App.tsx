import LoginPage from "@/features/auth/pages/login-page";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      {/* <LoginPage /> */}
      hello
      <Outlet />
    </div>
  );
}

export default App;
