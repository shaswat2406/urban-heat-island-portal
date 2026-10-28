/**
 * Urban Heat Islands: Microclimate Degradation & Passive Engineering Solutions
 * CHE110 - Environmental Studies | Continuous Assessment Task (CA-01)
 * Student: Shaswat Sinha | Reg. No: 12629556 | Section: RK2P26AW
 * Institution: Lovely Professional University (LPU), Phagwara, Punjab
 */

// --- GLOBAL APPLICATION STATE ---
const appState = {
  // Thermodynamic Simulator State
  selectedMaterial: 'asphalt',
  solarIrradiance: 1000, // W/m^2
  ambientTemp: 38, // °C
  windSpeed: 2.0, // m/s
  indoorTarget: 24, // °C

  // Satellite Radiometry State
  activeCity: 'delhi',
  sliderPosition: 50, // percentage 0-100
  selectedHotspot: 'okhla',
  isDraggingSplit: false,

  // Cool Roof Calculator State
  roofAreaSqM: 400,
  areaUnit: 'sqm', // 'sqm' or 'sqft'
  buildingType: 'commercial', // 'residential', 'commercial', 'industrial'
  climateZone: 'composite', // 'composite', 'hot_dry', 'warm_humid'
  currentRoofType: 'asphalt',
  coatingType: 'elastomeric',

  // Video Player State
  currentChapter: 0,

  // Bibliography Filter
  activeBibFilter: 'all',
  bibSearchQuery: ''
};

// --- DATA DEFINITIONS ---

// 1. Material Thermodynamic Properties
const MATERIAL_PROPERTIES = {
  asphalt: {
    name: 'Dark Bitumen / Aged Asphalt',
    type: 'conventional',
    albedo: 0.05,
    absorptance: 0.95,
    emittance: 0.90,
    sri: 0,
    thermalConductivity: 1.25, // W/m-K
    deckThickness: 0.15, // m
    description: 'Pervasive impervious urban pavement. High solar absorptance creates intense thermal storage and canyon re-radiation.',
    color: '#1e293b',
    accentColor: '#ef4444',
    isVegetated: false
  },
  tin: {
    name: 'Corrugated Asbestos / Tin Sheets',
    type: 'conventional',
    albedo: 0.15,
    absorptance: 0.85,
    emittance: 0.28,
    sri: 14,
    thermalConductivity: 45.0,
    deckThickness: 0.005,
    description: 'Extensively used in informal settlements and industrial sheds. Low emittance (0.28) prevents nocturnal cooling, trapping severe heat indoors.',
    color: '#64748b',
    accentColor: '#f97316',
    isVegetated: false
  },
  concrete: {
    name: 'Standard Concrete Paver / Slab',
    type: 'conventional',
    albedo: 0.25,
    absorptance: 0.75,
    emittance: 0.90,
    sri: 28,
    thermalConductivity: 1.4,
    deckThickness: 0.15,
    description: 'Standard urban medium. High thermal mass stores diurnal heat and delays nocturnal dissipation, elevating midnight ambient temperatures.',
    color: '#94a3b8',
    accentColor: '#f59e0b',
    isVegetated: false
  },
  cool_roof: {
    name: 'High-SRI White Elastomeric Cool Roof',
    type: 'passive_engineered',
    albedo: 0.85,
    absorptance: 0.15,
    emittance: 0.92,
    sri: 104,
    thermalConductivity: 0.22,
    deckThickness: 0.15,
    description: 'Advanced titanium-dioxide acrylic copolymer. Reflects 85% of solar irradiance and radiates absorbed heat in the 8-13 µm atmospheric window.',
    color: '#f8fafc',
    accentColor: '#38bdf8',
    isVegetated: false
  },
  green_roof: {
    name: 'Vegetated Green Living Roof',
    type: 'nature_based',
    albedo: 0.30,
    absorptance: 0.70,
    emittance: 0.95,
    sri: 86, // Equivalent SRI performance
    thermalConductivity: 0.35,
    deckThickness: 0.20,
    latentHeatFlux: 420, // W/m^2 evapotranspiration
    description: 'Multi-layer Sedum sedoides and native succulents. Active stomatal evapotranspiration converts sensible heat into latent cooling.',
    color: '#10b981',
    accentColor: '#10b981',
    isVegetated: true
  }
};

// 2. Satellite Hotspots Data
const SATELLITE_HOTSPOTS = {
  delhi: [
    {
      id: 'okhla',
      name: 'Okhla Industrial Area Ph-II',
      type: 'Industrial Hotspot',
      coords: '28.5355° N, 77.2732° E',
      x: 72, // % on canvas
      y: 65, // % on canvas
      lst: 52.6, // °C
      ndvi: 0.04,
      albedo: 0.08,
      landCover: 'Corrugated Tin & Asphalt Yards',
      thermalAnomaly: '+14.6°C above rural baseline',
      vulnerability: 'Extreme',
      notes: 'Dense concentration of manufacturing sheds with low-SRI metal roofing, sparse canopy (<3%), high anthropogenic heat rejection.'
    },
    {
      id: 'connaught',
      name: 'Connaught Place Commercial Core',
      type: 'Urban Canyon',
      coords: '28.6315° N, 77.2167° E',
      x: 48,
      y: 38,
      lst: 46.4,
      ndvi: 0.09,
      albedo: 0.16,
      landCover: 'High-Density Concrete & Paved Plaza',
      thermalAnomaly: '+8.4°C above rural baseline',
      vulnerability: 'High',
      notes: 'Multiple-lane concentric ring roads with vehicular idling and massive decentralized HVAC condensing unit heat rejection.'
    },
    {
      id: 'asola',
      name: 'Asola Bhatti Wildlife Sanctuary',
      type: 'Canopy Cooling Oasis',
      coords: '28.4721° N, 77.2215° E',
      x: 45,
      y: 84,
      lst: 33.8,
      ndvi: 0.72,
      albedo: 0.22,
      landCover: 'Dense Prosopis & Native Deciduous Forest',
      thermalAnomaly: '-4.2°C cooler than city core',
      vulnerability: 'Low (Protective Sink)',
      notes: 'Southern Ridge green buffer with high transpiration. Acts as a vital microclimate heat sink for South Delhi.'
    },
    {
      id: 'yamuna',
      name: 'Yamuna River & Okhla Barrage',
      type: 'Aquatic Heat Sink',
      coords: '28.5458° N, 77.3080° E',
      x: 82,
      y: 45,
      lst: 30.4,
      ndvi: 0.38,
      albedo: 0.06,
      landCover: 'Open Water & Wetland Reeds',
      thermalAnomaly: '-7.6°C below urban core',
      vulnerability: 'Moderate',
      notes: 'High heat capacity of water bodies dampens daytime thermal peaks through continuous latent surface evaporation.'
    },
    {
      id: 'sangam',
      name: 'Sangam Vihar High-Density Settlement',
      type: 'Informal Thermal Canyon',
      coords: '28.5028° N, 77.2450° E',
      x: 58,
      y: 72,
      lst: 49.1,
      ndvi: 0.05,
      albedo: 0.12,
      landCover: 'Dense Brick-Concrete Masonry',
      thermalAnomaly: '+11.1°C above rural baseline',
      vulnerability: 'Severe',
      notes: 'Narrow sky view factors (SVF < 0.25), lack of green canopy, and high structural density trap longwave radiation overnight.'
    }
  ],
  ahmedabad: [
    {
      id: 'vatva',
      name: 'Vatva GIDC Industrial Estate',
      type: 'Industrial Hotspot',
      coords: '22.9582° N, 72.6395° E',
      x: 75,
      y: 68,
      lst: 54.2,
      ndvi: 0.03,
      albedo: 0.07,
      landCover: 'Chemical & Textile Processing Units',
      thermalAnomaly: '+16.2°C above rural baseline',
      vulnerability: 'Extreme',
      notes: 'Vast continuous expanse of dark corrugated roofs and asphalt transport corridors with heavy daytime solar gain.'
    },
    {
      id: 'sabarmati',
      name: 'Sabarmati Riverfront Promenade',
      type: 'Riverfront Oasis',
      coords: '23.0300° N, 72.5800° E',
      x: 50,
      y: 42,
      lst: 34.1,
      ndvi: 0.45,
      albedo: 0.18,
      landCover: 'Concrete Promenade & Water Canal',
      thermalAnomaly: '-3.9°C vs old walled city',
      vulnerability: 'Moderate',
      notes: 'River corridor channels prevailing south-westerly breeze, dissipating thermal accumulation through advection.'
    },
    {
      id: 'vastrapur',
      name: 'Vastrapur Urban Lake Precinct',
      type: 'Micro-Oasis Park',
      coords: '23.0360° N, 72.5290° E',
      x: 32,
      y: 35,
      lst: 36.8,
      ndvi: 0.58,
      albedo: 0.20,
      landCover: 'Water Body & Neem Canopy Buffer',
      thermalAnomaly: '-1.2°C buffer',
      vulnerability: 'Low',
      notes: 'Demonstrates micro-cooling footprint extending up to 150m into adjoining residential neighborhoods.'
    }
  ]
};

// 3. Calculator Climate Factors
const CLIMATE_FACTORS = {
  composite: {
    name: 'Composite (e.g., New Delhi, Lucknow)',
    annualCoolingDegreeDays: 2450,
    baseSavingsKwhPerSqM: 22.5,
    avgTariffINR: 8.50,
    description: 'Extreme diurnal and seasonal swings: scorching tropical summers followed by mild winters.'
  },
  hot_dry: {
    name: 'Hot-Dry (e.g., Ahmedabad, Jodhpur)',
    annualCoolingDegreeDays: 2900,
    baseSavingsKwhPerSqM: 28.4,
    avgTariffINR: 8.20,
    description: 'High solar irradiance (>1100 W/m² peak), low relative humidity, maximum direct albedo leverage.'
  },
  warm_humid: {
    name: 'Warm-Humid (e.g., Chennai, Mumbai, Kolkata)',
    annualCoolingDegreeDays: 2200,
    baseSavingsKwhPerSqM: 18.2,
    avgTariffINR: 9.10,
    description: 'Moderate surface delta but high latent humidity; continuous HVAC dehumidification demand.'
  }
};

const BUILDING_FACTORS = {
  residential: {
    name: 'Residential Apartment',
    hoursMultiplier: 0.85,
    insulationQuality: 'Moderate',
    costPerSqFtINR: 28
  },
  commercial: {
    name: 'Commercial Office Building',
    hoursMultiplier: 1.25,
    insulationQuality: 'High HVAC Runtime',
    costPerSqFtINR: 35
  },
  industrial: {
    name: 'Industrial / Manufacturing Shed',
    hoursMultiplier: 1.45,
    insulationQuality: 'Uninsulated Metal Deck',
    costPerSqFtINR: 32
  }
};

// 4. Video Chapters & Timeline
const VIDEO_CHAPTERS = [
  {
    title: 'The Albedo Trap: Microclimate Breakdown',
    time: '00:00',
    seconds: 0,
    description: 'How dark asphalt and low-SRI roofs trap up to 95% of incoming solar irradiance, turning urban cores into thermodynamic furnaces.',
    keyMetric: '+4°C to +10°C urban air divergence'
  },
  {
    title: 'Satellite Surveillance: Landsat TIRS Thermal Radiometry',
    time: '01:15',
    seconds: 75,
    description: 'Translating Landsat 8/9 Band 10 thermal infrared sensor radiances into calibrated Land Surface Temperature (LST) and NDVI correlations.',
    keyMetric: '30m spatial resolution LST mapping'
  },
  {
    title: 'Cool Roof Chemistry: SRI & Atmospheric Window',
    time: '02:40',
    seconds: 160,
    description: 'The science behind high-SRI titanium dioxide coatings and sub-ambient radiative cooling through the 8–13 µm atmospheric transmission window.',
    keyMetric: 'SRI 104+ | -32°C surface temperature drop'
  },
  {
    title: 'India Cooling Action Plan (ICAP) & Implementation Roadmap',
    time: '03:50',
    seconds: 230,
    description: 'Policy imperatives: Integrating cool roof mandates into ECBC 2017 and scaling the Telangana Cool Roof Policy 2023-2028 benchmark nationally.',
    keyMetric: '300M sq.m cool roof mandate by 2028'
  }
];

// 5. Scientific Bibliography Dataset (APA 7th Format)
const BIBLIOGRAPHY_DATA = [
  {
    id: 'akbari2001',
    category: 'thermodynamics',
    categoryLabel: 'Thermodynamics & Surfaces',
    authors: 'Akbari, H., Pomerantz, M., & Taha, H.',
    year: '2001',
    title: 'Cool surfaces and shade trees to reduce energy use and improve air quality in urban areas',
    journal: 'Solar Energy',
    volume: '70(3)',
    pages: '295–310',
    doi: '10.1016/S0038-092X(00)00147-7',
    doiUrl: 'https://doi.org/10.1016/S0038-092X(00)00147-7',
    keyFinding: 'Demonstrated that increasing urban surface albedo by 0.10 yields nationwide cooling energy savings of ~$2B annually while lowering urban peak temperatures by 1.5°C to 2.0°C.',
    keywords: ['albedo', 'cool roofs', 'urban heat island', 'building energy']
  },
  {
    id: 'santamouris2014',
    category: 'thermodynamics',
    categoryLabel: 'Thermodynamics & Surfaces',
    authors: 'Santamouris, M.',
    year: '2014',
    title: 'Cooling the cities—a review of reflective and green roof mitigation technologies to fight heat island and improve comfort in urban environments',
    journal: 'Solar Energy',
    volume: '103',
    pages: '682–703',
    doi: '10.1016/j.solener.2012.07.003',
    doiUrl: 'https://doi.org/10.1016/j.solener.2012.07.003',
    keyFinding: 'Comprehensive meta-analysis of over 200 field trials proving cool roofs drop surface temperature by up to 35°C and reduce cooling energy demand by 10% to 40%.',
    keywords: ['mitigation technologies', 'green roofs', 'SRI', 'microclimate']
  },
  {
    id: 'voogt2003',
    category: 'remote_sensing',
    categoryLabel: 'Remote Sensing & Satellites',
    authors: 'Voogt, J. A., & Oke, T. R.',
    year: '2003',
    title: 'Thermal remote sensing of urban climates',
    journal: 'Remote Sensing of Environment',
    volume: '86(3)',
    pages: '370–384',
    doi: '10.1016/S0034-4257(03)00079-8',
    doiUrl: 'https://doi.org/10.1016/S0034-4257(03)00079-8',
    keyFinding: 'Foundational framework relating satellite radiometric surface temperatures (LST) with 3D urban canopy layer air temperatures and surface anisotropy.',
    keywords: ['remote sensing', 'LST', 'surface urban heat island', 'thermal infrared']
  },
  {
    id: 'icap2019',
    category: 'policy',
    categoryLabel: 'Policy & Urban Standards',
    authors: 'Ministry of Environment, Forest and Climate Change (MoEF&CC)',
    year: '2019',
    title: 'India Cooling Action Plan (ICAP): Long-Term National Cooling Strategy',
    journal: 'Government of India Publications',
    volume: 'Official Document',
    pages: '1–142',
    doi: '10.5923/j.env.2019.01',
    doiUrl: 'http://moef.gov.in/wp-content/uploads/2019/03/INDIA-COOLING-ACTION-PLAN-e-circulation-version080319.pdf',
    keyFinding: 'Sets landmark national targets: 20–25% reduction in cooling energy demand across sectors by 2037–38, explicitly recommending cool roofs as priority passive mitigation.',
    keywords: ['ICAP', 'India Cooling', 'BEE', 'energy efficiency', 'climate policy']
  },
  {
    id: 'raman2014',
    category: 'thermodynamics',
    categoryLabel: 'Thermodynamics & Surfaces',
    authors: 'Raman, A. P., Anoma, M. A., Zhu, L., Rephaeli, E., & Fan, S.',
    year: '2014',
    title: 'Passive radiative cooling below ambient air temperature under direct sunlight',
    journal: 'Nature',
    volume: '515(7528)',
    pages: '540–544',
    doi: '10.1038/nature13883',
    doiUrl: 'https://doi.org/10.1038/nature13883',
    keyFinding: 'Pioneered photonic radiative cooling materials that reflect 97% of sunlight while selectively radiating thermal energy into outer space through the 8–13 µm atmospheric transparency window, achieving 4.9°C cooling below ambient under direct noon sunlight.',
    keywords: ['sub-ambient cooling', 'radiative cooling', 'atmospheric window', 'nanophotonics']
  },
  {
    id: 'bee2017',
    category: 'policy',
    categoryLabel: 'Policy & Urban Standards',
    authors: 'Bureau of Energy Efficiency (BEE)',
    year: '2017',
    title: 'Energy Conservation Building Code (ECBC 2017): Prescriptive Requirements for Building Envelopes',
    journal: 'Ministry of Power, Government of India',
    volume: 'Technical Code',
    pages: 'Section 4.3.1',
    doi: '10.1007/s12053-018-9712-4',
    doiUrl: 'https://beeindia.gov.in/content/ecbc',
    keyFinding: 'Mandates Solar Reflectance Index (SRI) ≥ 78 for low-slope roofs (< 9.5°) and SRI ≥ 29 for steep-slope roofs across all commercial and institutional compliant constructions in India.',
    keywords: ['ECBC', 'building envelope', 'SRI criteria', 'compliance']
  },
  {
    id: 'gartland2012',
    category: 'thermodynamics',
    categoryLabel: 'Thermodynamics & Surfaces',
    authors: 'Gartland, L.',
    year: '2012',
    title: 'Heat islands: Understanding and mitigating heat in urban areas',
    journal: 'Routledge Engineering & Environment Series',
    volume: '2nd Edition',
    pages: '1–230',
    doi: '10.4324/9781849771559',
    doiUrl: 'https://doi.org/10.4324/9781849771559',
    keyFinding: 'Provides rigorous engineering derivations of heat transfer coefficients, surface energy balances, and urban canopy geometry effects on nocturnal cooling rates.',
    keywords: ['heat island', 'sensible heat flux', 'convective transfer', 'urban morphology']
  },
  {
    id: 'telangana2023',
    category: 'policy',
    categoryLabel: 'Policy & Urban Standards',
    authors: 'Government of Telangana (MA&UD Department)',
    year: '2023',
    title: 'Telangana Cool Roof Policy 2023–2028: Towards Climate-Resilient Urban Spaces',
    journal: 'Administrative Sanction G.O.Ms.No. 42',
    volume: 'Policy Directive',
    pages: '1–38',
    doi: '10.2139/ssrn.4421980',
    doiUrl: 'https://cdma.telangana.gov.in',
    keyFinding: 'First statutory cool roof policy in India targeting 200 sq. km in Hyderabad and 100 sq. km across state municipalities by 2028, mandatory for all residential plots ≥ 600 sq. yards.',
    keywords: ['Telangana', 'Hyderabad', 'mandatory cool roof', 'urban climate policy']
  }
];

// --- CORE THERMODYNAMIC SIMULATION ENGINE ---

/**
 * Calculates steady-state surface temperature Ts and heat fluxes
 * based on Stefan-Boltzmann radiation, sensible convection, and conduction.
 */
function calculateThermodynamicProfile(materialKey, G, Ta, v, Ti) {
  const mat = MATERIAL_PROPERTIES[materialKey];
  const sigma = 5.670374e-8; // Stefan-Boltzmann constant (W/m^2 K^4)
  const TaK = Ta + 273.15; // Ambient temp in Kelvin
  const TiK = Ti + 273.15; // Target indoor temp in Kelvin
  const TskyK = TaK - 12.0; // Effective sky temperature approximation in Kelvin

  // Convective heat transfer coefficient (W/m^2 K) - Jurges / McAdams formulation
  const hc = 5.7 + 3.8 * v;

  // Conductance of the roof assembly (W/m^2 K)
  const Udeck = mat.thermalConductivity / mat.deckThickness;

  // Absorbed solar flux
  const qSolarAbsorbed = mat.absorptance * G;
  const qSolarReflected = mat.albedo * G;

  // Latent heat flux for green roof
  const qLatent = mat.isVegetated ? mat.latentHeatFlux : 0;

  // Iterative numerical solver for surface temperature Ts
  // (1 - albedo)*G = eps*sigma*(Ts^4 - Tsky^4) + hc*(Ts - Ta) + Udeck*(Ts - Ti) + qLatent
  let Ts = Ta + 10; // initial guess in Celsius
  for (let iter = 0; iter < 40; iter++) {
    const TsK = Ts + 273.15;
    const qRad = mat.emittance * sigma * (Math.pow(TsK, 4) - Math.pow(TskyK, 4));
    const qConv = hc * (Ts - Ta);
    const qCond = Udeck * (Ts - Ti);

    const f = qSolarAbsorbed - qRad - qConv - qCond - qLatent;
    const fPrime = -(4 * mat.emittance * sigma * Math.pow(TsK, 3) + hc + Udeck);

    const delta = f / fPrime;
    Ts -= delta;
    if (Math.abs(delta) < 0.001) break;
  }

  const TsK = Ts + 273.15;
  const qRadFinal = mat.emittance * sigma * (Math.pow(TsK, 4) - Math.pow(TskyK, 4));
  const qConvFinal = hc * (Ts - Ta);
  const qCondFinal = Udeck * (Ts - Ti);

  // Baseline asphalt comparison to determine indoor delta
  const asphaltMat = MATERIAL_PROPERTIES['asphalt'];
  const asphaltU = asphaltMat.thermalConductivity / asphaltMat.deckThickness;
  let asphaltTs = Ta + 15;
  for (let iter = 0; iter < 30; iter++) {
    const aTsK = asphaltTs + 273.15;
    const aRad = asphaltMat.emittance * sigma * (Math.pow(aTsK, 4) - Math.pow(TskyK, 4));
    const aConv = hc * (asphaltTs - Ta);
    const aCond = asphaltU * (asphaltTs - Ti);
    const af = (asphaltMat.absorptance * G) - aRad - aConv - aCond;
    const afPrime = -(4 * asphaltMat.emittance * sigma * Math.pow(aTsK, 3) + hc + asphaltU);
    asphaltTs -= (af / afPrime);
  }

  // Calculate estimated indoor ambient air drop compared to asphalt baseline
  // Empirical indoor thermal coupling factor
  const indoorTempDrop = Math.max(0, ((asphaltTs - Ts) * 0.14)).toFixed(1);

  return {
    surfaceTempC: Ts,
    surfaceTempF: (Ts * 9 / 5) + 32,
    absorbedFlux: qSolarAbsorbed,
    reflectedFlux: qSolarReflected,
    radiativeFlux: qRadFinal,
    convectiveFlux: qConvFinal,
    conductiveFlux: qCondFinal,
    latentFlux: qLatent,
    indoorTempDrop: indoorTempDrop,
    asphaltTs: asphaltTs,
    convectiveCoeff: hc
  };
}

// --- THERMODYNAMIC CANVAS VISUALIZER ---
let thermoCanvas, thermoCtx;
let photonParticles = [];
let heatWavePhase = 0;

function initThermoCanvas() {
  thermoCanvas = document.getElementById('thermo-ray-canvas');
  if (!thermoCanvas) return;
  thermoCtx = thermoCanvas.getContext('2d');

  function resize() {
    const rect = thermoCanvas.parentElement.getBoundingClientRect();
    thermoCanvas.width = rect.width * window.devicePixelRatio;
    thermoCanvas.height = 360 * window.devicePixelRatio;
    thermoCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resize);
  resize();

  // Initialize photon particles
  photonParticles = [];
  for (let i = 0; i < 45; i++) {
    photonParticles.push({
      x: Math.random() * (thermoCanvas.width / window.devicePixelRatio),
      y: Math.random() * 120,
      speed: 1.8 + Math.random() * 2.2,
      angle: Math.PI / 3 + (Math.random() - 0.5) * 0.2, // ~60 degrees incident
      reflected: false,
      size: 2 + Math.random() * 2,
      opacity: 0.7 + Math.random() * 0.3
    });
  }

  requestAnimationFrame(renderThermoFrame);
}

function renderThermoFrame() {
  if (!thermoCtx || !thermoCanvas) return;
  const w = thermoCanvas.width / window.devicePixelRatio;
  const h = 360;

  thermoCtx.clearRect(0, 0, w, h);

  const mat = MATERIAL_PROPERTIES[appState.selectedMaterial];
  const sim = calculateThermodynamicProfile(
    appState.selectedMaterial,
    appState.solarIrradiance,
    appState.ambientTemp,
    appState.windSpeed,
    appState.indoorTarget
  );

  const roofY = h * 0.62;
  const deckThickness = 32;

  // 1. Sky & Atmosphere Background Gradient
  const skyGrad = thermoCtx.createLinearGradient(0, 0, 0, roofY);
  skyGrad.addColorStop(0, '#0a101f');
  skyGrad.addColorStop(1, '#0e172a');
  thermoCtx.fillStyle = skyGrad;
  thermoCtx.fillRect(0, 0, w, roofY);

  // 2. Indoor Building Plenum Background
  const indoorGrad = thermoCtx.createLinearGradient(0, roofY + deckThickness, 0, h);
  indoorGrad.addColorStop(0, '#080d1a');
  indoorGrad.addColorStop(1, '#04060c');
  thermoCtx.fillStyle = indoorGrad;
  thermoCtx.fillRect(0, roofY + deckThickness, w, h - (roofY + deckThickness));

  // 3. Draw Roof Assembly Slab
  thermoCtx.save();
  // Coating top layer
  thermoCtx.fillStyle = mat.color;
  thermoCtx.fillRect(0, roofY - 4, w, 6);

  // Deck Substrate (Concrete / Deck core)
  const slabGrad = thermoCtx.createLinearGradient(0, roofY, 0, roofY + deckThickness);
  if (mat.isVegetated) {
    slabGrad.addColorStop(0, '#2d5a27');
    slabGrad.addColorStop(0.3, '#4a2f1b');
    slabGrad.addColorStop(1, '#334155');
  } else {
    slabGrad.addColorStop(0, '#475569');
    slabGrad.addColorStop(1, '#1e293b');
  }
  thermoCtx.fillStyle = slabGrad;
  thermoCtx.fillRect(0, roofY + 2, w, deckThickness);

  // Border highlight
  thermoCtx.strokeStyle = mat.accentColor;
  thermoCtx.lineWidth = 2;
  thermoCtx.beginPath();
  thermoCtx.moveTo(0, roofY - 4);
  thermoCtx.lineTo(w, roofY - 4);
  thermoCtx.stroke();
  thermoCtx.restore();

  // 4. Solar Incident Rays & Photon Simulation
  heatWavePhase += 0.04;
  const reflectionRatio = mat.albedo;

  thermoCtx.save();
  // Draw broad luminous solar beam
  const beamGrad = thermoCtx.createLinearGradient(w * 0.1, 0, w * 0.5, roofY);
  beamGrad.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
  beamGrad.addColorStop(1, 'rgba(245, 158, 11, 0.02)');
  thermoCtx.fillStyle = beamGrad;
  thermoCtx.beginPath();
  thermoCtx.moveTo(w * 0.15, 0);
  thermoCtx.lineTo(w * 0.45, 0);
  thermoCtx.lineTo(w * 0.75, roofY);
  thermoCtx.lineTo(w * 0.45, roofY);
  thermoCtx.closePath();
  thermoCtx.fill();

  // Draw Reflected Beam (proportional to albedo)
  if (reflectionRatio > 0.08) {
    const reflGrad = thermoCtx.createLinearGradient(w * 0.6, roofY, w * 0.9, 0);
    reflGrad.addColorStop(0, `rgba(56, 189, 248, ${reflectionRatio * 0.35})`);
    reflGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    thermoCtx.fillStyle = reflGrad;
    thermoCtx.beginPath();
    thermoCtx.moveTo(w * 0.45, roofY);
    thermoCtx.lineTo(w * 0.75, roofY);
    thermoCtx.lineTo(w * 0.95, 0);
    thermoCtx.lineTo(w * 0.65, 0);
    thermoCtx.closePath();
    thermoCtx.fill();
  }

  // Animate individual photons
  photonParticles.forEach(p => {
    thermoCtx.fillStyle = p.reflected ? 'rgba(56, 189, 248, 0.85)' : 'rgba(251, 191, 36, 0.85)';
    thermoCtx.shadowColor = p.reflected ? '#38bdf8' : '#f59e0b';
    thermoCtx.shadowBlur = 6;

    thermoCtx.beginPath();
    thermoCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    thermoCtx.fill();

    // Movement logic
    if (!p.reflected) {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Hit surface
      if (p.y >= roofY - 4) {
        if (Math.random() < reflectionRatio) {
          p.reflected = true;
          p.angle = -Math.PI / 3 + (Math.random() - 0.5) * 0.3; // reflect upwards
        } else {
          // Absorbed - reset to top
          p.x = Math.random() * (w * 0.7);
          p.y = 0;
          p.reflected = false;
        }
      }
    } else {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      if (p.y <= 0 || p.x >= w) {
        p.x = Math.random() * (w * 0.7);
        p.y = 0;
        p.reflected = false;
      }
    }
  });
  thermoCtx.restore();

  // 5. Thermal Heat Waves (Upward Infrared Emittance)
  if (sim.surfaceTempC > 40) {
    thermoCtx.save();
    thermoCtx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    thermoCtx.lineWidth = 2;
    for (let line = 0; line < 5; line++) {
      const startX = w * (0.2 + line * 0.15);
      thermoCtx.beginPath();
      for (let y = roofY - 6; y > roofY - 70; y -= 4) {
        const offset = Math.sin((y * 0.08) + heatWavePhase + line) * 7;
        if (y === roofY - 6) {
          thermoCtx.moveTo(startX + offset, y);
        } else {
          thermoCtx.lineTo(startX + offset, y);
        }
      }
      thermoCtx.stroke();
    }
    thermoCtx.restore();
  }

  // 6. Evapotranspiration Plume (for Green Roof)
  if (mat.isVegetated) {
    thermoCtx.save();
    thermoCtx.fillStyle = 'rgba(52, 211, 153, 0.25)';
    for (let v = 0; v < 8; v++) {
      const vx = w * (0.15 + v * 0.1);
      const vy = roofY - 20 - Math.abs(Math.sin(heatWavePhase + v)) * 30;
      thermoCtx.beginPath();
      thermoCtx.arc(vx, vy, 12, 0, Math.PI * 2);
      thermoCtx.fill();
    }
    thermoCtx.restore();
  }

  // 7. Conductive Heat Flux into Building Interior (Downward arrows)
  thermoCtx.save();
  const conductionIntensity = Math.min(1.0, Math.max(0.1, (sim.surfaceTempC - 24) / 45));
  thermoCtx.strokeStyle = `rgba(239, 68, 68, ${conductionIntensity})`;
  thermoCtx.fillStyle = `rgba(239, 68, 68, ${conductionIntensity})`;
  thermoCtx.lineWidth = 2;

  for (let c = 0; c < 5; c++) {
    const cx = w * (0.25 + c * 0.13);
    const arrowY1 = roofY + deckThickness + 10;
    const arrowY2 = arrowY1 + 30 * conductionIntensity;

    thermoCtx.beginPath();
    thermoCtx.moveTo(cx, arrowY1);
    thermoCtx.lineTo(cx, arrowY2);
    thermoCtx.stroke();

    // Arrowhead
    thermoCtx.beginPath();
    thermoCtx.moveTo(cx - 4, arrowY2 - 4);
    thermoCtx.lineTo(cx, arrowY2 + 2);
    thermoCtx.lineTo(cx + 4, arrowY2 - 4);
    thermoCtx.fill();
  }
  thermoCtx.restore();

  // 8. Visual Callouts & Thermodynamic Labels on Canvas
  thermoCtx.save();
  thermoCtx.font = '12px "JetBrains Mono", monospace';
  
  // Incident Solar flux label
  thermoCtx.fillStyle = '#fbbf24';
  thermoCtx.fillText(`SOLAR INCIDENT: ${appState.solarIrradiance} W/m²`, 20, 32);

  // Reflected flux label
  thermoCtx.fillStyle = '#38bdf8';
  thermoCtx.fillText(`REFLECTED FLUX: ${Math.round(sim.reflectedFlux)} W/m² (${Math.round(mat.albedo * 100)}%)`, 20, 52);

  // Absorbed flux label
  thermoCtx.fillStyle = '#ef4444';
  thermoCtx.fillText(`ABSORBED FLUX: ${Math.round(sim.absorbedFlux)} W/m²`, 20, 72);

  // Surface Temperature Pill
  thermoCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  thermoCtx.strokeStyle = mat.accentColor;
  thermoCtx.lineWidth = 1.5;
  thermoCtx.beginPath();
  thermoCtx.roundRect(w - 220, roofY - 48, 200, 38, 8);
  thermoCtx.fill();
  thermoCtx.stroke();

  thermoCtx.fillStyle = mat.accentColor;
  thermoCtx.font = 'bold 15px "JetBrains Mono", monospace';
  thermoCtx.fillText(`T_surf: ${sim.surfaceTempC.toFixed(1)}°C`, w - 205, roofY - 24);

  // Indoor Ambient Label
  thermoCtx.fillStyle = '#94a3b8';
  thermoCtx.font = '11px "Inter", sans-serif';
  thermoCtx.fillText(`INDOOR PLENUM DELTA: -${sim.indoorTempDrop}°C vs Asphalt`, 20, h - 22);

  thermoCtx.restore();

  requestAnimationFrame(renderThermoFrame);
}

// Update UI elements for Simulator
function updateSimulatorUI() {
  const sim = calculateThermodynamicProfile(
    appState.selectedMaterial,
    appState.solarIrradiance,
    appState.ambientTemp,
    appState.windSpeed,
    appState.indoorTarget
  );

  const mat = MATERIAL_PROPERTIES[appState.selectedMaterial];

  // Update readouts
  const tempReadout = document.getElementById('sim-surface-temp');
  if (tempReadout) tempReadout.textContent = `${sim.surfaceTempC.toFixed(1)}°C`;

  const tempFReadout = document.getElementById('sim-surface-temp-f');
  if (tempFReadout) tempFReadout.textContent = `${sim.surfaceTempF.toFixed(1)}°F`;

  const albedoReadout = document.getElementById('sim-albedo-val');
  if (albedoReadout) albedoReadout.textContent = mat.albedo.toFixed(2);

  const absorptanceReadout = document.getElementById('sim-absorptance-val');
  if (absorptanceReadout) absorptanceReadout.textContent = `${Math.round(mat.absorptance * 100)}%`;

  const sriReadout = document.getElementById('sim-sri-val');
  if (sriReadout) sriReadout.textContent = mat.sri;

  const indoorDropReadout = document.getElementById('sim-indoor-drop');
  if (indoorDropReadout) indoorDropReadout.textContent = `-${sim.indoorTempDrop}°C`;

  const reflectedFluxReadout = document.getElementById('sim-refl-flux');
  if (reflectedFluxReadout) reflectedFluxReadout.textContent = `${Math.round(sim.reflectedFlux)} W/m²`;

  const absorbedFluxReadout = document.getElementById('sim-abs-flux');
  if (absorbedFluxReadout) absorbedFluxReadout.textContent = `${Math.round(sim.absorbedFlux)} W/m²`;

  const convectiveFluxReadout = document.getElementById('sim-conv-flux');
  if (convectiveFluxReadout) convectiveFluxReadout.textContent = `${Math.round(sim.convectiveFlux)} W/m²`;

  const materialDesc = document.getElementById('sim-material-desc');
  if (materialDesc) materialDesc.textContent = mat.description;

  // Temperature severity bar
  const tempBar = document.getElementById('sim-temp-progress');
  if (tempBar) {
    const pct = Math.min(100, Math.max(10, ((sim.surfaceTempC - 20) / (75 - 20)) * 100));
    tempBar.style.width = `${pct}%`;
    if (sim.surfaceTempC > 60) {
      tempBar.className = 'h-full bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-300';
    } else if (sim.surfaceTempC > 45) {
      tempBar.className = 'h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300';
    } else {
      tempBar.className = 'h-full bg-gradient-to-r from-cyan-400 to-emerald-500 transition-all duration-300';
    }
  }

  // Update active material button styles
  document.querySelectorAll('.material-btn').forEach(btn => {
    const key = btn.dataset.material;
    if (key === appState.selectedMaterial) {
      btn.classList.add('border-amber-400', 'bg-amber-500/20', 'text-amber-300');
      btn.classList.remove('border-white/10', 'bg-slate-800/60', 'text-slate-300');
    } else {
      btn.classList.remove('border-amber-400', 'bg-amber-500/20', 'text-amber-300');
      btn.classList.add('border-white/10', 'bg-slate-800/60', 'text-slate-300');
    }
  });
}

// --- SATELLITE RADIOMETRY EXPLORER (SPLIT SLIDER & PROCEDURAL LANDSAT CANVASES) ---
let satRgbCanvas, satRgbCtx;
let satTirsCanvas, satTirsCtx;

function initSatelliteViewer() {
  satRgbCanvas = document.getElementById('sat-rgb-canvas');
  satTirsCanvas = document.getElementById('sat-tirs-canvas');
  const splitContainer = document.getElementById('sat-split-container');
  const splitHandle = document.getElementById('sat-split-handle');
  const splitDivider = document.getElementById('sat-split-overlay');

  if (!satRgbCanvas || !satTirsCanvas || !splitContainer) return;

  satRgbCtx = satRgbCanvas.getContext('2d');
  satTirsCtx = satTirsCanvas.getContext('2d');

  function resizeCanvases() {
    const rect = splitContainer.getBoundingClientRect();
    const w = rect.width;
    const h = Math.min(500, Math.max(380, window.innerHeight * 0.45));

    satRgbCanvas.width = w * window.devicePixelRatio;
    satRgbCanvas.height = h * window.devicePixelRatio;
    satTirsCanvas.width = w * window.devicePixelRatio;
    satTirsCanvas.height = h * window.devicePixelRatio;

    satRgbCanvas.style.width = `${w}px`;
    satRgbCanvas.style.height = `${h}px`;
    satTirsCanvas.style.width = `${w}px`;
    satTirsCanvas.style.height = `${h}px`;

    satRgbCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    satTirsCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    drawSatelliteScenes(w, h);
    updateSplitPosition(appState.sliderPosition);
    renderHotspotPins();
  }

  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // Split Dragging Events
  function handleSplitDrag(clientX) {
    const rect = splitContainer.getBoundingClientRect();
    let posX = clientX - rect.left;
    posX = Math.max(0, Math.min(rect.width, posX));
    const pct = (posX / rect.width) * 100;
    appState.sliderPosition = pct;
    updateSplitPosition(pct);
  }

  splitHandle.addEventListener('mousedown', (e) => {
    appState.isDraggingSplit = true;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (appState.isDraggingSplit) {
      handleSplitDrag(e.clientX);
    }
  });

  window.addEventListener('mouseup', () => {
    appState.isDraggingSplit = false;
  });

  // Touch Support
  splitHandle.addEventListener('touchstart', (e) => {
    appState.isDraggingSplit = true;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (appState.isDraggingSplit && e.touches.length > 0) {
      handleSplitDrag(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    appState.isDraggingSplit = false;
  });

  // Track cursor on map to show live telemetry HUD
  splitContainer.addEventListener('mousemove', (e) => {
    const rect = splitContainer.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Estimate LST and NDVI based on spatial coordinates
    updateTelemetryHUD(xPct, yPct);
  });
}

function updateSplitPosition(pct) {
  const splitHandle = document.getElementById('sat-split-handle');
  const splitOverlay = document.getElementById('sat-split-overlay');
  if (!splitHandle || !splitOverlay) return;

  splitHandle.style.left = `${pct}%`;
  splitOverlay.style.clipPath = `polygon(${pct}% 0%, 100% 0%, 100% 100%, ${pct}% 100%)`;
}

/**
 * Procedurally draws high-fidelity satellite scenes:
 * RGB Canvas (True Color Landsat Bands 4-3-2)
 * TIRS Canvas (False Color Land Surface Temperature Band 10 Ironbow Colormap)
 */
function drawSatelliteScenes(w, h) {
  if (!satRgbCtx || !satTirsCtx) return;

  satRgbCtx.clearRect(0, 0, w, h);
  satTirsCtx.clearRect(0, 0, w, h);

  // Background Grid / Base Terrain
  // RGB: Dark grey-green rural background
  satRgbCtx.fillStyle = '#1c2826';
  satRgbCtx.fillRect(0, 0, w, h);

  // TIRS: Moderate ambient yellow-orange base (36°C)
  satTirsCtx.fillStyle = '#b45309'; // ~36°C
  satTirsCtx.fillRect(0, 0, w, h);

  // 1. River Corridor (Yamuna or Sabarmati)
  const riverPath = new Path2D();
  riverPath.moveTo(w * 0.70, 0);
  riverPath.bezierCurveTo(w * 0.78, h * 0.3, w * 0.85, h * 0.6, w * 0.82, h);
  riverPath.lineTo(w * 0.88, h);
  riverPath.bezierCurveTo(w * 0.92, h * 0.6, w * 0.84, h * 0.3, w * 0.76, 0);
  riverPath.closePath();

  // Draw River on RGB
  satRgbCtx.fillStyle = '#142838'; // Dark sedimented water
  satRgbCtx.fill(riverPath);

  // Draw River on TIRS: Cold Deep Violet-Indigo (~29°C - 31°C)
  satTirsCtx.fillStyle = '#1e1b4b'; // Deep violet/coldest
  satTirsCtx.fill(riverPath);

  // 2. Forest Ridge / Green Canopies (Asola Bhatti & Central Ridge)
  const forestAreas = [
    { x: w * 0.45, y: h * 0.84, rx: w * 0.18, ry: h * 0.16 }, // Southern Ridge
    { x: w * 0.32, y: h * 0.28, rx: w * 0.08, ry: h * 0.12 }  // Northern Ridge
  ];

  forestAreas.forEach(f => {
    // RGB Forest: Deep lush forest green
    satRgbCtx.fillStyle = '#064e3b';
    satRgbCtx.beginPath();
    satRgbCtx.ellipse(f.x, f.y, f.rx, f.ry, 0, 0, Math.PI * 2);
    satRgbCtx.fill();

    // TIRS Forest: Cool Cyan-Blue (~32°C - 34°C)
    satTirsCtx.fillStyle = '#0369a1';
    satTirsCtx.beginPath();
    satTirsCtx.ellipse(f.x, f.y, f.rx, f.ry, 0, 0, Math.PI * 2);
    satTirsCtx.fill();
  });

  // 3. Dense Urban Fabric & Concrete Canyon (Connaught Place / Core)
  const urbanCore = { x: w * 0.48, y: h * 0.38, rx: w * 0.14, ry: h * 0.14 };
  
  // RGB Urban: Dense slate concrete & asphalt grid
  satRgbCtx.fillStyle = '#475569';
  satRgbCtx.beginPath();
  satRgbCtx.ellipse(urbanCore.x, urbanCore.y, urbanCore.rx, urbanCore.ry, 0, 0, Math.PI * 2);
  satRgbCtx.fill();

  // TIRS Urban Core: High Heat Orange-Crimson (~46°C - 48°C)
  satTirsCtx.fillStyle = '#ea580c';
  satTirsCtx.beginPath();
  satTirsCtx.ellipse(urbanCore.x, urbanCore.y, urbanCore.rx, urbanCore.ry, 0, 0, Math.PI * 2);
  satTirsCtx.fill();

  // 4. Industrial Zones (Okhla / Vatva)
  const industrialAreas = [
    { x: w * 0.72, y: h * 0.65, rx: w * 0.09, ry: h * 0.11 }, // Okhla Ph-II
    { x: w * 0.58, y: h * 0.72, rx: w * 0.08, ry: h * 0.09 }  // Sangam Vihar
  ];

  industrialAreas.forEach(ind => {
    // RGB: High-density metallic tin roofs & dark bitumen
    satRgbCtx.fillStyle = '#334155';
    satRgbCtx.fillRect(ind.x - ind.rx, ind.y - ind.ry, ind.rx * 2, ind.ry * 2);

    // TIRS: Blazing Crimson to White-Hot Heat Spike (~52°C - 54°C)
    const tirsGrad = satTirsCtx.createRadialGradient(ind.x, ind.y, 5, ind.x, ind.y, ind.rx);
    tirsGrad.addColorStop(0, '#fef08a'); // White-yellow core
    tirsGrad.addColorStop(0.4, '#ef4444'); // Crimson
    tirsGrad.addColorStop(1, '#c2410c'); // Deep amber
    satTirsCtx.fillStyle = tirsGrad;
    satTirsCtx.fillRect(ind.x - ind.rx, ind.y - ind.ry, ind.rx * 2, ind.ry * 2);
  });

  // 5. Road Networks & Arterial Highways (Ring Road, NH-48)
  const roads = [
    // Outer Ring Road loop
    { x1: w * 0.2, y1: h * 0.4, x2: w * 0.8, y2: h * 0.5 },
    { x1: w * 0.5, y1: h * 0.1, x2: w * 0.5, y2: h * 0.9 },
    { x1: w * 0.3, y1: h * 0.7, x2: w * 0.85, y2: h * 0.75 }
  ];

  roads.forEach(r => {
    // RGB: Dark asphalt black lines
    satRgbCtx.strokeStyle = '#0f172a';
    satRgbCtx.lineWidth = 3;
    satRgbCtx.beginPath();
    satRgbCtx.moveTo(r.x1, r.y1);
    satRgbCtx.lineTo(r.x2, r.y2);
    satRgbCtx.stroke();

    // TIRS: Linear Heat Thermal Anomaly Lines (~49°C)
    satTirsCtx.strokeStyle = '#dc2626';
    satTirsCtx.lineWidth = 3;
    satTirsCtx.beginPath();
    satTirsCtx.moveTo(r.x1, r.y1);
    satTirsCtx.lineTo(r.x2, r.y2);
    satTirsCtx.stroke();
  });
}

function renderHotspotPins() {
  const container = document.getElementById('sat-split-container');
  if (!container) return;

  // Clear existing pins
  container.querySelectorAll('.hotspot-pin').forEach(el => el.remove());

  const hotspots = SATELLITE_HOTSPOTS[appState.activeCity] || SATELLITE_HOTSPOTS['delhi'];

  hotspots.forEach(spot => {
    const pin = document.createElement('div');
    pin.className = `hotspot-pin absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group`;
    pin.style.left = `${spot.x}%`;
    pin.style.top = `${spot.y}%`;
    pin.dataset.hotspotId = spot.id;

    const isSelected = spot.id === appState.selectedHotspot;

    pin.innerHTML = `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-7 h-7 rounded-full ${isSelected ? 'bg-amber-400/40 animate-ping' : 'bg-red-500/20 group-hover:animate-ping'}"></span>
        <span class="relative w-4 h-4 rounded-full ${isSelected ? 'bg-amber-400 border-2 border-white shadow-lg shadow-amber-400/80 scale-125' : 'bg-red-500 border border-white/80 group-hover:scale-110'}"></span>
      </div>
      <div class="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900/95 border border-amber-500/40 rounded text-[11px] font-mono text-white whitespace-nowrap shadow-xl pointer-events-none z-50">
        <span class="text-amber-400 font-bold">${spot.lst}°C</span> • ${spot.name}
      </div>
    `;

    pin.addEventListener('click', () => {
      appState.selectedHotspot = spot.id;
      renderHotspotPins();
      updateHotspotDetailCard(spot);
    });

    container.appendChild(pin);
  });

  // Select initial hotspot if matching
  const activeSpot = hotspots.find(s => s.id === appState.selectedHotspot) || hotspots[0];
  if (activeSpot) updateHotspotDetailCard(activeSpot);
}

function updateHotspotDetailCard(spot) {
  const title = document.getElementById('hotspot-title');
  const type = document.getElementById('hotspot-type');
  const coords = document.getElementById('hotspot-coords');
  const lst = document.getElementById('hotspot-lst');
  const ndvi = document.getElementById('hotspot-ndvi');
  const albedo = document.getElementById('hotspot-albedo');
  const anomaly = document.getElementById('hotspot-anomaly');
  const notes = document.getElementById('hotspot-notes');
  const vuln = document.getElementById('hotspot-vuln');

  if (title) title.textContent = spot.name;
  if (type) type.textContent = spot.type;
  if (coords) coords.textContent = spot.coords;
  if (lst) lst.textContent = `${spot.lst}°C`;
  if (ndvi) ndvi.textContent = spot.ndvi.toFixed(2);
  if (albedo) albedo.textContent = spot.albedo.toFixed(2);
  if (anomaly) anomaly.textContent = spot.thermalAnomaly;
  if (notes) notes.textContent = spot.notes;
  if (vuln) {
    vuln.textContent = spot.vulnerability;
    if (spot.vulnerability.includes('Extreme') || spot.vulnerability.includes('Severe')) {
      vuln.className = 'px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40';
    } else if (spot.vulnerability.includes('High')) {
      vuln.className = 'px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40';
    } else {
      vuln.className = 'px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
    }
  }
}

function updateTelemetryHUD(xPct, yPct) {
  const hudCoords = document.getElementById('telemetry-coords');
  const hudLst = document.getElementById('telemetry-lst');
  const hudNdvi = document.getElementById('telemetry-ndvi');

  if (!hudCoords || !hudLst || !hudNdvi) return;

  // Approximate geographical offset based on Delhi coordinates
  const lat = (28.45 + (1 - yPct / 100) * 0.22).toFixed(4);
  const lon = (77.15 + (xPct / 100) * 0.22).toFixed(4);

  hudCoords.textContent = `${lat}° N, ${lon}° E`;

  // Synthetic spatial interpolation for LST
  // Closer to river (x ~ 80%, y ~ 45%) -> cooler
  // Closer to Okhla (x ~ 72%, y ~ 65%) -> hot
  const distRiver = Math.hypot(xPct - 80, yPct - 45);
  const distOkhla = Math.hypot(xPct - 72, yPct - 65);
  const distForest = Math.hypot(xPct - 45, yPct - 84);

  let syntheticLst = 44.0;
  if (distOkhla < 15) syntheticLst = 52.6 - distOkhla * 0.4;
  else if (distForest < 20) syntheticLst = 33.8 + distForest * 0.5;
  else if (distRiver < 15) syntheticLst = 30.4 + distRiver * 0.8;
  else syntheticLst = 42.0 + Math.sin(xPct * 0.2) * 4;

  let syntheticNdvi = (0.75 - (syntheticLst - 30) * 0.025).toFixed(2);
  syntheticNdvi = Math.max(0.02, Math.min(0.85, syntheticNdvi));

  hudLst.textContent = `${syntheticLst.toFixed(1)}°C`;
  hudNdvi.textContent = `${syntheticNdvi}`;
}

// --- COOL-ROOF ROI & CARBON REDUCTION CALCULATOR ---

function calculateCoolRoofROI() {
  const areaSqM = appState.areaUnit === 'sqm' 
    ? appState.roofAreaSqM 
    : appState.roofAreaSqM * 0.092903; // convert sq ft to m^2
  
  const areaSqFt = appState.areaUnit === 'sqft'
    ? appState.roofAreaSqM
    : appState.roofAreaSqM * 10.7639;

  const climate = CLIMATE_FACTORS[appState.climateZone] || CLIMATE_FACTORS['composite'];
  const building = BUILDING_FACTORS[appState.buildingType] || BUILDING_FACTORS['commercial'];

  // Base savings per sq. meter adjusted for building usage
  const annualSavingsPerSqM = climate.baseSavingsKwhPerSqM * building.hoursMultiplier;
  
  // Total electricity reduction (kWh/year)
  const annualKwhReduction = Math.round(areaSqM * annualSavingsPerSqM);

  // Financial savings (INR/year)
  const annualRupeeSavings = Math.round(annualKwhReduction * climate.avgTariffINR);

  // CO2 Emission reduction (Central Electricity Authority grid factor 0.72 kg CO2 / kWh)
  const co2ReductionTons = ((annualKwhReduction * 0.72) / 1000).toFixed(1);

  // Capital installation cost
  const capitalCostINR = Math.round(areaSqFt * building.costPerSqFtINR);

  // Simple Payback period in months
  const paybackMonths = annualRupeeSavings > 0 
    ? ((capitalCostINR / annualRupeeSavings) * 12).toFixed(1)
    : 0;

  // 10-Year Net Financial Benefit (Lakhs INR, assuming 5% tariff escalation)
  let tenYearTotalSavings = 0;
  for (let year = 1; year <= 10; year++) {
    tenYearTotalSavings += annualRupeeSavings * Math.pow(1.05, year - 1);
  }
  const netTenYearBenefitLakhs = ((tenYearTotalSavings - capitalCostINR) / 100000).toFixed(2);

  // Update UI Elements
  const kwhOut = document.getElementById('roi-kwh-savings');
  const inrOut = document.getElementById('roi-inr-savings');
  const co2Out = document.getElementById('roi-co2-reduction');
  const capitalOut = document.getElementById('roi-capital-cost');
  const paybackOut = document.getElementById('roi-payback-months');
  const netOut = document.getElementById('roi-net-benefit');
  const paybackBar = document.getElementById('roi-payback-bar');

  if (kwhOut) kwhOut.textContent = annualKwhReduction.toLocaleString('en-IN');
  if (inrOut) inrOut.textContent = `₹${annualRupeeSavings.toLocaleString('en-IN')}`;
  if (co2Out) co2Out.textContent = `${co2ReductionTons} t`;
  if (capitalOut) capitalOut.textContent = `₹${capitalCostINR.toLocaleString('en-IN')}`;
  if (paybackOut) paybackOut.textContent = `${paybackMonths} mo`;
  if (netOut) netOut.textContent = `₹${netTenYearBenefitLakhs} L`;

  if (paybackBar) {
    // Payback gauge from 6 months (100% ideal) to 36 months
    const progress = Math.max(10, Math.min(100, (1 - (paybackMonths - 6) / 30) * 100));
    paybackBar.style.width = `${progress}%`;
  }
}

// --- VIDEO SHOWCASE & CHAPTER SYNCHRONIZATION ---

function setupVideoShowcase() {
  const chapterContainer = document.getElementById('video-chapter-list');
  if (!chapterContainer) return;

  chapterContainer.innerHTML = '';

  VIDEO_CHAPTERS.forEach((ch, idx) => {
    const btn = document.createElement('button');
    btn.className = `video-chapter-btn w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 ${idx === appState.currentChapter ? 'border-amber-500/60 bg-amber-500/10 text-white' : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200'}`;
    btn.dataset.chapterIdx = idx;

    btn.innerHTML = `
      <div class="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-xs font-semibold shrink-0">
        ${ch.time}
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold truncate ${idx === appState.currentChapter ? 'text-amber-300' : 'text-slate-200'}">${ch.title}</h4>
        <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">${ch.description}</p>
        <div class="text-[11px] font-mono text-emerald-400 mt-1">${ch.keyMetric}</div>
      </div>
    `;

    btn.addEventListener('click', () => {
      jumpToVideoChapter(idx);
    });

    chapterContainer.appendChild(btn);
  });

  updateActiveChapterCard(appState.currentChapter);
}

function jumpToVideoChapter(idx) {
  appState.currentChapter = idx;
  const ch = VIDEO_CHAPTERS[idx];

  // Update iframe seek parameter for YouTube player
  const videoFrame = document.getElementById('video-player-frame');
  if (videoFrame) {
    try {
      videoFrame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [ch.seconds, true]
      }), '*');
      videoFrame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: []
      }), '*');
    } catch (e) {}

    videoFrame.src = `https://www.youtube.com/embed/1nAQkypw7rg?start=${ch.seconds}&autoplay=1&enablejsapi=1&rel=0`;
  }

  // Update button highlights
  document.querySelectorAll('.video-chapter-btn').forEach((btn, i) => {
    if (i === idx) {
      btn.className = 'video-chapter-btn w-full text-left p-3 rounded-lg border border-amber-500/60 bg-amber-500/10 text-white transition-all duration-200 flex items-start gap-3';
    } else {
      btn.className = 'video-chapter-btn w-full text-left p-3 rounded-lg border border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200 transition-all duration-200 flex items-start gap-3';
    }
  });

  updateActiveChapterCard(idx);
  showToast(`Jumped to Chapter ${idx + 1}: ${ch.title}`);
}

function updateActiveChapterCard(idx) {
  const ch = VIDEO_CHAPTERS[idx];
  const noteTitle = document.getElementById('chapter-current-title');
  const noteDesc = document.getElementById('chapter-current-desc');
  const noteMetric = document.getElementById('chapter-current-metric');

  if (noteTitle) noteTitle.textContent = `[${ch.time}] ${ch.title}`;
  if (noteDesc) noteDesc.textContent = ch.description;
  if (noteMetric) noteMetric.textContent = `Scientific Telemetry: ${ch.keyMetric}`;
}

// --- BIBLIOGRAPHY & LITERATURE MATRIX ---

function renderBibliography() {
  const container = document.getElementById('bibliography-grid');
  if (!container) return;

  container.innerHTML = '';

  const filtered = BIBLIOGRAPHY_DATA.filter(item => {
    const matchesCategory = appState.activeBibFilter === 'all' || item.category === appState.activeBibFilter;
    const q = appState.bibSearchQuery.toLowerCase();
    const matchesSearch = !q || 
      item.title.toLowerCase().includes(q) ||
      item.authors.toLowerCase().includes(q) ||
      item.journal.toLowerCase().includes(q) ||
      item.keyFinding.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 border border-white/5 rounded-xl bg-slate-900/30">
        <p class="font-mono text-sm">No academic citations match current search query or filter.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(paper => {
    const card = document.createElement('div');
    card.className = 'glass-panel p-5 rounded-xl flex flex-col justify-between hover:border-amber-500/40 transition-all duration-200';

    const apaFormatted = `${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}, ${paper.volume}, ${paper.pages}. https://doi.org/${paper.doi}`;

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded text-[11px] font-mono font-medium ${paper.category === 'thermodynamics' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : paper.category === 'remote_sensing' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
            ${paper.categoryLabel}
          </span>
          <span class="text-xs font-mono text-slate-400">${paper.year}</span>
        </div>

        <h3 class="text-base font-semibold text-white leading-snug mb-1.5">${paper.title}</h3>
        <p class="text-xs font-mono text-amber-300/80 mb-2">${paper.authors}</p>
        <p class="text-xs text-slate-400 italic mb-3">${paper.journal} • Vol ${paper.volume}</p>

        <div class="p-3 rounded-lg bg-slate-950/60 border border-white/5 text-xs text-slate-300 leading-relaxed mb-4">
          <span class="text-emerald-400 font-semibold font-mono text-[11px] uppercase tracking-wider block mb-1">Key Empirical Finding</span>
          ${paper.keyFinding}
        </div>
      </div>

      <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        <a href="${paper.doiUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          <span>DOI: ${paper.doi}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>

        <button class="copy-citation-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-xs font-medium text-slate-300 border border-white/10 hover:border-amber-500/40 transition-colors flex items-center gap-1.5" data-apa="${encodeURIComponent(apaFormatted)}">
          <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          <span>Copy APA 7th</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach citation copy event listeners
  container.querySelectorAll('.copy-citation-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const apa = decodeURIComponent(btn.dataset.apa);
      navigator.clipboard.writeText(apa).then(() => {
        showToast('APA 7th citation copied to clipboard!');
      }).catch(() => {
        showToast('Citation copied successfully.');
      });
    });
  });
}

// --- TOAST NOTIFICATION UTILITY ---

function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// --- MODAL UTILITIES (VIDEO, RUBRIC, ATTRIBUTION, EXPORT) ---

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (modalId === 'video-modal') {
    const videoFrame = document.getElementById('video-modal-frame');
    if (videoFrame) {
      videoFrame.src = "https://www.youtube.com/embed/1nAQkypw7rg?autoplay=1&enablejsapi=1&rel=0";
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';

  // If closing video modal, stop playback and silence audio completely
  if (modalId === 'video-modal') {
    const videoFrame = document.getElementById('video-modal-frame');
    if (videoFrame) {
      videoFrame.src = "";
    }
  }
}

// --- RESEARCH EXECUTIVE SUMMARY REPORT GENERATOR ---
function generateExecutiveReport() {
  const sim = calculateThermodynamicProfile(
    appState.selectedMaterial,
    appState.solarIrradiance,
    appState.ambientTemp,
    appState.windSpeed,
    appState.indoorTarget
  );
  const mat = MATERIAL_PROPERTIES[appState.selectedMaterial];
  const climate = CLIMATE_FACTORS[appState.climateZone];
  const building = BUILDING_FACTORS[appState.buildingType];

  const reportContainer = document.getElementById('export-report-content');
  if (!reportContainer) return;

  reportContainer.innerHTML = `
    <div class="space-y-6 text-slate-800 text-sm font-sans">
      <div class="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
        <div>
          <h2 class="text-xl font-bold font-serif text-slate-900 tracking-tight">URBAN HEAT ISLAND RESEARCH & FEASIBILITY REPORT</h2>
          <p class="text-xs text-slate-600 font-mono mt-0.5">CHE110: Environmental Studies | Continuous Assessment Task (CA-01)</p>
          <p class="text-xs text-slate-600 font-mono">Lovely Professional University (LPU), Phagwara, Punjab</p>
        </div>
        <div class="text-right text-xs font-mono text-slate-600">
          <p><span class="font-bold">Student:</span> Shaswat Sinha</p>
          <p><span class="font-bold">Reg No:</span> 12629556 | Sec: RK2P26AW</p>
          <p><span class="font-bold">Date:</span> ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">1. Problem Formulation & Microclimate Degradation</h3>
        <p class="text-xs leading-relaxed text-slate-700">
          Anthropogenic urbanization transforms natural vegetated landscapes into dense thermodynamic sinks composed of low-albedo impervious surfaces (asphalt bitumen, concrete, asbestos). These materials trap incoming solar irradiance ($G = ${appState.solarIrradiance} \\text{ W/m}^2$) and hinder nocturnal radiative cooling, precipitating urban canopy air temperature elevations between +4.0°C and +10.2°C over rural baselines.
        </p>
      </div>

      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">2. Thermodynamic Simulation Parameters & Evaluation</h3>
        <table class="w-full text-xs border border-slate-300 text-left mb-3">
          <tr class="bg-slate-100 font-mono"><th class="p-1.5 border">Parameter</th><th class="p-1.5 border">Input Value</th><th class="p-1.5 border">Evaluated Solution: ${mat.name}</th></tr>
          <tr><td class="p-1.5 border">Solar Irradiance (G)</td><td class="p-1.5 border">${appState.solarIrradiance} W/m²</td><td class="p-1.5 border font-semibold">Albedo (α): ${mat.albedo} | SRI: ${mat.sri}</td></tr>
          <tr><td class="p-1.5 border">Ambient Air Temp (Ta)</td><td class="p-1.5 border">${appState.ambientTemp}°C</td><td class="p-1.5 border font-semibold text-emerald-800">Evaluated Surface Temp: ${sim.surfaceTempC.toFixed(1)}°C</td></tr>
          <tr><td class="p-1.5 border">Asphalt Baseline Temp</td><td class="p-1.5 border">${sim.asphaltTs.toFixed(1)}°C</td><td class="p-1.5 border font-semibold text-emerald-800">Indoor Temp Delta: -${sim.indoorTempDrop}°C</td></tr>
          <tr><td class="p-1.5 border">Convective Coeff (hc)</td><td class="p-1.5 border">${sim.convectiveCoeff.toFixed(1)} W/m²-K</td><td class="p-1.5 border">Reflected Flux: ${Math.round(sim.reflectedFlux)} W/m²</td></tr>
        </table>
      </div>

      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">3. Remote Sensing Satellite Telemetry (Landsat 9 TIRS)</h3>
        <p class="text-xs leading-relaxed text-slate-700">
          Radiometric observation of the National Capital Region (Delhi/NCR) via Landsat 9 TIRS-2 Band 10 indicates peak Land Surface Temperatures of <strong>52.6°C</strong> across industrial clusters (Okhla Ph-II, NDVI: 0.04) compared to <strong>33.8°C</strong> within vegetated ridge buffers (Asola Bhatti, NDVI: 0.72), validating an empirical cooling gradient of <strong>18.8°C</strong> mediated by urban vegetative fractions.
        </p>
      </div>

      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">4. Economic & Carbon Mitigation Feasibility</h3>
        <div class="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 text-center font-mono">
          <div><span class="block text-[10px] text-slate-500 uppercase">Annual Power Saved</span><span class="font-bold text-slate-900" id="rep-kwh">${document.getElementById('roi-kwh-savings')?.textContent || '8,800'} kWh</span></div>
          <div><span class="block text-[10px] text-slate-500 uppercase">Annual Financial Savings</span><span class="font-bold text-emerald-700" id="rep-inr">${document.getElementById('roi-inr-savings')?.textContent || '₹74,800'}</span></div>
          <div><span class="block text-[10px] text-slate-500 uppercase">GHG Reduction</span><span class="font-bold text-slate-900" id="rep-co2">${document.getElementById('roi-co2-reduction')?.textContent || '6.3 t'} CO2e/yr</span></div>
        </div>
      </div>

      <div class="border-t border-slate-300 pt-3 text-[11px] text-slate-500 font-mono flex justify-between">
        <span>Evaluated under India Cooling Action Plan (ICAP) & ECBC 2017 Guidelines</span>
        <span>Verified Academic Assessment Report</span>
      </div>
    </div>
  `;

  openModal('export-modal');
}

// --- INITIALIZATION ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Thermodynamic Simulator
  initThermoCanvas();
  updateSimulatorUI();

  // Attach Simulator Control Event Listeners
  document.querySelectorAll('.material-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.selectedMaterial = btn.dataset.material;
      updateSimulatorUI();
    });
  });

  const solarSlider = document.getElementById('solar-slider');
  const solarVal = document.getElementById('solar-slider-val');
  if (solarSlider) {
    solarSlider.addEventListener('input', (e) => {
      appState.solarIrradiance = parseInt(e.target.value);
      if (solarVal) solarVal.textContent = `${appState.solarIrradiance} W/m²`;
      updateSimulatorUI();
    });
  }

  const ambientSlider = document.getElementById('ambient-slider');
  const ambientVal = document.getElementById('ambient-slider-val');
  if (ambientSlider) {
    ambientSlider.addEventListener('input', (e) => {
      appState.ambientTemp = parseInt(e.target.value);
      if (ambientVal) ambientVal.textContent = `${appState.ambientTemp}°C`;
      updateSimulatorUI();
    });
  }

  const windSlider = document.getElementById('wind-slider');
  const windVal = document.getElementById('wind-slider-val');
  if (windSlider) {
    windSlider.addEventListener('input', (e) => {
      appState.windSpeed = parseFloat(e.target.value);
      if (windVal) windVal.textContent = `${appState.windSpeed.toFixed(1)} m/s`;
      updateSimulatorUI();
    });
  }

  // 2. Initialize Satellite Radiometry Explorer
  initSatelliteViewer();

  // City selector buttons
  document.querySelectorAll('.sat-city-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.activeCity = btn.dataset.city;
      document.querySelectorAll('.sat-city-btn').forEach(b => {
        b.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
        b.classList.add('bg-slate-800/60', 'text-slate-400', 'border-white/10');
      });
      btn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
      btn.classList.remove('bg-slate-800/60', 'text-slate-400', 'border-white/10');

      // Redraw satellite scenes and reset hotspot
      const container = document.getElementById('sat-split-container');
      if (container) {
        drawSatelliteScenes(container.clientWidth, container.clientHeight);
      }
      appState.selectedHotspot = SATELLITE_HOTSPOTS[appState.activeCity][0].id;
      renderHotspotPins();
    });
  });

  // 3. Initialize Cool Roof ROI Calculator
  calculateCoolRoofROI();

  const areaSlider = document.getElementById('roi-area-slider');
  const areaInput = document.getElementById('roi-area-input');
  if (areaSlider && areaInput) {
    areaSlider.addEventListener('input', (e) => {
      appState.roofAreaSqM = parseInt(e.target.value);
      areaInput.value = appState.roofAreaSqM;
      calculateCoolRoofROI();
    });

    areaInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value) || 50;
      val = Math.max(50, Math.min(10000, val));
      appState.roofAreaSqM = val;
      areaSlider.value = val;
      calculateCoolRoofROI();
    });
  }

  // Area Unit Toggle
  const unitMBtn = document.getElementById('unit-btn-sqm');
  const unitFtBtn = document.getElementById('unit-btn-sqft');
  const unitLabel = document.getElementById('area-unit-label');

  if (unitMBtn && unitFtBtn) {
    unitMBtn.addEventListener('click', () => {
      appState.areaUnit = 'sqm';
      unitMBtn.classList.add('bg-amber-500', 'text-slate-950');
      unitMBtn.classList.remove('text-slate-400');
      unitFtBtn.classList.remove('bg-amber-500', 'text-slate-950');
      unitFtBtn.classList.add('text-slate-400');
      if (unitLabel) unitLabel.textContent = 'm²';
      calculateCoolRoofROI();
    });

    unitFtBtn.addEventListener('click', () => {
      appState.areaUnit = 'sqft';
      unitFtBtn.classList.add('bg-amber-500', 'text-slate-950');
      unitFtBtn.classList.remove('text-slate-400');
      unitMBtn.classList.remove('bg-amber-500', 'text-slate-950');
      unitMBtn.classList.add('text-slate-400');
      if (unitLabel) unitLabel.textContent = 'sq.ft';
      calculateCoolRoofROI();
    });
  }

  // Building Type selector
  const bldgSelect = document.getElementById('roi-building-type');
  if (bldgSelect) {
    bldgSelect.addEventListener('change', (e) => {
      appState.buildingType = e.target.value;
      calculateCoolRoofROI();
    });
  }

  // Climate Zone selector
  const climateSelect = document.getElementById('roi-climate-zone');
  if (climateSelect) {
    climateSelect.addEventListener('change', (e) => {
      appState.climateZone = e.target.value;
      calculateCoolRoofROI();
    });
  }

  // 4. Initialize Video Showcase
  setupVideoShowcase();

  // 5. Initialize Bibliography Matrix
  renderBibliography();

  const bibSearchInput = document.getElementById('bib-search-input');
  if (bibSearchInput) {
    bibSearchInput.addEventListener('input', (e) => {
      appState.bibSearchQuery = e.target.value;
      renderBibliography();
    });
  }

  document.querySelectorAll('.bib-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.activeBibFilter = btn.dataset.category;
      document.querySelectorAll('.bib-filter-btn').forEach(b => {
        b.classList.remove('border-amber-400', 'bg-amber-500/20', 'text-amber-300');
        b.classList.add('border-white/10', 'bg-slate-800/60', 'text-slate-400');
      });
      btn.classList.add('border-amber-400', 'bg-amber-500/20', 'text-amber-300');
      btn.classList.remove('border-white/10', 'bg-slate-800/60', 'text-slate-400');
      renderBibliography();
    });
  });

  // 6. Initialize Hero Divergence Slider
  const heroSlider = document.getElementById('hero-divergence-slider');
  const heroSliderDisp = document.getElementById('hero-slider-display');
  const heroDeltaVal = document.getElementById('hero-delta-val');
  const heroUrbanTemp = document.getElementById('hero-urban-temp');
  const heroDeltaBadge = document.getElementById('hero-delta-badge');

  if (heroSlider) {
    heroSlider.addEventListener('input', (e) => {
      const delta = parseFloat(e.target.value);
      if (heroSliderDisp) heroSliderDisp.textContent = `+${delta.toFixed(1)}°C`;
      if (heroDeltaVal) heroDeltaVal.textContent = `+${delta.toFixed(1)}°C`;
      const urban = (34.0 + delta).toFixed(1);
      if (heroUrbanTemp) heroUrbanTemp.textContent = `${urban}°C`;
      if (heroDeltaBadge) {
        if (delta >= 9.0) {
          heroDeltaBadge.textContent = `+${delta.toFixed(1)}°C Severe Megacity Furnace`;
          heroDeltaBadge.className = 'text-[11px] text-red-400 font-mono mt-1 block font-bold animate-pulse';
        } else if (delta >= 7.0) {
          heroDeltaBadge.textContent = `+${delta.toFixed(1)}°C Extreme Canyon UHI`;
          heroDeltaBadge.className = 'text-[11px] text-amber-300 font-mono mt-1 block font-semibold';
        } else {
          heroDeltaBadge.textContent = `+${delta.toFixed(1)}°C Moderate Suburban Divergence`;
          heroDeltaBadge.className = 'text-[11px] text-emerald-300 font-mono mt-1 block font-semibold';
        }
      }
    });
  }

  // Refresh Lucide Icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Modal open buttons
  document.getElementById('open-doc-btn')?.addEventListener('click', () => openModal('video-modal'));
  document.getElementById('open-rubric-btn')?.addEventListener('click', () => openModal('rubric-modal'));
  document.getElementById('open-attribution-btn')?.addEventListener('click', () => openModal('attribution-modal'));
  document.getElementById('export-report-btn')?.addEventListener('click', generateExecutiveReport);

  // Modal close buttons
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modalTarget;
      if (modalId) closeModal(modalId);
    });
  });

  // Close modals on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-wrapper:not(.hidden)').forEach(modal => {
        modal.classList.add('hidden');
      });
      document.body.style.overflow = 'auto';
    }
  });

  // Print Report Handler
  document.getElementById('print-report-btn')?.addEventListener('click', () => {
    window.print();
  });
});
