import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchExpenses = async () => {
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

        setExpenses(response.data);

      } catch (error) {
        setMessage(
          error.response?.data?.message ||
          "Failed to load dashboard"
        );
      }
    };

    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const expenseCount = expenses.length;

  const averageExpense =
    expenseCount > 0
      ? totalExpenses / expenseCount
      : 0;

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">

        <div>
          <h1>Personal Expense Tracker</h1>
          <p>
            Track and manage your expenses easily.
          </p>
        </div>

        <div>
          <Link to="/add-expense">
            <button>Add Expense</button>
          </Link>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

      <h2>Dashboard</h2>

      {message && <p>{message}</p>}

      <div className="summary-container">

        <div className="summary-card">
          <h3>Total Spent</h3>
          <p>
            ₹{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p>{expenseCount}</p>
        </div>

        <div className="summary-card">
          <h3>Average Expense</h3>
          <p>
            ₹{averageExpense.toFixed(2)}
          </p>
        </div>

      </div>

      <div className="recent-section">

        <div className="section-header">

          <h2>Recent Expenses</h2>

          <Link to="/expenses">
            View All
          </Link>

        </div>

        {recentExpenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          recentExpenses.map((expense) => (

            <div
              className="expense-card"
              key={expense._id}
            >

              <div>

                <h3>
                  {expense.description}
                </h3>

                <p>
                  {expense.category} •{" "}
                  {new Date(
                    expense.date
                  ).toLocaleDateString()}
                </p>

              </div>

              <strong>
                ₹{Number(expense.amount).toFixed(2)}
              </strong>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default Dashboard;