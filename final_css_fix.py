
# Final rebuild of style.css with ALL styles and ZERO syntax errors.
import os

content = """/* ============================================================
   style.css — SmartQuiz Global Styles
   Aesthetic: Dark luxury / precision instrument
   Fonts: Syne (display) + DM Sans (body)
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ─── Design Tokens ──────────────────────────────────────── */
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

  --shadow-card:    0 4px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03);
  --shadow-glow:    0 0 20px rgba(79,142,247,0.15);
  
  --gradient-glow:  radial-gradient(ellipse 60% 40% at 50% 0%, rgba(79,142,247,0.08) 0%, transparent 70%);
  --nav-bg: rgba(255,255,255,0.85);
}

/* ─── Reset & Base ───────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
button, input, textarea, select { font-family: inherit; color: inherit; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background-color: var(--bg-0);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ─── Layout ─────────────────────────────────────────────── */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ─── Navbar ─────────────────────────────────────────────── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar__logo {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  background: var(--gradient-main);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--gradient-main);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

/* ─── Buttons ────────────────────────────────────────────── */
.btn-primary {
  background: var(--gradient-main);
  color: #fff;
  padding: 0.6rem 1.4rem;
  border-radius: var(--radius-md);
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-bounce);
}

.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(79,142,247,0.3); }

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-bright);
  padding: 0.6rem 1.4rem;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.btn-danger { color: var(--accent-red); }

/* ─── Admin Layout ───────────────────────────────────────── */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-0);
}

.admin-sidebar {
  width: 260px;
  background: var(--bg-2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 2000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-logo {
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
}

.nav-item:hover, .nav-item.active {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--surface);
  color: var(--accent-blue);
  border-left: 3px solid var(--accent-blue);
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 1001;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* ─── Admin Components ───────────────────────────────────── */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent-blue);
}

.admin-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.admin-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: var(--transition);
}

.admin-card:hover {
  border-color: var(--accent-blue);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* ─── User Components ────────────────────────────────────── */
.domains-hero-wrapper {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin: 1.5rem 0 3rem;
  border: 1px solid var(--border);
  background: var(--bg-2);
}

.domains-hero-bg {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.5;
  z-index: 0;
}

.domains-hero-content {
  position: relative;
  z-index: 1;
  padding: 4rem 2.5rem;
  text-align: center;
}

.domains-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}

.domain-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: var(--transition-bounce);
  text-align: center;
}

.domain-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent-blue);
  box-shadow: 0 12px 40px rgba(79,142,247,0.2);
}

.domain-icon { font-size: 2.5rem; }

/* ─── Quiz & Results ─────────────────────────────────────── */
.question-box {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin-bottom: 2rem;
}

.option-btn {
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: var(--transition);
}

.option-btn:hover { border-color: var(--accent-blue); background: var(--surface-hover); }
.option-btn.selected { border-color: var(--accent-blue); background: rgba(79,142,247,0.1); }

.result-card {
  text-align: center;
  padding: 3rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
}

/* ─── Profile & Leaderboard ──────────────────────────────── */
.domains-layout { display: flex; gap: 2rem; align-items: flex-start; }
.domains-main { flex: 1; }
.leaderboard-sidebar {
  width: 320px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  position: sticky;
  top: 84px;
}

.profile-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2rem;
}

/* ─── Animations ─────────────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 1024px) {
  .admin-sidebar { transform: translateX(-100%); width: 280px; }
  .admin-sidebar.open { transform: translateX(0); }
  .admin-main { margin-left: 0 !important; }
  .hamburger-menu { display: flex !important; }
  .domains-layout { flex-direction: column; }
  .leaderboard-sidebar { width: 100%; position: static; }
}

@media (max-width: 640px) {
  .domains-grid { grid-template-columns: 1fr 1fr; }
  .admin-topbar h1 { font-size: 1.2rem; }
}
"""

with open('d:\\smart quiz PBL 4\\style.css', 'w', encoding='utf-8') as f:
    f.write(content)
