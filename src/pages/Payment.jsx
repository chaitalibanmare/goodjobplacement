import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (location.state) {
      setCourse(location.state?.course || location.state);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handlePayment = async () => {
  if (!form.name || !form.cardNumber || !form.expiry || !form.cvv) {
    alert("Please fill all payment details");
    return;
  }

  setLoading(true);

  setTimeout(async () => {
    try {
      const token = localStorage.getItem("gjp_token");

      const res = await fetch("http://localhost:5000/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course._id,
        }),
      });

      const data = await res.json();
      console.log("ENROLL RESPONSE:", data);

      // ❗ IMPORTANT CHECK
      if (!res.ok) {
        alert(data.message || "Enrollment failed");
        setLoading(false);
        return;
      }

      setLoading(false);
      alert("Payment Successful 🎉");

      navigate("/my-courses");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setLoading(false);
    }
  }, 1500);
};
  if (!course) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "60px auto",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Payment</h2>

      {/* Course Summary */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          background: "#f9fafb",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>{course.name}</h3>
        <p><strong>Duration:</strong> {course.duration}</p>
        <p><strong>Fees:</strong> ₹{course.fees}</p>
      </div>

      {/* Payment Form */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          padding: "25px",
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Enter Payment Details</h3>

        {/* INPUT COMMON STYLE */}
        {[
          { name: "name", placeholder: "Card Holder Name" },
          { name: "cardNumber", placeholder: "Card Number" },
          { name: "expiry", placeholder: "MM/YY" },
          { name: "cvv", placeholder: "CVV", type: "password" },
        ].map((field, index) => (
          <input
            key={index}
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            style={{
              width: "100%",
              margin: "10px 0",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              outline: "none",
            }}
          />
        ))}

        {/* BUTTON */}
        <button
          onClick={handlePayment}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "none",
            background: "#7c3aed",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : `Pay ₹${course.fees}`}
        </button>
      </div>
    </div>
  );
}