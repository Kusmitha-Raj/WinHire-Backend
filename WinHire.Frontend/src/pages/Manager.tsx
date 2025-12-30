import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Manager(){
  const [list,setList]=useState<any[]>([]);
  const [form]=useState({
    code:"",
    practiceId:1,
    positionTitle:"",
    jobDescription:"",
    experienceMin:1,
    experienceMax:5,
    noOfPositions:1
  });

  async function load(){
    const res = await api.get("/hiring-manager/requisitions");
    setList(res.data);
  }

  useEffect(()=>{ load(); },[]);

  async function createReq(e:any){
    e.preventDefault();
    await api.post("/hiring-manager/requisitions",form);
    load();
  }

  return(
    <div>
      <h2>Hiring Manager – Requisitions</h2>

      <form onSubmit={createReq}>
        <input placeholder="Code" onChange={e=>form.code=e.target.value}/>
        <input placeholder="Title" onChange={e=>form.positionTitle=e.target.value}/>
        <textarea placeholder="JD" onChange={e=>form.jobDescription=e.target.value}/>
        <button>Create</button>
      </form>

      <h3>My Requisitions</h3>
      <ul>
        {list.map(r=>(
          <li key={r.requisition_Id}>
            {r.requisitionCode} — {r.positionTitle} — {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
