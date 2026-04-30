import React, { useEffect, useState } from "react";

export default function ManageVacancies() {

  const [vacancies, setVacancies] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const vacanciesPerPage = 6;

  useEffect(() => {
    fetchVacancies();
  }, []);

  /* FETCH VACANCIES */

  async function fetchVacancies(){

    try{

      const res = await fetch("http://localhost:5000/api/vacancy/all");
      const data = await res.json();

      if(res.ok){
        setVacancies(data.vacancies || []);
      }

    }catch(err){
      console.log(err);
    }

  }

  /* VERIFY VACANCY */

  async function verifyVacancy(id){

    try{

      const res = await fetch(`http://localhost:5000/api/vacancy/verify/${id}`,{
        method:"PUT"
      });

      const data = await res.json();

      if(res.ok){

        alert("Vacancy verified successfully");
        fetchVacancies();

      }else{

        alert(data.error || "Verification failed");

      }

    }catch(err){

      console.log(err);
      alert("Server error");

    }

  }

  /* ENABLE VACANCY */

  async function toggleEnable(id){

  try{

    const res = await fetch(`http://localhost:5000/api/vacancy/enable/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      }
    });

    const data = await res.json();

    if(res.ok){
      alert("Vacancy status updated");
      fetchVacancies(); // refresh table
    }else{
      alert(data.error || "Failed to update status");
    }

  }catch(err){
    console.error(err);
    alert("Server error");
  }

}

  /* SEARCH */

  const filteredVacancies = vacancies.filter(v =>
    v.companyName.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase()) ||
    v.field.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */

  const indexOfLast = currentPage * vacanciesPerPage;
  const indexOfFirst = indexOfLast - vacanciesPerPage;

  const currentVacancies = filteredVacancies.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredVacancies.length / vacanciesPerPage);

  return (

<section style={{padding:"0px 20px"}}>

<div className="container">

<h2 style={{marginBottom:"10px"}}>Manage Vacancies</h2>

<p style={{color:"var(--muted)", marginBottom:"20px"}}>
Total Companies: {vacancies.length}
</p>


{/* SEARCH */}

<input
type="text"
placeholder="Search company, location, field..."
value={search}
onChange={(e)=>{
setSearch(e.target.value);
setCurrentPage(1);
}}
style={{
padding:"10px",
width:"300px",
borderRadius:"6px",
border:"1px solid #ccc",
marginBottom:"20px"
}}
/>


<div style={{
background:"var(--card)",
padding:"30px",
borderRadius:"14px",
boxShadow:"0 12px 40px rgba(0,0,0,0.1)",
overflowX:"auto"
}}>

<table style={{
width:"100%",
borderCollapse:"separate",
borderSpacing:"0 12px"
}}>

<thead>

<tr>

<th>Company</th>
<th>Location</th>
<th>Field</th>
<th>Total</th>
<th>Type</th>
<th>Posted</th>
<th>Last Date</th>
<th>Verify</th>
<th>View</th>
<th>Admin</th>

</tr>

</thead>

<tbody>

{currentVacancies.map(v => (

<tr key={v._id} style={{
background:"white",
boxShadow:"0 6px 20px rgba(0,0,0,0.08)"
}}>

<td>{v.companyName}</td>

<td>{v.location}</td>

<td>{v.field}</td>

<td>{v.totalVacancies}</td>

<td>{v.timeType}</td>

<td>
{new Date(v.postedOn).toLocaleDateString()}
</td>

<td>
{new Date(v.lastDate).toLocaleDateString()}
</td>


{/* VERIFY BUTTON */}

<td>

{v.verificationStatus === "verified" ? (

<span style={{
background:"#dcfce7",
color:"#166534",
padding:"5px 10px",
borderRadius:"8px"
}}>
Verified
</span>

) : (

<button
onClick={()=>verifyVacancy(v._id)}
style={{
background:"#22c55e",
color:"white",
border:"none",
padding:"6px 14px",
borderRadius:"6px",
cursor:"pointer"
}}
>
Verify
</button>

)}

</td>


{/* VIEW BUTTON */}

<td>

<button
onClick={()=>setSelectedVacancy(v)}
style={{
background:"#3b82f6",
color:"white",
border:"none",
padding:"6px 14px",
borderRadius:"6px"
}}
>
View
</button>

</td>


{/* ENABLE BUTTON */}

<td>

<button
disabled={v.verificationStatus !== "verified"}
onClick={()=>toggleEnable(v._id)}
style={{
background: v.verificationStatus !== "verified"
? "#9ca3af"
: "#7c3aed",
color:"white",
border:"none",
padding:"6px 14px",
borderRadius:"6px",
cursor:"pointer"
}}
>
{v.adminEnabled ? "Disable" : "Enable"}
</button>

</td>

</tr>

))}

</tbody>

</table>


{/* PAGINATION */}

<div style={{
marginTop:"20px",
display:"flex",
justifyContent:"center",
gap:"10px"
}}>

<button
disabled={currentPage === 1}
onClick={()=>setCurrentPage(currentPage - 1)}
>
Prev
</button>

{Array.from({length: totalPages},(_,i)=>(

<button
key={i}
onClick={()=>setCurrentPage(i+1)}
style={{
background: currentPage === i+1 ? "#7c3aed" : "#e5e7eb",
color: currentPage === i+1 ? "white" : "black",
border:"none",
padding:"6px 12px",
borderRadius:"4px"
}}
>
{i+1}
</button>

))}

<button
disabled={currentPage === totalPages}
onClick={()=>setCurrentPage(currentPage + 1)}
>
Next
</button>

</div>

</div>

</div>


{/* VACANCY MODAL */}

{selectedVacancy && (

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"white",
padding:"30px",
borderRadius:"10px",
width:"500px"
}}>

<h2>{selectedVacancy.companyName}</h2>

<p><b>Location:</b> {selectedVacancy.location}</p>

<p><b>Field:</b> {selectedVacancy.field}</p>

<p><b>Total Vacancies:</b> {selectedVacancy.totalVacancies}</p>

<p><b>Description:</b> {selectedVacancy.description}</p>

<button
onClick={()=>setSelectedVacancy(null)}
style={{
marginTop:"20px",
background:"#ef4444",
color:"white",
border:"none",
padding:"6px 14px",
borderRadius:"6px"
}}
>
Close
</button>

</div>

</div>

)}

</section>

  );
}