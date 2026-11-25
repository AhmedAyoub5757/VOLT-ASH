export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__logo">VOLT & ASH</span>
        <p className="footer__tagline">Engineered for motion.</p>
      </div>
      <div className="footer__links">
        <a href="#">Instagram</a>
        <a href="#">Contact</a>
        <a href="#">Shipping</a>
      </div>
      <p className="footer__legal">© {new Date().getFullYear()} VOLT & ASH. All rights reserved.</p>
    </footer>
  );
}