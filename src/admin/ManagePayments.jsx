import React, { useEffect, useState } from "react";

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("gjp_token");
      const res = await fetch("http://localhost:5000/api/payment/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPayments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };



  if (loading) return <div style={{ padding: "20px" }}>Loading payments...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Course Enrollments</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "12px" }}>User</th>
              <th style={{ padding: "12px" }}>Course</th>
              <th style={{ padding: "12px" }}>Amount</th>
              <th style={{ padding: "12px" }}>UTR Number</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>No payments found</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: "500" }}>{p.users?.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{p.users?.email}</div>
                  </td>
                  <td style={{ padding: "12px" }}>{p.courses?.name}</td>
                  <td style={{ padding: "12px" }}>₹{p.amount}</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: "bold" }}>{p.utr_number}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      background: p.status === "pending" ? "#fef3c7" : p.status === "success" ? "#dcfce7" : "#fee2e2",
                      color: p.status === "pending" ? "#92400e" : p.status === "success" ? "#166534" : "#991b1b"
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontSize: "13px" }}>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
