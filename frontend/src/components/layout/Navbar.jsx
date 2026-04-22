
const Navbar = ({ setPage }) => {
  return (
    <div>
      <button onClick={() => setPage("login")}>Login</button>
      <button onClick={() => setPage("register")}>Register</button>
      <button onClick={() => setPage("billing")}>Billing</button>
      <button onClick={() => setPage("patients")}>Patients</button>
      <button onClick={() => setPage("appointment")}>Appointment</button>
    </div>
  );
};

export default Navbar;