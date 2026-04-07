export default function TestPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>🚀 DEPLOYMENT SUCCESS!</h1>
        <p style={{ color: '#666' }}>If you can see this, your Admin panel is live and working.</p>
        <a href="/login" style={{ color: '#3B82F6', textDecoration: 'underline', marginTop: '20px', display: 'inline-block' }}>Go to Login Page</a>
      </div>
    </div>
  );
}
