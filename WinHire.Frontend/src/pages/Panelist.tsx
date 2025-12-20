import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Panelist(){
  const [list,setList]=useState<any[]>([]);
  const [feedback,setFeedback]=useState({
    interviewId:0,
    technicalScore:5,
    communicationScore:5,
    cultureFitScore:5,
    recommendation:"SELECT",
    comments:""
  });

  async function load(){
    const res = await api.get("/panelist/interviews");
    setList(res.data);
  }

  async function submitFeedback(e:any){
    e.preventDefault();
    await api.post("/panelist/feedback",feedback);
    alert("Submitted");
  }

  useEffect(()=>{ load(); },[]);

  return(
    <div>
      <h2>Panelist Interviews</h2>
      {list.map(i=>(
        <div key={i.interview_Id}>
          {i.candidateName} — Round {i.roundNo}
        </div>
      ))}

      <h3>Submit Feedback</h3>
      <form onSubmit={submitFeedback}>
        <input placeholder="Interview Id"
         onChange={e=>feedback.interviewId=Number(e.target.value)} />
        <textarea placeholder="Comments"
          onChange={e=>feedback.comments=e.target.value}/>
        <button>Submit</button>
      </form>
    </div>
  );
}
