import "./LoadingScreen.css";

function LoadingScreen() {
  return (
    <>
      <style>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 999999;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(35, 91, 150, 0.2),
              transparent 35%
            ),
            #0b1626;

          color: white;
        }

        .loading-compass {
          position: relative;

          width: 72px;
          height: 72px;

          display: flex;
          align-items: center;
          justify-content: center;

          animation: compass-float 2s ease-in-out infinite;
        }

        .compass-ring {
          position: relative;

          width: 58px;
          height: 58px;

          border: 1px solid rgba(150, 205, 245, 0.35);
          border-radius: 50%;

          box-shadow:
            0 0 25px rgba(80, 160, 230, 0.12),
            inset 0 0 18px rgba(80, 160, 230, 0.06);
        }

        .compass-ring::before,
        .compass-ring::after {
          content: "";

          position: absolute;
          background: rgba(150, 205, 245, 0.25);
        }

        .compass-ring::before {
          width: 1px;
          height: 100%;
          left: 50%;
          top: 0;
        }

        .compass-ring::after {
          width: 100%;
          height: 1px;
          left: 0;
          top: 50%;
        }

        .compass-needle {
          position: absolute;

          width: 2px;
          height: 38px;

          left: 50%;
          top: 50%;

          transform-origin: center;
          transform: translate(-50%, -50%) rotate(35deg);

          background: linear-gradient(
            to bottom,
            #c8e5fa 0%,
            #c8e5fa 50%,
            rgba(120, 180, 230, 0.25) 50%
          );

          animation: compass-spin 1.8s ease-in-out infinite;
        }

        .compass-center {
          position: absolute;

          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #d9efff;

          box-shadow: 0 0 12px rgba(140, 205, 250, 0.5);
        }

        .loading-logo {
          margin: 24px 0 0;

          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .loading-text {
          margin: 10px 0 0;

          color: #718ba5;

          font-size: 0.68rem;
          letter-spacing: 0.08em;
        }

        @keyframes compass-spin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          50% {
            transform: translate(-50%, -50%) rotate(180deg);
          }

          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes compass-float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>

      <div className="loading-screen">
        <div className="loading-compass">
          <div className="compass-ring">
            <div className="compass-needle"></div>
          </div>

          <div className="compass-center"></div>
        </div>

        <p className="loading-logo">NORTH</p>
        <p className="loading-text">Finding your direction...</p>
      </div>
    </>
  );
}

export default LoadingScreen;