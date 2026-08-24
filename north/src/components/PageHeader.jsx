import Sparkles from "./Sparkles";

function PageHeader({ number, title, subtitle }) {
  return (
    <section className="page-header">

      <Sparkles />

      <div className="page-header-glow"></div>

      <div className="page-header-content">

        <p className="page-header-number">
          {number}
        </p>

        <h1>{title}</h1>

        <p className="page-header-subtitle">
          {subtitle}
        </p>

      </div>

    </section>
  );
}

export default PageHeader;