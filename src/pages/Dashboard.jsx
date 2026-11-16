
import {
  Database,
  Microscope,
  Dna,
  Activity,
  Bone,
  Shield,
  HeartPulse,
  ArrowUpRight,
  Orbit
} from "lucide-react";

import "./Dashboard.css";

const statistics = [
  {
    title: "Total Studies",
    value: "—",
    subtitle: "Awaiting dataset connection",
    icon: Microscope
  },
  {
    title: "Biological Systems",
    value: "4",
    subtitle: "Categories in this dashboard",
    icon: Activity
  },
  {
    title: "Total Samples",
    value: "—",
    subtitle: "Awaiting sample metadata",
    icon: Database
  },
  {
    title: "Genes Analysed",
    value: "—",
    subtitle: "Awaiting analysis",
    icon: Dna
  }
];

const biologicalSystems = [
  {
    name: "Muscle",
    description: "Skeletal muscle research and gene expression",
    icon: Activity,
    page: "muscle"
  },
  {
    name: "Bone",
    description: "Bone biology and spaceflight research",
    icon: Bone,
    page: "bone"
  },
  {
    name: "Immune",
    description: "Immune system research and biological responses",
    icon: Shield,
    page: "immune"
  },
  {
    name: "Cardiovascular",
    description: "Cardiovascular biology and spaceflight studies",
    icon: HeartPulse,
    page: "cardiovascular"
  }
];

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard-page">

      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">RESEARCH OVERVIEW</span>
          <h1>Research Dashboard</h1>
          <p>
            An overview of biological research and
            available space biology datasets.
          </p>
        </div>

        <div className="data-status">
          <span className="status-dot"></span>
          Data integration pending
        </div>
      </div>

      {/* Statistics */}
      <section className="statistics-grid">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <span className="stat-indicator">
                  <ArrowUpRight size={16} />
                </span>
              </div>

              <h2>{stat.value}</h2>
              <h3>{stat.title}</h3>
              <p>{stat.subtitle}</p>
            </article>
          );
        })}
      </section>

      {/* Biological systems */}
      <section className="systems-section">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">RESEARCH CATEGORIES</span>
            <h2>Biological Systems</h2>
          </div>

          <span className="section-count">04 categories</span>
        </div>

        <div className="systems-grid">
          {biologicalSystems.map((system) => {
            const Icon = system.icon;

            return (
              <button
                className="system-card"
                key={system.name}
                onClick={() => onNavigate(system.page)}
              >
                <div className="system-card-icon">
                  <Icon size={23} />
                </div>

                <div className="system-card-text">
                  <h3>{system.name}</h3>
                  <p>{system.description}</p>
                </div>

                <ArrowUpRight size={18} className="system-arrow" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Research overview */}
      <section className="overview-panel">
        <div className="overview-heading">
          <div className="overview-icon">
            <Orbit size={22} />
          </div>

          <div>
            <span className="eyebrow">DATA EXPLORATION</span>
            <h2>Research Overview</h2>
          </div>
        </div>

        <p>
          This platform is designed to explore biological
          research conducted in spaceflight conditions using
          publicly available NASA GeneLab datasets.
        </p>

        <div className="overview-details">
          <div>
            <strong>Data source</strong>
            <span>NASA Open Science Data Repository</span>
          </div>

          <div>
            <strong>Research approach</strong>
            <span>Dataset exploration and comparative analysis</span>
          </div>

          <div>
            <strong>Current status</strong>
            <span>Frontend development and data integration</span>
          </div>
        </div>

      </section>

    </div>
  );
}
