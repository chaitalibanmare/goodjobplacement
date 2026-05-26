import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // YOUR UPI ID HERE
  const UPI_ID = "primestudystart@oksbi";

  const [timeLeft, setTimeLeft] = useState(100); // 5 minutes timer

  useEffect(() => {
    if (location.state) {
      setCourse(location.state?.course || location.state);
    } else {
      // Fetch course if not in state
      fetch(`http://localhost:5000/api/courses/${courseId}`)
        .then(res => res.json())
        .then(data => setCourse(data));
    }
  }, [location.state, courseId]);

  useEffect(() => {
    if (submitted) return; // Stop timer if submitted

    if (timeLeft <= 0) {
      alert("Payment session expired. Please try again.");
      navigate("/courses");
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, submitted, navigate]);

  const handleSubmitUTR = async (e) => {
    e.preventDefault();
    if (!utrNumber) return alert("Please enter Transaction ID (UTR)");

    try {
      setLoading(true);
      const token = localStorage.getItem("gjp_token");

      const res = await fetch("http://localhost:5000/api/payment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: course.id,
          utrNumber: utrNumber,
          amount: course.fees,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment submission failed");
      setLoading(false);
    }
  };

  if (!course) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading course details...</p>;

  if (submitted) {
    return (
      <div style={{ maxWidth: "500px", margin: "100px auto", textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#16a34a" }}>✅ Payment Submitted!</h2>
        <p style={{ margin: "20px 0", color: "#555" }}>
          You have been successfully enrolled in this course. You can now start learning!
        </p>
        <button 
          onClick={() => navigate("/my-courses")}
          style={{ padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          Go to My Courses
        </button>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${UPI_ID}%26pn=GoodJobPlacement%26am=${course.fees}%26cu=INR`;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "25px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Complete Payment</h2>

      <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", marginBottom: "25px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>{course.name}</h3>
        <p style={{ margin: "5px 0", color: "#64748b" }}><strong>Amount to Pay:</strong> ₹{course.fees}</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <div style={{ marginBottom: "15px", padding: "10px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontWeight: "bold" }}>
          ⏱ Time remaining to complete payment: {formatTime(timeLeft)}
        </div>
        <p style={{ marginBottom: "15px", color: "#475569", fontWeight: "500" }}>Scan this QR to pay via any UPI App</p>
        <div style={{ background: "#fff", padding: "15px", borderRadius: "12px", display: "inline-block", border: "1px solid #eee" }}>
          <img src={qrUrl} alt="UPI QR Code" style={{ width: "200px", height: "200px" }} />
        </div>
        <p style={{ marginTop: "10px", color: "#6366f1", fontWeight: "bold" }}>UPI ID: {UPI_ID}</p>
      </div>

      <form onSubmit={handleSubmitUTR}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#334155" }}>
            Enter Transaction ID / UTR Number
          </label>
          <input
            type="text"
            placeholder="12-digit UTR Number"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "16px" }}
            required
          />
          <small style={{ color: "#64748b", marginTop: "5px", display: "block" }}>
            You will find this in your payment app (PhonePe, Google Pay, etc.)
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s"
          }}
        >
          {loading ? "Submitting..." : "Submit Payment Details"}
        </button>
      </form>
    </div>
  );
}
