
import React, { useState } from "react";
import {
  Search,
  ExternalLink,
  Microscope,
  Filter,
  Dna,
  FlaskConical
} from "lucide-react";

import "./study-explorer.css";

function StudyExplorer() {
  const studies = [
    {
      id: "OSD-13",
      title: "T-cell research in spaceflight",
      organism: "Human",
      category: "Immune",
      description:
        "Research investigating changes in immune cell function during spaceflight.",
      url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-13",
    },
    {
      id: "OSD-140",
      title: "Epigenetic patterns in blood cells",
      organism: "Human",
      category: "Immune",
      description:
        "Research examining epigenetic patterns in blood cells.",
      url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-140",
    },
    {
      id: "OSD-481",
      title: "Spaceflight and muscle biology",
      organism: "Mouse",
      category: "Muscle",
      description:
        "Study of biological changes associated with spaceflight.",
      url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-481",
    },
  ];

  const [search, setSearch] = useState("");
  const [organism, setOrganism] = useState("All");
  const [category, setCategory] = useState("All");

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.id.toLowerCase().includes(search.toLowerCase()) ||
      study.title.toLowerCase().includes(search.toLowerCase());

    const matchesOrganism =
      organism === "All" || study.organism === organism;

    const matchesCategory =
      category === "All" || study.category === category;

    return matchesSearch && matchesOrganism && matchesCategory;
  });

  return (
    <div className="page-content explorer-page">

      <p className="eyebrow">NASA OPEN SCIENCE DATA</p>

      <div className="explorer-heading">
        <div>
          <h1>Study Explorer</h1>
          <p>
            Explore biological research and spaceflight studies
            from NASA GeneLab.
          </p>
        </div>

        <div className="explorer-icon">
          <Microscope size={30} />
        </div>
      </div>

      <div className="explorer-stats">

        <div className="explorer-stat-card">
          <Dna size={23} />
          <div>
            <h2>{filteredStudies.length}</h2>
            <p>Displayed Studies</p>
          </div>
        </div>

        <div className="explorer-stat-card">
          <FlaskConical size={23} />
          <div>
            <h2>NASA</h2>
            <p>Research Source</p>
          </div>
        </div>

      </div>

      <div className="explorer-controls">

        <div className="explorer-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search by study ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-control">
          <Filter size={17} />

          <select
            value={organism}
            onChange={(e) => setOrganism(e.target.value)}
          >
            <option value="All">All Organisms</option>
            <option value="Human">Human</option>
            <option value="Mouse">Mouse</option>
          </select>
        </div>

        <div className="filter-control">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Systems</option>
            <option value="Muscle">Muscle</option>
            <option value="Bone">Bone</option>
            <option value="Immune">Immune</option>
            <option value="Cardiovascular">Cardiovascular</option>
          </select>
        </div>

      </div>

      <div className="study-results-heading">
        <h2>Research Studies</h2>
        <span>{filteredStudies.length} results</span>
      </div>

      <div className="study-grid">

        {filteredStudies.length > 0 ? (
          filteredStudies.map((study) => (

            <div className="study-card" key={study.id}>

              <div className="study-card-top">
                <div className="study-card-icon">
                  <Microscope size={22} />
                </div>

                <span className="study-id">{study.id}</span>
              </div>

              <h3>{study.title}</h3>

              <p className="study-description">
                {study.description}
              </p>

              <div className="study-tags">
                <span>{study.organism}</span>
                <span>{study.category}</span>
              </div>

              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                className="study-link"
              >
                View NASA Study
                <ExternalLink size={16} />
              </a>

            </div>

          ))
        ) : (
          <div className="no-studies">
            <Search size={30} />
            <h3>No studies found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        )}

      </div>

    </div>
  );
}

export default StudyExplorer;
