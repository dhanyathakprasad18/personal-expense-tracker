import { useEffect, useState } from "react";
import axios from "axios";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            search,
            category,
            paymentMethod
          }
        }
      );

      setExpenses(response.data);
      setMessage("");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to load expenses"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setExpenses(
        expenses.filter((expense) => expense._id !== id)
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to delete expense"
      );
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSearch = () => {
    fetchExpenses();
  };

  return (
  <div className="expenses-container">

    <div className="expenses-header">
      <div>
        <h1>My Expenses</h1>
        <p>View and manage all your expenses.</p>
      </div>

      <button
        onClick={() => {
          window.location.href = "/add-expense";
        }}
      >
        + Add Expense
      </button>
    </div>

    <div className="filter-container">

      <div className="filter-group">
        <label>Search</label>

        <input
          type="text"
          placeholder="Search by description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Category</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Education">Education</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Payment Method</label>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">All Methods</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Net Banking">Net Banking</option>
        </select>
      </div>

      <button
        className="filter-button"
        onClick={handleSearch}
      >
        Apply Filters
      </button>

    </div>

    {message && (
      <p className="error-message">{message}</p>
    )}

    <div className="expense-list">

      {expenses.length === 0 ? (
        <div className="empty-state">
          <h2>No Expenses Found</h2>
          <p>Start tracking your spending by adding an expense.</p>
        </div>
      ) : (
        expenses.map((expense) => (
          <div
            className="expense-item"
            key={expense._id}
          >

            <div className="expense-info">
              <h3>{expense.description}</h3>

              <div className="expense-details">
                <span>{expense.category}</span>
                <span>•</span>
                <span>
                  {new Date(
                    expense.date
                  ).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{expense.paymentMethod}</span>
              </div>
            </div>

            <div className="expense-right">

              <strong>
                ₹{Number(expense.amount).toFixed(2)}
              </strong>

              <div className="expense-actions">

                <button
                  className="edit-button"
                  onClick={() => {
                    window.location.href =
                      `/edit-expense/${expense._id}`;
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(expense._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))
      )}

    </div>

  </div>
);
}

export default ExpenseList;