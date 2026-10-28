# Urban Heat Islands: Microclimate Degradation & Passive Engineering Solutions
### Continuous Assessment Task (CA-01) | Course: CHE110 – Environmental Studies
**Lovely Professional University (LPU), Phagwara, Punjab**

---

## 👨‍🎓 Academic Investigator & Submission Details
* **Student Name:** Shaswat Sinha
* **Registration Number:** 12629556
* **Section:** RK2P26AW
* **Course:** CHE110 – Environmental Studies (Continuous Assessment Task CA-01)
* **Institution:** Lovely Professional University, Phagwara, Punjab
* **Framework Alignment:** India Cooling Action Plan (MoEF&CC ICAP 2019), Bureau of Energy Efficiency (BEE ECBC 2017), Government of Telangana Cool Roof Policy (2023–2028).

---

## 🌐 Project Overview & Visual Vibe
An ultra-aesthetic, interactive single-page web application and academic research portal exploring the thermodynamic mechanisms of urban microclimate degradation and passive cool-roof mitigation.

Designed with an aesthetic blending **Apple Environmental Progress Report** minimalist typography with **NASA Earth Observatory** scientific telemetry standards:
* **Dark Mode Theme:** Deep Obsidian (`#080b12`), Slate Navy cards, crisp white typography, thermal infrared amber/crimson accents (`#f59e0b`, `#ef4444`), and emerald eco-green highlights (`#10b981`).
* **Glassmorphic UI:** Smooth backdrop blur, micro-interactions, responsive cross-device layout, and accessible contrast ratios.

---

## ⚡ Core Interactive Modules

### 1. The Concrete Furnace (Hero Telemetry)
* Dynamic animated heat-shimmer headline.
* **Interactive UHI Divergence Slider (+4°C to +10°C):** Real-time differential counter illustrating ambient rural baseline ($34.0^\circ\text{C}$) vs. urban canyon core ($42.8^\circ\text{C}-44.0^\circ\text{C}$).
* 5-minute investigative mini-documentary modal player.

### 2. Interactive Surface Temperature & Albedo Simulator
* Numerical solution of the Stefan-Boltzmann steady-state surface energy equilibrium:
  $$(1 - \alpha) G = \epsilon \sigma (T_s^4 - T_{sky}^4) + h_c (T_s - T_a) + \frac{k}{L} (T_s - T_i) + LE$$
* **Urban Surface Materials Evaluated:**
  * Dark Bitumen / Aged Asphalt ($\alpha = 0.05$, Absorptance: $95\%$, SRI: $0$)
  * Corrugated Asbestos / Tin Sheets ($\alpha = 0.15$, Absorptance: $85\%$, SRI: $14$)
  * Standard Concrete Paver / Slab ($\alpha = 0.25$, Absorptance: $75\%$, SRI: $28$)
  * High-SRI White Elastomeric Cool Roof ($\alpha = 0.85$, SRI: $104$)
  * Vegetated Green Living Roof ($\alpha = 0.30$, Active Evapotranspiration Latent Cooling)
* **60 FPS Canvas Physics Engine:** Real-time solar ray ray-tracing, reflected photons, infrared emission waves, convective dissipation ripples, and indoor conductive heat flux.

### 3. Satellite Radiometry & Thermal Infrared Explorer (Landsat 9 TIRS)
* **Interactive Split Slider:** Comparing True-Color Optical (Landsat 9 RGB 4-3-2) against Thermal Infrared Surface Temperature (TIRS-2 Band 10 calibrated LST Ironbow heatmap).
* **Multi-City Telemetry:** Delhi NCR (Okhla Industrial, Connaught Place, Asola Bhatti Ridge, Yamuna Wetlands, Sangam Vihar) and Ahmedabad Metro.
* **Telemetry HUD:** Real-time cursor coordinate tracking (Latitude, Longitude, LST, NDVI, Albedo).

### 4. Cool-Roof ROI & Carbon Reduction Calculator
* Calibrated under Indian climatic zones: **Composite** (Delhi), **Hot-Dry** (Ahmedabad), **Warm-Humid** (Mumbai/Chennai).
* Multi-typology profiling: Residential, Commercial, and Industrial.
* Dynamic outputs:
  * Annual HVAC electricity reduction (kWh/year).
  * Projected electricity bill savings in INR (₹).
  * Scope-2 greenhouse gas mitigation ($t\text{CO}_2\text{e}$/year using CEA grid emission factor $0.72 \text{ kg CO}_2/\text{kWh}$).
  * Capital payback period in months with visual progress bar.

### 5. Literature Review & Scientific Bibliography Matrix
* APA 7th citations with direct DOI links:
  * Akbari, Pomerantz, & Taha (2001) — *Solar Energy*
  * Santamouris (2014) — *Solar Energy*
  * Voogt & Oke (2003) — *Remote Sensing of Environment*
  * MoEF&CC (2019) — *India Cooling Action Plan (ICAP)*
  * Raman et al. (2014) — *Nature*
  * Bureau of Energy Efficiency (2017) — *ECBC 2017*
  * Gartland (2012) — *Routledge*
  * Government of Telangana (2023) — *MA&UD Department*
* One-click "Copy APA 7th Citation" button with instant toast feedback.

### 6. Statutory Policy Matrix & Executive Summary Report
* Comprehensive statutory benchmark matrix (ECBC 2017, Eco-Niwas Samhita, Telangana Cool Roof Policy, IGBC).
* One-click print-ready Academic Executive Summary sheet generator.

---

## 🛠️ Tech Stack
* **Markup & Semantics:** Semantic HTML5
* **Styling:** Modern Tailwind CSS + Custom CSS Variables + Glassmorphism
* **Physics & Visualization:** HTML5 Canvas (60 FPS Ray-Tracing Physics Engine)
* **Iconography:** Lucide Icons
* **Typography:** Outfit (Headings), Inter (Body), JetBrains Mono (Telemetry/Math)

---

## 💻 Local Quickstart
Open `index.html` directly in any web browser, or serve locally with Python:

```bash
# Clone the repository
git clone git@github.com:shaswat2406/urban-heat-island-portal.git

# Enter project directory
cd urban-heat-island-portal

# Launch local server
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 📜 Academic Declaration & Fair-Dealing
Submitted for academic assessment under Course CHE110 at Lovely Professional University. Third-party radiometric data and reporting citations are utilized under educational fair-dealing exemptions pursuant to Section 52(1)(a) of the Indian Copyright Act, 1957.
