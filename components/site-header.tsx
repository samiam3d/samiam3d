export function SiteHeader() {
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#" aria-label="SamIam3D home">
          samiam3d
        </a>
        <nav className="site-nav__links" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a className="site-nav__optional" href="#past-projects">
            Archive
          </a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
