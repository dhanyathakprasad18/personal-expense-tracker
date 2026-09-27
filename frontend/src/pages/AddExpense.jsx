import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AddExpense() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/expenses",
        {
          amount,
          category,
          description,
          date,
          paymentMethod
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/expenses");
      }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to add expense"
      );
    }
  };

  return (
    <div className="form-container">

      <div className="form-header">
        <div>
          <h1>Add Expense</h1>
          <p>Record a new expense.</p>
        </div>

        <Link to="/dashboard">
          Back to Dashboard
        </Link>
      </div>

      <form
        className="expense-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>Amount</label>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">
              Entertainment
            </option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>

          <input
            type="text"
            placeholder="Example: Lunch"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">
              Select payment method
            </option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Net Banking">
              Net Banking
            </option>
          </select>
        </div>

        <button type="submit">
          Add Expense
        </button>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

      </form>

    </div>
  );
}

export default AddExpense;