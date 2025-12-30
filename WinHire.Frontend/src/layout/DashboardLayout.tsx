import type { ReactNode } from "react";
import "./dashboard.css";

type Props = {
  title: string;
  setPage?: (p: string)=>void;
  children: ReactNode;
  userRole?: string;
};

export default function DashboardLayout({ title, children, setPage, userRole }: Props) {
  return (
    <div className="app">

      <aside className="sidebar">
        <div className="logo">WinHire</div>

        <nav className="menu">
          <a onClick={()=>setPage?.("dashboard")} className="active">Dashboard</a>

          <div className="section">Recruiter</div>
          <a onClick={()=>setPage?.("recruiter-add")}>Add Candidate</a>
          {userRole !== 'Panelist' && (
            <a onClick={()=>setPage?.("recruiter-interviews")}>Interviews</a>
          )}

          <div className="section">Manager</div>
          <a onClick={()=>setPage?.("manager-req")}>Requisitions</a>

          <div className="section">Panelist</div>
          <a onClick={()=>setPage?.("panelist")}>Interview Feedback</a>

          <div className="section">Project Manager</div>
          <a onClick={()=>setPage?.("pm")}>Final Decision</a>

          <div className="bottom">
            <div className="profile">
              <div className="avatar">HR</div>
              <div>
                <b>Hiring Team</b>
                <div>WinHire</div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <main className="main">
        <div className="header">
          <h1>{title}</h1>
        </div>

        {children}
      </main>
    </div>
  );
}
