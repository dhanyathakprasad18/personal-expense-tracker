import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/expenses",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const expense = response.data.find(
          (item) => item._id === id
        );

        if (!expense) {
          setMessage("Expense not found");
          return;
        }

        setAmount(expense.amount);
        setCategory(expense.category);
        setDescription(expense.description || "");

        setDate(
          new Date(expense.date).toISOString().split("T")[0]
        );

        setPaymentMethod(expense.paymentMethod);

      } catch (error) {
        setMessage(
          error.response?.data?.message ||
          "Failed to load expense"
        );
      }
    };

    fetchExpense();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/expenses/${id}`,
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
        "Failed to update expense"
      );
    }
  };

  return (
  <div className="form-container">

    <div className="form-header">
      <div>
        <h1>Edit Expense</h1>
        <p>Update your expense details.</p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/expenses")}
      >
        Back to Expenses
      </button>
    </div>

    <form
      className="expense-form"
      onSubmit={handleUpdate}
    >

      <div className="form-group">
        <label>Amount</label>

        <input
          type="number"
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
          <option value="">Select payment method</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Net Banking">
            Net Banking
          </option>
        </select>
      </div>

      <button type="submit">
        Update Expense
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

export default EditExpense;