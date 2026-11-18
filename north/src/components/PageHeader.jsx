import Sparkles from "./Sparkles";
import "./PageHeader.css";

function PageHeader({ number, title, subtitle, children }) {
  return (
    <section className="page-header">
      <Sparkles />
      <div className="page-header-glow" aria-hidden="true" />
      <div className="page-header-content">
        {number && <p className="section-label">{number}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        {children && <div className="page-header-actions">{children}</div>}
      </div>
    </section>
  );
}

export default PageHeader;
