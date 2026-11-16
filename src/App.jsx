
import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import genesCsvUrl from "../data/raw/OSD13_unique_gene_summary.csv?url";
import methylationCsvUrl from "../data/raw/OSD140_timepoint_summary.csv?url";
import volcanoPlot from "../data/raw/OSD13_volcano_plot.png?url";
import geneHeatmap from "../data/raw/OSD13_gene_heatmap.png?url";
import topGenesPlot from "../data/raw/OSD13_top15_genes.png?url";
import methylationPlot from "../data/raw/OSD140_methylation_distribution.png?url";
import correlationPlot from "../data/raw/OSD140_sample_correlation.png?url";
import timepointPlot from "../data/raw/OSD140_timepoint_trend.png?url";
import {
  Activity,
  Atom,
  ArrowRight,
  ArrowUpRight,
  Bone,
  ChevronRight,
  Database,
  Dna,
  HeartPulse,
  Home,
  LayoutDashboard,
  Menu,
  Microscope,
  Search,
  Shield,
  Telescope,
  X,
  Satellite,
  Sparkles,
  Orbit,
  FlaskConical,
  ExternalLink,
  Filter,
} from "lucide-react";

import "./App.css";

const studies = [
  {
    id: "OSD-13",
    title: "T-Cell Response to Microgravity",
    description:
      "Investigates changes in human T-cell gene expression under microgravity compared with a 1G centrifuge control.",
    category: "Immune",
    organism: "Human",
    assay: "Gene expression",
    mission: "ISS experiment",
    source: "NASA OSDR",
    url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-13",
    icon: Shield,
  },
  {
    id: "OSD-140",
    title: "DNA Methylation During Mars Isolation",
    description:
      "Examines DNA methylation patterns in blood samples from six crew members during a 520-day ground-based Mars mission simulation.",
    category: "Immune",
    organism: "Human",
    assay: "DNA methylation",
    mission: "Mars 520 simulation",
    source: "NASA OSDR",
    url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-140",
    icon: Dna,
  },
];

const categories = [
  {
    name: "Muscle",
    description: "Explore muscle biology and changes associated with spaceflight.",
    icon: Activity,
    color: "blue",
    details:
      "Spaceflight research investigates how altered gravity environments relate to skeletal muscle biology and gene expression.",
  },
  {
    name: "Bone",
    description: "Explore bone biology and skeletal health research.",
    icon: Bone,
    color: "orange",
    details:
      "Bone biology research examines how the space environment may affect bone-related biological processes.",
  },
  {
    name: "Immune",
    description: "Explore immune responses and cellular activity.",
    icon: Shield,
    color: "purple",
    details:
      "Immune system research explores cellular responses, immune regulation and biological changes associated with spaceflight.",
  },
  {
    name: "Cardiovascular",
    description: "Explore cardiovascular biology and related research.",
    icon: HeartPulse,
    color: "pink",
    details:
      "Cardiovascular research investigates biological processes associated with the heart and circulatory system in spaceflight.",
  },
];

const navigation = [
  { label: "Home", page: "Home", icon: Home },
  { label: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  { label: "Study Explorer", page: "Study Explorer", icon: Microscope },
];

const categoryIcons = {
  Muscle: Activity,
  Bone: Bone,
  Immune: Shield,
  Cardiovascular: HeartPulse,
};

function SolarSystemScene() {
  return (
    <div className="solar-system-scene">
      <div className="solar-scene-stars" />
      <div className="solar-nebula" />

      <div className="solar-glow" />
      <div className="solar-sun">
        <div className="sun-core" />
      </div>

      <div className="solar-orbit orbit-mercury">
        <span className="orbit-planet mercury" />
      </div>

      <div className="solar-orbit orbit-venus">
        <span className="orbit-planet venus" />
      </div>

      <div className="solar-orbit orbit-earth">
        <span className="orbit-planet earth">
          <span className="earth-land" />
        </span>
      </div>

      <div className="solar-orbit orbit-mars">
        <span className="orbit-planet mars" />
      </div>

      <div className="solar-orbit orbit-jupiter">
        <span className="orbit-planet jupiter" />
      </div>

      <div className="solar-orbit orbit-saturn">
        <span className="orbit-planet saturn">
          <span className="saturn-ring" />
        </span>
      </div>

      <div className="solar-system-caption">
        <span className="caption-dot" />
        SOLAR SYSTEM · ORBITAL VISUALIZATION
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

function StudyCard({ study }) {
  const Icon = study.icon || Microscope;

  return (
    <article className="study-card">
      <div className="study-card-top">
        <div className="study-icon">
          <Icon size={21} />
        </div>
        <span className="study-id">{study.id}</span>
      </div>

      <h3>{study.title}</h3>
      <p className="study-description">{study.description}</p>

      <div className="study-tags">
        <span>{study.category}</span>
        <span>{study.organism}</span>
        <span>{study.assay}</span>
      </div>

      <div className="study-card-footer">
        <span className="study-source">
          <Database size={14} />
          {study.source}
        </span>

        <a href={study.url} target="_blank" rel="noreferrer" aria-label={`Open ${study.id} on NASA OSDR`}>
          <ArrowUpRight size={18} />
        </a>
      </div>
    </article>
  );
}

function App() {
  const [nasaData, setNasaData] = useState({
    genes: [],
    methylation: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadNasaData() {
      try {
        const [geneResponse, methylationResponse] = await Promise.all([
          fetch(genesCsvUrl),
          fetch(methylationCsvUrl),
        ]);

        if (!geneResponse.ok || !methylationResponse.ok) {
          throw new Error("Could not load the NASA analysis CSV files.");
        }

        const [geneText, methylationText] = await Promise.all([
          geneResponse.text(),
          methylationResponse.text(),
        ]);

        const genes = Papa.parse(geneText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;

        const methylation = Papa.parse(methylationText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;

        setNasaData({ genes, methylation, loading: false, error: null });
      } catch (error) {
        setNasaData({
          genes: [],
          methylation: [],
          loading: false,
          error: error.message || "An unknown error occurred while loading the data.",
        });
      }
    }

    loadNasaData();
  }, []);

  const [activePage, setActivePage] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [geneSearch, setGeneSearch] = useState("");
  const [pValueCutoff, setPValueCutoff] = useState("0.05");
  const [geneSort, setGeneSort] = useState("significance");
  const [selectedMethylationDay, setSelectedMethylationDay] = useState("all");

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        study.title.toLowerCase().includes(search) ||
        study.id.toLowerCase().includes(search) ||
        study.description.toLowerCase().includes(search) ||
        study.category.toLowerCase().includes(search) ||
        study.organism.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        study.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const filteredGenes = useMemo(() => {
    const logFCColumn =
      "Log2fc_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)";
    const adjPColumn =
      "Adj.p.value_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)";

    return nasaData.genes
      .filter((gene) => {
        const search = geneSearch.trim().toLowerCase();
        const matchesSearch =
          String(gene.SYMBOL || "").toLowerCase().includes(search) ||
          String(gene.GENENAME || "").toLowerCase().includes(search);
        const adjP = Number(gene[adjPColumn]);
        return matchesSearch && Number.isFinite(adjP) && adjP <= Number(pValueCutoff);
      })
      .sort((a, b) => {
        if (geneSort === "fold-change") {
          return Math.abs(Number(b[logFCColumn])) - Math.abs(Number(a[logFCColumn]));
        }
        return Number(a[adjPColumn]) - Number(b[adjPColumn]);
      });
  }, [nasaData.genes, geneSearch, pValueCutoff, geneSort]);

  const methylationTimepoints = useMemo(() => {
    return nasaData.methylation
      .filter(
        (point) =>
          point.Day !== undefined &&
          Number.isFinite(Number(point.Mean_Beta))
      )
      .sort((a, b) => Number(a.Day) - Number(b.Day));
  }, [nasaData.methylation]);

  const selectedMethylationPoint = useMemo(() => {
    if (selectedMethylationDay === "all") return null;

    return methylationTimepoints.find(
      (point) => String(point.Day) === selectedMethylationDay
    ) || null;
  }, [methylationTimepoints, selectedMethylationDay]);

  const baselineMethylation = methylationTimepoints.find(
    (point) => Number(point.Day) === -7
  );

  const methylationChange =
    selectedMethylationPoint && baselineMethylation
      ? Number(selectedMethylationPoint.Mean_Beta) -
        Number(baselineMethylation.Mean_Beta)
      : null;

  function navigate(page) {
    setActivePage(page);
    setMobileOpen(false);
    setSearchTerm("");
    setSelectedCategory("All");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderSidebar() {
    return (
      <>
        <div
          className={`mobile-overlay ${mobileOpen ? "show" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
          <div className="brand">
            <div className="brand-logo">
              <Orbit size={24} />
            </div>
            <div className="brand-text">
              <h2>SPACE<span>BIO</span></h2>
              <p>RESEARCH PLATFORM</p>
            </div>
            <button
              className="mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          <div className="sidebar-label">WORKSPACE</div>

          <nav className="sidebar-nav">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.page}
                  className={`nav-item ${activePage === item.page ? "active" : ""}`}
                  onClick={() => navigate(item.page)}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                  {activePage === item.page && (
                    <span className="active-indicator" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-label category-label">
            BIOLOGICAL SYSTEMS
          </div>

          <nav className="sidebar-nav">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.name}
                  className={`nav-item ${
                    activePage === category.name ? "active" : ""
                  }`}
                  onClick={() => navigate(category.name)}
                >
                  <Icon size={19} />
                  <span>{category.name}</span>
                  {activePage === category.name && (
                    <span className="active-indicator" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-status">
              <span className="status-indicator" />
              <div>
                <strong>Research workspace</strong>
                <small>NASA OSDR data reference</small>
              </div>
            </div>

            <div className="sidebar-version">SPACEBIO · 2026</div>
          </div>
        </aside>
      </>
    );
  }

  function renderTopbar() {
    return (
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="menu-button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{activePage}</strong>
          </div>
        </div>

        <div className="topbar-right">
          <div className="live-indicator">
            <span />
            SPACE RESEARCH
          </div>

          <div className="topbar-avatar">
            <Telescope size={18} />
          </div>
        </div>
      </header>
    );
  }

  function renderHome() {
    return (
      <div className="page-content home-page">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              EXPLORING LIFE BEYOND EARTH
            </div>

            <h1>
              Understanding
              <span> Biology in Space.</span>
            </h1>

            <p className="hero-description">
              Explore how spaceflight influences biological systems through
              scientific research and NASA GeneLab datasets.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => navigate("Dashboard")}
              >
                Explore Dashboard
                <ArrowRight size={17} />
              </button>

              <button
                className="secondary-button"
                onClick={() => navigate("Study Explorer")}
              >
                Explore Studies
                <Microscope size={17} />
              </button>
            </div>

            <div className="hero-bottom-note">
              <span className="hero-note-line" />
              DATA-DRIVEN SPACE BIOLOGY RESEARCH
            </div>
          </div>

          <div className="hero-visual">
            <SolarSystemScene />
          </div>

          <div className="hero-decoration">01 / ORBITAL RESEARCH</div>
        </section>

        <section className="overview-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">DISCOVER THE RESEARCH</span>
              <h2>Explore Biological Systems</h2>
              <p>
                Discover different areas of biology studied in the spaceflight
                research domain.
              </p>
            </div>
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  className="category-card"
                  key={category.name}
                  onClick={() => navigate(category.name)}
                >
                  <div className={`category-icon ${category.color}`}>
                    <Icon size={23} />
                  </div>

                  <h3>{category.name}</h3>
                  <p>{category.description}</p>

                  <span className="category-link">
                    Explore system <ArrowUpRight size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="research-intro">
          <div className="research-intro-icon">
            <Atom size={25} />
          </div>

          <div>
            <span className="eyebrow">ABOUT THE PLATFORM</span>
            <h2>Connecting Spaceflight and Biology</h2>
            <p>
              Space Biology Dashboard is a research-oriented interface
              designed to explore biological studies, organize research
              information and make space biology datasets easier to discover.
            </p>
          </div>
        </section>

        <section className="featured-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">RESEARCH HIGHLIGHTS</span>
              <h2>Featured Studies</h2>
              <p>Explore selected studies from NASA's OSDR repository.</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("Study Explorer")}
            >
              View all studies <ArrowRight size={16} />
            </button>
          </div>

          <div className="study-grid">
            {studies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        </section>

        <footer className="page-footer">
          <span>SPACEBIO · NASA SPACE BIOLOGY DASHBOARD</span>
          <span>Explore. Analyze. Discover.</span>
        </footer>
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div className="page-content">
        <SectionHeading
          eyebrow="RESEARCH OVERVIEW"
          title="Space Biology Dashboard"
          description="Explore gene-expression and DNA-methylation findings from two NASA OSDR studies."
        />

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Microscope size={22} />
            </div>
            <div>
              <span>Studies Analysed</span>
              <h2>02</h2>
              <small>OSD-13 and OSD-140</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Activity size={22} />
            </div>
            <div>
              <span>Significant Probesets</span>
              <h2>51</h2>
              <small>OSD-13 · adjusted p-value below 0.05</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Dna size={22} />
            </div>
            <div>
              <span>Unique Annotated Genes</span>
              <h2>32</h2>
              <small>OSD-13 · representative probesets</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Database size={22} />
            </div>
            <div>
              <span>CpG Sites per Sample</span>
              <h2>485,512</h2>
              <small>OSD-140 · 36 samples analysed</small>
            </div>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">DATA VISUALIZATION</span>
              <h2>Research Visualizations</h2>
              <p>Visual results generated from your OSD-13 and OSD-140 analysis files.</p>
            </div>
          </div>

          <div className="study-grid">
            <article className="study-card">
              <h3>OSD-13: Volcano Plot</h3>
              <p className="study-description">Differential gene-expression results.</p>
              <img src={volcanoPlot} alt="OSD-13 volcano plot" style={{ width: "100%", height: "auto", display: "block", marginTop: 16, borderRadius: 10, background: "#fff" }} />
            </article>
            <article className="study-card">
              <h3>OSD-13: Gene Heatmap</h3>
              <p className="study-description">Expression patterns across samples.</p>
              <img src={geneHeatmap} alt="OSD-13 gene heatmap" style={{ width: "100%", height: "auto", display: "block", marginTop: 16, borderRadius: 10, background: "#fff" }} />
            </article>
            <article className="study-card">
              <h3>OSD-13: Top 15 Genes</h3>
              <p className="study-description">Top differentially expressed genes.</p>
              <img src={topGenesPlot} alt="OSD-13 top 15 genes chart" style={{ width: "100%", height: "auto", display: "block", marginTop: 16, borderRadius: 10, background: "#fff" }} />
            </article>
            <article className="study-card">
              <h3>OSD-140: Methylation Distribution</h3>
              <p className="study-description">Distribution of DNA methylation beta values.</p>
              <img src={methylationPlot} alt="OSD-140 methylation distribution" style={{ width: "100%", height: "auto", display: "block", marginTop: 16, borderRadius: 10, background: "#fff" }} />
            </article>
            <article className="study-card">
              <h3>OSD-140: Sample Correlation</h3>
              <p className="study-description">Correlation between study samples.</p>
              <img src={correlationPlot} alt="OSD-140 sample correlation heatmap" style={{ width: "100%", height: "auto", display: "block", marginTop: 16, borderRadius: 10, background: "#fff" }} />
            </article>
            <article className="study-card">
              <h3>OSD-140: Timepoint Trend</h3>
              <p className="study-description">Mean methylation across study timepoints.</p>
              <img src={timepointPlot} alt="OSD-140 timepoint trend" style={{ width: "100%", height: "auto", display: "block", marginTop: 16, borderRadius: 10, background: "#fff" }} />
            </article>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">LIVE FROM YOUR ANALYSIS FILES</span>
              <h2>Dataset Results</h2>
              <p>Values below are read from your local OSD-13 and OSD-140 CSV analysis outputs.</p>
            </div>
          </div>

          {nasaData.loading ? (
            <p>Loading NASA analysis results...</p>
          ) : nasaData.error ? (
            <p role="alert">{nasaData.error}</p>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue"><Dna size={22} /></div>
                  <div>
                    <span>Gene Records Loaded</span>
                    <h2>{nasaData.genes.length.toLocaleString()}</h2>
                    <small>OSD-13 unique gene summary</small>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple"><Activity size={22} /></div>
                  <div>
                    <span>Timepoints Loaded</span>
                    <h2>{nasaData.methylation.length}</h2>
                    <small>OSD-140 study summary</small>
                  </div>
                </div>
              </div>

              <div className="section-heading-row">
                <div>
                  <span className="eyebrow">OSD-13 · GENE EXPRESSION</span>
                  <h2>Top Annotated Genes</h2>
                  <p>Ranked by adjusted p-value for the 1G activated versus microgravity activated comparison. Positive log2 fold change indicates higher expression in 1G.</p>
                </div>
              </div>

              <div className="study-grid">
                {nasaData.genes
                  .filter((gene) => gene.SYMBOL && Number.isFinite(Number(gene["Adj.p.value_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)"])))
                  .sort((a, b) => Number(a["Adj.p.value_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)"]) - Number(b["Adj.p.value_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)"]))
                  .slice(0, 8)
                  .map((gene) => (
                    <article className="study-card" key={gene.SYMBOL}>
                      <div className="study-card-top">
                        <div className="study-icon"><Dna size={20} /></div>
                        <span className="study-id">OSD-13</span>
                      </div>
                      <h3>{gene.SYMBOL}</h3>
                      <p className="study-description">{gene.GENENAME}</p>
                      <div className="study-tags">
                        <span>Log2FC: {Number(gene["Log2fc_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)"]).toFixed(3)}</span>
                        <span>Adj. p: {Number(gene["Adj.p.value_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)"]).toExponential(2)}</span>
                      </div>
                    </article>
                  ))}
              </div>

              <div className="section-heading-row">
                <div>
                  <span className="eyebrow">OSD-140 · DNA METHYLATION</span>
                  <h2>Mean Methylation by Timepoint</h2>
                  <p>Mean beta values from the processed study timepoint summary. This dataset is a ground-based Mars isolation simulation, not an actual spaceflight experiment.</p>
                </div>
              </div>

              <div className="study-grid">
                {nasaData.methylation
                  .filter((point) => point.Day !== undefined && point.Mean_Beta !== undefined)
                  .sort((a, b) => Number(a.Day) - Number(b.Day))
                  .map((point) => (
                    <article className="study-card" key={point.Day}>
                      <div className="study-card-top">
                        <div className="study-icon"><Activity size={20} /></div>
                        <span className="study-id">OSD-140</span>
                      </div>
                      <h3>Day {point.Day}</h3>
                      <p className="study-description">Mean beta: {Number(point.Mean_Beta).toFixed(6)}</p>
                      <div className="study-tags">
                        <span>SD: {Number(point.Std_Beta).toFixed(6)}</span>
                      </div>
                    </article>
                  ))}
              </div>
            </>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">INTERACTIVE ANALYSIS</span>
              <h2>Gene Explorer</h2>
              <p>Search, filter and compare annotated OSD-13 genes using the activated 1G versus microgravity comparison.</p>
            </div>
          </div>

          {nasaData.loading ? (
            <p>Loading gene records...</p>
          ) : nasaData.error ? (
            <p role="alert">{nasaData.error}</p>
          ) : (
            <>
              <div className="explorer-toolbar">
                <div className="search-box">
                  <Search size={19} />
                  <input
                    type="text"
                    placeholder="Search gene symbol or name..."
                    value={geneSearch}
                    onChange={(event) => setGeneSearch(event.target.value)}
                  />
                  {geneSearch && (
                    <button className="clear-search" onClick={() => setGeneSearch("")} aria-label="Clear gene search">
                      <X size={17} />
                    </button>
                  )}
                </div>

                <div className="filter-box">
                  <Filter size={17} />
                  <select value={pValueCutoff} onChange={(event) => setPValueCutoff(event.target.value)}>
                    <option value="0.05">Adjusted p-value ≤ 0.05</option>
                    <option value="0.01">Adjusted p-value ≤ 0.01</option>
                    <option value="0.001">Adjusted p-value ≤ 0.001</option>
                  </select>
                </div>

                <div className="filter-box">
                  <select value={geneSort} onChange={(event) => setGeneSort(event.target.value)}>
                    <option value="significance">Most significant first</option>
                    <option value="fold-change">Largest absolute fold change</option>
                  </select>
                </div>
              </div>

              <div className="results-info">
                <span>Showing <strong>{filteredGenes.length}</strong> genes</span>
                <span className="repository-label">OSD-13 · Gene expression</span>
              </div>

              {filteredGenes.length > 0 ? (
                <div className="study-grid">
                  {filteredGenes.map((gene, index) => {
                    const logFC = Number(gene["Log2fc_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)"]);
                    const adjP = Number(gene["Adj.p.value_(Space Flight & 1G by centrifugation & Activated)v(Space Flight & uG & Activated)"]);
                    return (
                      <article className="study-card" key={`${gene.SYMBOL}-${index}`}>
                        <div className="study-card-top">
                          <div className="study-icon"><Dna size={20} /></div>
                          <span className="study-id">OSD-13</span>
                        </div>
                        <h3>{gene.SYMBOL}</h3>
                        <p className="study-description">{gene.GENENAME}</p>
                        <div className="study-tags">
                          <span>Log2FC: {Number.isFinite(logFC) ? logFC.toFixed(3) : "N/A"}</span>
                          <span>Adj. p: {Number.isFinite(adjP) ? adjP.toExponential(2) : "N/A"}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon"><Search size={25} /></div>
                  <h3>No matching genes found</h3>
                  <p>Try another gene name or choose a less restrictive adjusted p-value threshold.</p>
                  <button className="primary-button" onClick={() => { setGeneSearch(""); setPValueCutoff("0.05"); setGeneSort("significance"); }}>
                    Reset gene filters
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">INTERACTIVE ANALYSIS</span>
              <h2>Methylation Explorer</h2>
              <p>
                Explore mean DNA methylation beta values across the six timepoints
                of the OSD-140 ground-based Mars isolation simulation.
              </p>
            </div>
          </div>

          {nasaData.loading ? (
            <p>Loading methylation records...</p>
          ) : nasaData.error ? (
            <p role="alert">{nasaData.error}</p>
          ) : methylationTimepoints.length === 0 ? (
            <div className="empty-state">
              <h3>No methylation timepoint data available</h3>
              <p>Check that the OSD-140 timepoint summary CSV is loading correctly.</p>
            </div>
          ) : (
            <>
              <div className="explorer-toolbar">
                <div className="filter-box">
                  <Filter size={17} />
                  <select
                    aria-label="Select methylation timepoint"
                    value={selectedMethylationDay}
                    onChange={(event) => setSelectedMethylationDay(event.target.value)}
                  >
                    <option value="all">All timepoints</option>
                    {methylationTimepoints.map((point) => (
                      <option key={point.Day} value={String(point.Day)}>
                        Day {point.Day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedMethylationPoint ? (
                <>
                  <div className="study-grid">
                    <article className="study-card">
                      <div className="study-card-top">
                        <div className="study-icon"><Dna size={20} /></div>
                        <span className="study-id">OSD-140</span>
                      </div>
                      <span className="eyebrow">SELECTED TIMEPOINT</span>
                      <h3>Day {selectedMethylationPoint.Day}</h3>
                      <p className="study-description">Mean beta value</p>
                      <h2>{Number(selectedMethylationPoint.Mean_Beta).toFixed(6)}</h2>
                      <div className="study-tags">
                        <span>
                          SD: {Number.isFinite(Number(selectedMethylationPoint.Std_Beta))
                            ? Number(selectedMethylationPoint.Std_Beta).toFixed(6)
                            : "N/A"}
                        </span>
                      </div>
                    </article>

                    <article className="study-card">
                      <div className="study-card-top">
                        <div className="study-icon"><Activity size={20} /></div>
                        <span className="study-id">BASELINE COMPARISON</span>
                      </div>
                      <span className="eyebrow">CHANGE FROM DAY -7</span>
                      <h3>
                        {methylationChange === null
                          ? "Baseline unavailable"
                          : `${methylationChange > 0 ? "+" : ""}${methylationChange.toFixed(6)}`}
                      </h3>
                      <p className="study-description">
                        Difference in mean beta value compared with the Day -7 baseline.
                      </p>
                    </article>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() => setSelectedMethylationDay("all")}
                  >
                    View all timepoints <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <div className="study-grid">
                  {methylationTimepoints.map((point) => (
                    <article className="study-card" key={point.Day}>
                      <div className="study-card-top">
                        <div className="study-icon"><Dna size={20} /></div>
                        <span className="study-id">OSD-140</span>
                      </div>
                      <h3>Day {point.Day}</h3>
                      <p className="study-description">
                        Mean beta: {Number(point.Mean_Beta).toFixed(6)}
                      </p>
                      <div className="study-tags">
                        <span>
                          SD: {Number.isFinite(Number(point.Std_Beta))
                            ? Number(point.Std_Beta).toFixed(6)
                            : "N/A"}
                        </span>
                      </div>
                      <button
                        className="primary-button"
                        onClick={() => setSelectedMethylationDay(String(point.Day))}
                      >
                        Explore timepoint <ArrowRight size={16} />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">DATA SCIENCE FINDINGS</span>
              <h2>Analysis Snapshot</h2>
              <p>Initial findings from the two independently analysed NASA datasets.</p>
            </div>
          </div>

          <div className="study-grid">
            <article className="study-card">
              <div className="study-card-top">
                <div className="study-icon"><Shield size={21} /></div>
                <span className="study-id">OSD-13</span>
              </div>
              <h3>T-cell gene expression</h3>
              <p className="study-description">
                The microgravity versus 1G activated-cell comparison identified 51 significant probeset records and 32 unique annotated gene symbols.
              </p>
              <div className="study-tags">
                <span>Microgravity</span>
                <span>1G control</span>
                <span>Microarray</span>
              </div>
              <p className="study-description">
                Examples among the most significant annotated genes include NR4A3, NFKBID, EGR3, NR4A2 and NR4A1.
              </p>
            </article>

            <article className="study-card">
              <div className="study-card-top">
                <div className="study-icon"><Dna size={21} /></div>
                <span className="study-id">OSD-140</span>
              </div>
              <h3>DNA methylation over isolation</h3>
              <p className="study-description">
                The dataset contains 36 blood samples from six crew members across six timepoints, with 485,512 CpG sites per sample.
              </p>
              <div className="study-tags">
                <span>36 samples</span>
                <span>6 crew</span>
                <span>450K array</span>
              </div>
              <p className="study-description">
                For crew member 5, mean beta value changed from 0.50475 at Day -7 to 0.50988 at Day 60. This is an exploratory two-sample comparison, not a significance result.
              </p>
            </article>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">BIOLOGICAL RESEARCH</span>
              <h2>Research Areas</h2>
              <p>Select a biological system to explore its research context.</p>
            </div>
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  className="category-card"
                  key={category.name}
                  onClick={() => navigate(category.name)}
                >
                  <div className={`category-icon ${category.color}`}>
                    <Icon size={23} />
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-link">
                    View research <ArrowUpRight size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">SELECTED DATA</span>
              <h2>Featured Research Studies</h2>
              <p>Selected records from the NASA OSDR repository.</p>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("Study Explorer")}
            >
              Open Study Explorer <ArrowRight size={16} />
            </button>
          </div>

          <div className="study-grid">
            {studies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        </section>

        <section className="data-source-panel">
          <div className="data-source-icon">
            <Database size={24} />
          </div>
          <div>
            <span className="eyebrow">DATA SOURCE</span>
            <h3>NASA Open Science Data Repository</h3>
            <p>
              Visit the NASA OSDR repository to explore space biology
              experiments and research datasets.
            </p>
            <a
              href="https://osdr.nasa.gov/"
              target="_blank"
              rel="noreferrer"
            >
              Visit NASA OSDR <ExternalLink size={14} />
            </a>
          </div>
        </section>

        <footer className="page-footer">
          <span>SPACEBIO · RESEARCH DASHBOARD</span>
          <span>Processed project results · Not a live NASA API feed</span>
        </footer>
      </div>
    );
  }

  function renderStudyExplorer() {
    return (
      <div className="page-content">
        <SectionHeading
          eyebrow="RESEARCH LIBRARY"
          title="Study Explorer"
          description="Search and explore selected NASA space biology research records."
        />

        <div className="explorer-toolbar">
          <div className="search-box">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search by study ID, title, category or organism..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="filter-box">
            <Filter size={17} />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-info">
          <span>
            Showing <strong>{filteredStudies.length}</strong> selected studies
          </span>
          <span className="repository-label">
            <Database size={14} /> NASA OSDR references
          </span>
        </div>

        {filteredStudies.length > 0 ? (
          <div className="study-grid explorer-grid">
            {filteredStudies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={27} />
            </div>
            <h3>No matching studies found</h3>
            <p>Try another keyword or change the selected category.</p>
            <button
              className="primary-button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="data-note">
          <Database size={18} />
          <p>
            <strong>Data note:</strong> These are selected featured records
            for this project. The Study Explorer currently uses a local
            dataset and is not connected to a live NASA OSDR API.
          </p>
        </div>

        <footer className="page-footer">
          <span>SPACEBIO · STUDY EXPLORER</span>
          <span>Research references from NASA OSDR</span>
        </footer>
      </div>
    );
  }

  function renderCategoryPage() {
    const category = categories.find((item) => item.name === activePage);

    if (!category) return null;

    const Icon = category.icon;
    const categoryStudies = studies.filter(
      (study) => study.category === category.name
    );

    return (
      <div className="page-content">
        <div className="category-hero">
          <div className={`category-hero-icon ${category.color}`}>
            <Icon size={30} />
          </div>

          <span className="eyebrow">BIOLOGICAL SYSTEM</span>
          <h1>{category.name} Biology</h1>
          <p>{category.details}</p>

          <button
            className="secondary-button"
            onClick={() => navigate("Study Explorer")}
          >
            Explore all studies <ArrowRight size={16} />
          </button>
        </div>

        <section className="dashboard-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">RESEARCH COLLECTION</span>
              <h2>{category.name} Studies</h2>
              <p>
                Selected research records associated with this biological
                system.
              </p>
            </div>
          </div>

          {categoryStudies.length > 0 ? (
            <div className="study-grid">
              {categoryStudies.map((study) => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
          ) : (
            <div className="empty-state category-empty">
              <div className="empty-state-icon">
                <FlaskConical size={27} />
              </div>
              <h3>No featured studies in this category yet</h3>
              <p>
                This category is included in the dashboard structure.
                Additional research records can be added as the project
                dataset expands.
              </p>
            </div>
          )}
        </section>

        <section className="research-intro">
          <div className="research-intro-icon">
            <Atom size={25} />
          </div>
          <div>
            <span className="eyebrow">RESEARCH CONTEXT</span>
            <h2>Why study {category.name.toLowerCase()} biology?</h2>
            <p>{category.details}</p>
          </div>
        </section>

        <footer className="page-footer">
          <span>SPACEBIO · {category.name.toUpperCase()}</span>
          <span>NASA Space Biology Dashboard</span>
        </footer>
      </div>
    );
  }

  function renderPage() {
    if (activePage === "Home") return renderHome();
    if (activePage === "Dashboard") return renderDashboard();
    if (activePage === "Study Explorer") return renderStudyExplorer();
    return renderCategoryPage();
  }

  return (
    <div className="app-layout">
      <div className="global-space-background" aria-hidden="true" />
      {renderSidebar()}

      <main className="main-content">
        {renderTopbar()}
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
