
import os

# --- PART 1: ROOT & BASE ---
part1 = """/* ============================================================
   style.css — SmartQuiz Global Styles
   Aesthetic: Dark luxury / precision instrument
   Fonts: Syne (display) + DM Sans (body)
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --bg-0:           #0a0b0d;
  --bg-1:           #111318;
  --bg-2:           #181c24;
  --bg-3:           #1f2430;
  --surface:        #242a38;
  --surface-hover:  #2c3345;
  --border:         #2a3040;
  --border-bright:  #3d4860;

  --text-primary:   #eef0f6;
  --text-secondary: #8b92a8;
  --text-muted:     #4d5569;

  --accent-blue:    #4f8ef7;
  --accent-violet:  #8b5cf6;
  --accent-green:   #34d399;
  --accent-amber:   #fbbf24;
  --accent-red:     #f87171;
  --accent-cyan:    #22d3ee;

  --gradient-main:  linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 100%);
  --gradient-glow:  radial-gradient(ellipse 60% 40% at 50% 0%, rgba(79,142,247,0.15) 0%, transparent 70%);

  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  18px;
  --radius-xl:  24px;

  --shadow-card: 0 4px 24px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3);
  --shadow-glow: 0 0 40px rgba(79,142,247,0.12);

  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;

  --transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  --transition-bounce: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  
  --nav-bg: rgba(10,11,13,0.85);
}

:root[data-theme="light"] {
  --bg-0:           #eef2f6;
  --bg-1:           #e2e8f0;
  --bg-2:           #ffffff;
  --bg-3:           #cbd5e1;
  --surface:        #ffffff;
  --surface-hover:  #f8fafd;
  --border:         #cbd5e1;
  --border-bright:  #94a3b8;
  --text-primary:   #0f172a;
  --text-secondary: #334155;
  --text-muted:     #64748b;
  --nav-bg: rgba(255,255,255,0.85);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-body);
  background-color: var(--bg-0);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

/* Navbar */
.navbar {
  position: sticky; top: 0; z-index: 1000;
  background: var(--nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.navbar__inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.navbar__logo { font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.navbar__right { display: flex; align-items: center; gap: 1rem; }

/* Buttons */
.btn-primary { background: var(--gradient-main); color: #fff; padding: 0.6rem 1.4rem; border-radius: var(--radius-md); border: none; cursor: pointer; font-weight: 600; }
.btn-ghost { background: transparent; color: var(--text-secondary); border: none; cursor: pointer; padding: 0.5rem 1rem; }
.btn-danger { color: var(--accent-red); }

/* Admin Sidebar */
.admin-layout { display: flex; min-height: 100vh; }
.admin-sidebar {
  width: 260px; background: var(--bg-2); border-right: 1px solid var(--border);
  position: fixed; left: 0; top: 0; height: 100vh; z-index: 2000;
  transition: transform 0.3s;
}
.admin-main { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }

/* Admin Cards */
.admin-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; padding: 1rem 0; }
.admin-card {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 1.5rem; transition: var(--transition);
}
.admin-card:hover { border-color: var(--accent-blue); transform: translateY(-2px); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }

/* Domains Hero */
.domains-hero-wrapper {
  position: relative; border-radius: var(--radius-xl); overflow: hidden;
  margin: 1.5rem 0 3rem; border: 1px solid var(--border); background: var(--bg-2);
}
.domains-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; z-index: 0; }
.domains-hero-content { position: relative; z-index: 1; padding: 4rem 2.5rem; text-align: center; }

/* Domain Cards (User Panel) */
.domains-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }
.domain-card {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;
  cursor: pointer; transition: var(--transition-bounce);
}
.domain-card:hover { transform: translateY(-6px); border-color: var(--accent-blue); }

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar { transform: translateX(-100%); width: 280px; }
  .admin-sidebar.open { transform: translateX(0); }
  .admin-main { margin-left: 0; }
  .hamburger-menu { display: flex; }
}
"""

with open('d:\\smart quiz PBL 4\\style.css', 'w', encoding='utf-8') as f:
    f.write(part1)
