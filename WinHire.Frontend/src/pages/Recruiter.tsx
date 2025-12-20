import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function Recruiter(){

  const [loading,setLoading] = useState(false);
  const [candidates,setCandidates] = useState<any[]>([]);

  const [form,setForm] = useState({
    fullName:"",
    email:"",
    phone:"",
    totalExperience:1,
    primarySkill:""
  });

  async function loadCandidates(){
    try{
      const res = await api.get("/recruiter/candidates");
      console.log("Candidates Loaded", res.data);
      setCandidates(res.data);
    }catch(err){
      console.error("Failed loading candidates", err);
    }
  }

  useEffect(()=>{ loadCandidates(); },[]);

  async function addCandidate(e:any){
    e.preventDefault();
    setLoading(true);

    try{
      await api.post("/recruiter/candidates", form);
      alert("Candidate Added 🎉");

      setForm({
        fullName:"",
        email:"",
        phone:"",
        totalExperience:1,
        primarySkill:""
      });

      loadCandidates();
    }
    catch(err){
      alert("Failed to add candidate");
      console.error(err);
    }

    setLoading(false);
  }

  return(
    <>
      {/* STAT CARD */}
      <div className="stats">
        <div className="statCard">
          <div className="statTitle">Total Candidates</div>
          <div className="statValue">{candidates.length}</div>
        </div>
      </div>

      {/* ADD FORM */}
      <h2>Add Candidate</h2>

      <form
        onSubmit={addCandidate}
        style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:15,marginTop:10}}
      >
        <input placeholder="Full Name" value={form.fullName}
          onChange={e=>setForm({...form, fullName:e.target.value})} />

        <input placeholder="Email" value={form.email}
          onChange={e=>setForm({...form, email:e.target.value})} />

        <input placeholder="Phone" value={form.phone}
          onChange={e=>setForm({...form, phone:e.target.value})} />

        <input placeholder="Primary Skill" value={form.primarySkill}
          onChange={e=>setForm({...form, primarySkill:e.target.value})} />

        <input placeholder="Experience" type="number"
          value={form.totalExperience}
          onChange={e=>setForm({...form, totalExperience:Number(e.target.value)})} />

        <button disabled={loading}>
          {loading ? "Saving..." : "Add Candidate"}
        </button>
      </form>

      {/* LIST */}
      <h2 style={{marginTop:25}}>Candidate List</h2>

      {candidates.length === 0 && (
        <div style={{color:"#9ba3c7"}}>No candidates found...</div>
      )}

      {candidates.map((c:any)=>(
        <div className="listCard" key={c.candidateId}>
          
          <div className="listTop">
            <b>{c.fullName}</b>

            <span className={`badge ${
              c.status === "Interviewed" ? "green" :
              c.status === "Assigned" ? "blue" : "yellow"
            }`}>
              {c.status || "New"}
            </span>
          </div>

          <div style={{color:"#9ba3c7",marginTop:5}}>
            📧 {c.email}  |  📞 {c.phone}
          </div>

          <div style={{color:"#9ba3c7",marginTop:5}}>
            ⭐ {c.primarySkill} — {c.totalExperience} yrs
          </div>
        </div>
      ))}
    </>
  );
}
