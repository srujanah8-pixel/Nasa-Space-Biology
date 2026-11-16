
import {
  ArrowRight,
  Microscope,
  Dna,
  Orbit,
  Activity,
  Database,
  ChartNoAxesCombined
} from "lucide-react";

import "./Home.css";

const researchAreas = [
  {
    icon: Activity,
    title: "Muscle Biology",
    description:
      "Explore research into how spaceflight conditions relate to skeletal muscle biology."
  },
  {
    icon: Dna,
    title: "Gene Expression",
    description:
      "Study changes in gene activity using available NASA GeneLab datasets."
  },
  {
    icon: Orbit,
    title: "Space Environment",
    description:
      "Understand how microgravity and other spaceflight conditions are investigated."
  }
];

export default function Home({ onNavigate }) {
  return (
    <div className="home-page">

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">
            <Orbit size={14} />
            EXPLORING LIFE BEYOND EARTH
          </span>

          <h1>
            Understanding Biology
            <br />
            <span>Beyond Earth.</span>
          </h1>

          <p className="hero-description">
            Explore how the space environment may influence
            biological systems through scientific research
            and NASA GeneLab datasets.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => onNavigate("dashboard")}
            >
              Explore Dashboard
              <ArrowRight size={17} />
            </button>

            <button
              className="secondary-button"
              onClick={() => onNavigate("studies")}
            >
              Explore Studies
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="planet">
            <div className="planet-highlight"></div>
          </div>

          <div className="visual-label">
            <Orbit size={15} />
            SPACE BIOLOGY RESEARCH
          </div>
        </div>
      </section>

      <section className="research-intro">
        <div className="section-heading">
          <span className="eyebrow">PROJECT OVERVIEW</span>
          <h2>Life Sciences in Space</h2>
          <p>
            Space biology investigates how living organisms respond
            to the unique conditions of spaceflight. This dashboard
            brings research datasets and visual analysis together
            in one interactive platform.
          </p>
        </div>

        <div className="research-cards">
          {researchAreas.map((area) => {
            const Icon = area.icon;

            return (
              <article className="research-card" key={area.title}>
                <div className="research-icon">
                  <Icon size={23} />
                </div>

                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="research-method">
        <div>
          <span className="eyebrow">OUR APPROACH</span>
          <h2>From Research Data to Insights</h2>
          <p>
            The project aims to organise biological research data,
            compare available sample groups, and communicate
            patterns through interactive visualisations.
          </p>
        </div>

        <div className="method-steps">
          <div className="method-step">
            <Database size={21} />
            <div>
              <strong>01. Data Collection</strong>
              <span>Explore publicly available research datasets.</span>
            </div>
          </div>

          <div className="method-step">
            <Microscope size={21} />
            <div>
              <strong>02. Data Analysis</strong>
              <span>Prepare and compare biological measurements.</span>
            </div>
          </div>

          <div className="method-step">
            <ChartNoAxesCombined size={21} />
            <div>
              <strong>03. Visualisation</strong>
              <span>Present findings through scientific charts.</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>NASA SPACE BIOLOGY DASHBOARD</span>
        <span>Research and educational visualisation project</span>
      </footer>

    </div>
  );
}
