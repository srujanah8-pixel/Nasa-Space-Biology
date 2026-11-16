
import {
  LayoutDashboard,
  Microscope,
  Dna,
  Bone,
  HeartPulse,
  Shield,
  Activity,
  Telescope
} from "lucide-react";

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Home", icon: Telescope, id: "home" },
      { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
      { label: "Study Explorer", icon: Microscope, id: "studies" }
    ]
  },
  {
    title: "BIOLOGICAL SYSTEMS",
    items: [
      { label: "Muscle", icon: Activity, id: "muscle" },
      { label: "Bone", icon: Bone, id: "bone" },
      { label: "Immune", icon: Shield, id: "immune" },
      {
        label: "Cardiovascular",
        icon: HeartPulse,
        id: "cardiovascular"
      }
    ]
  }
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Dna size={25} />
        </div>

        <div>
          <h2>SPACE BIOLOGY</h2>
          <span>RESEARCH PORTAL</span>
        </div>
      </div>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-navigation">
        {navigation.map((section) => (
          <div className="nav-section" key={section.title}>
            <p className="nav-section-title">{section.title}</p>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className={`nav-item ${
                    activePage === item.id ? "active" : ""
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nasa-mark">NASA</div>

        <div>
          <strong>Space Biology</strong>
          <span>Research Dashboard</span>
        </div>
      </div>
    </aside>
  );
}
