import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function PM(){
  const [list,setList]=useState<any[]>([]);
  const [decision,setDecision]=useState({
    candidateReqId:0,
    decision:"APPROVED",
    comments:""
  });

  async function load(){
    const res = await api.get("/pm/candidates");
    setList(res.data);
  }

  async function submit(e:any){
    e.preventDefault();
    await api.post("/pm/decision",decision);
    alert("Recorded");
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <h2>Project Manager</h2>

      {list.map(c=>(
        <div key={c.candidateRequisitionId}>
          {c.fullName} — {c.primarySkill}
        </div>
      ))}

      <form onSubmit={submit}>
        <input placeholder="CandidateReqId"
          onChange={e=>decision.candidateReqId=Number(e.target.value)} />
        <textarea placeholder="Comments"
          onChange={e=>decision.comments=e.target.value}/>
        <button>Submit</button>
      </form>
    </div>
  );
}
