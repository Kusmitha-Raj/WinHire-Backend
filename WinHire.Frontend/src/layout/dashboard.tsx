import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Recruiter from "../pages/Recruiter";
import Manager from "../pages/Manager";
import Panelist from "../pages/Panelist";
import PM from "../pages/PM";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState("recruiter");

  function render() {
    switch (page) {
      case "recruiter":
        return <Recruiter />;
      case "manager":
        return <Manager />;
      case "panelist":
        return <Panelist />;
      case "pm":
        return <PM />;
      default:
        return <div>Welcome to WinHire Dashboard</div>;
    }
  }

  return (
    <DashboardLayout title="WinHire Dashboard" setPage={setPage} userRole={user?.role}>
      {render()}
    </DashboardLayout>
  );
}
