import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="hero animate-fade-in">
      <h1>Task<span>.</span></h1>
      <p>Organize your tasks, streamline your workflow, and boost your daily productivity with a minimalist cyber-dashboard.</p>
      <div className="hero-actions">
        {user ? (
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
