import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Recruiter from "../pages/Recruiter";
import Manager from "../pages/Manager";
import Panelist from "../pages/Panelist";
import PM from "../pages/PM";

export default function Dashboard() {
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
    <DashboardLayout title="WinHire Dashboard" setPage={setPage}>
      {render()}
    </DashboardLayout>
  );
}
