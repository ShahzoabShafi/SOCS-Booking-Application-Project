import '../App.css';

function Login() {
  return (
    <main>
      <form className="login-form">
        <h2>Sign in</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign in</button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </main>
  );
}

export default Login;