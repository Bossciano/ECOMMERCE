import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBanner from "@/assets/heropage.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/shop");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        :root {
          --gold: #D4AF37;
          --gold-light: #F4E4C1;
          --gold-dark: #B8941F;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
          --ivory: #FFFFF0;
          --cream: #FAF9F6;
          --champagne: #F7E7CE;
        }

        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          animation: subtle-zoom 20s ease-in-out infinite alternate;
        }

        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(250, 249, 246, 0.97) 0%,
            rgba(250, 249, 246, 0.92) 40%,
            rgba(250, 249, 246, 0.75) 70%,
            rgba(212, 175, 55, 0.1) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 10;
          animation: fade-slide-up 1s ease-out;
        }

        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          font-family: 'Libre Baskerville', serif;
          font-weight: 700;
          color: var(--charcoal);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          animation: fade-slide-up 1s ease-out 0.2s both;
        }

        .hero-accent {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          position: relative;
          padding-left: 0.5rem;
        }

        .hero-accent::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 80%;
          background: linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%);
          border-radius: 2px;
          animation: grow-line 0.8s ease-out 0.8s both;
        }

        @keyframes grow-line {
          from {
            height: 0%;
            opacity: 0;
          }
          to {
            height: 80%;
            opacity: 1;
          }
        }

        .hero-description {
          font-family: 'Montserrat', sans-serif;
          color: var(--charcoal-light);
          font-size: 1.125rem;
          line-height: 1.8;
          font-weight: 400;
          letter-spacing: 0.01em;
          margin-bottom: 2.5rem;
          animation: fade-slide-up 1s ease-out 0.4s both;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          animation: fade-slide-up 1s ease-out 0.6s both;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          color: var(--ivory);
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(26, 26, 26, 0.25);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .btn-primary:hover::before {
          opacity: 1;
        }

        .btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(26, 26, 26, 0.35);
        }

        .btn-primary span,
        .btn-primary svg {
          position: relative;
          z-index: 1;
        }

        .btn-primary:hover svg {
          animation: arrow-slide 0.6s ease-in-out infinite;
        }

        @keyframes arrow-slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }

        .btn-secondary {
          background: transparent;
          color: var(--charcoal);
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 2px solid var(--gold);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-secondary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .btn-secondary:hover::before {
          opacity: 1;
        }

        .btn-secondary:hover {
          border-color: var(--gold-dark);
          color: var(--charcoal);
          transform: translateY(-4px);
          box-shadow: 0 6px 24px rgba(212, 175, 55, 0.3);
        }

        .btn-secondary span {
          position: relative;
          z-index: 1;
        }

        /* Decorative elements */
        .hero-decoration {
          position: absolute;
          pointer-events: none;
          z-index: 5;
        }

        .decoration-circle-1 {
          top: 10%;
          right: 15%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        .decoration-circle-2 {
          bottom: 15%;
          right: 5%;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247, 231, 206, 0.3) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite 1s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        .sparkle-icon {
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.5; transform: scale(0.8) rotate(180deg); }
        }

        /* Stats section */
        .hero-stats {
          display: flex;
          gap: 3rem;
          margin-top: 3rem;
          animation: fade-slide-up 1s ease-out 0.8s both;
        }

        .stat-item {
          position: relative;
        }

        .stat-number {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.875rem;
          color: var(--charcoal-light);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 100vh;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-stats {
            gap: 2rem;
            flex-wrap: wrap;
          }

          .stat-number {
            font-size: 2rem;
          }

          .decoration-circle-1,
          .decoration-circle-2 {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2rem;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <section className="hero-section">
        {/* Background Image */}
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />

        {/* Overlay */}
        <div className="hero-overlay" />

        {/* Decorative Elements */}
        <div className="hero-decoration decoration-circle-1" />
        <div className="hero-decoration decoration-circle-2" />

        {/* Content */}
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="hero-content max-w-3xl">
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl">
              Discover Timeless
              <span className="hero-accent">Elegance & Luxury</span>
            </h1>

            <p className="hero-description max-w-xl">
              Immerse yourself in a curated collection of exceptional pieces. 
              Where craftsmanship meets sophistication, and every detail tells a story of refinement.
            </p>

            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={handleShopNow}
              >
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/collection")}
              >
                <Sparkles className="h-5 w-5 sparkle-icon" strokeWidth={2} />
                <span>Explore Collection</span>
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Premium Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
