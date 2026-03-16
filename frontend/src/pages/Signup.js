import '../App.css';

function Signup() {
  return (
    <main>
      <form className="login-form">
        <h2>Create an account</h2>
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Register</button>
        <p>Already have an account? <a href="/login">Sign in</a></p>
      </form>
    </main>
  );
}

export default Signup;