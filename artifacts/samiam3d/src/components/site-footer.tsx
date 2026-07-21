export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="site-footer__inner">
        <h2>Let&apos;s make something playable.</h2>
        <div className="site-footer__links">
          <a href="mailto:samiam3d@gmail.com">samiam3d@gmail.com</a>
          <a
            href="https://www.linkedin.com/in/samiam3d"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
        <p>© {new Date().getFullYear()} Sam Gutierrez.</p>
      </div>
    </footer>
  );
}
