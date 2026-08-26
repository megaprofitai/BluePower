/* =========================================================
   BLUEPOWER — rent: iranga ir piesiniai
   SVG piesiniai perkelti is ankstesnio demo be pakeitimu.
   KAINOS PRELIMINARIOS (rinkos) — tikslinamos su savininku.

   Keiciant piesinius i tikras nuotraukas:
     PRODUCTS[n].photo = 'assets/units/aquajet-20.jpg'
   Jei laukas 'photo' yra, rent.js naudos nuotrauka vietoj SVG.
   ========================================================= */

function svgWrap(inner){
  return `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="stl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7d4e2"/><stop offset="1" stop-color="#93a7bc"/></linearGradient>
    <linearGradient id="stlL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6edf4"/><stop offset="1" stop-color="#bccbdb"/></linearGradient>
    <linearGradient id="nvy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d3a5f"/><stop offset="1" stop-color="#0e2038"/></linearGradient>
    <linearGradient id="org" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f68d3f"/><stop offset="1" stop-color="#e06a1a"/></linearGradient>
  </defs>
  <ellipse cx="200" cy="212" rx="150" ry="14" fill="#0c1a2c" opacity="0.09"/>
  ${inner}
</svg>`;
}

const ART = {
  pump20: svgWrap(`
    <!-- skid frame -->
    <rect x="80" y="192" width="240" height="12" rx="4" fill="url(#org)"/>
    <rect x="92" y="176" width="10" height="20" fill="#c65d14"/>
    <rect x="298" y="176" width="10" height="20" fill="#c65d14"/>
    <!-- engine block -->
    <rect x="98" y="112" width="120" height="82" rx="8" fill="url(#nvy)"/>
    <rect x="106" y="122" width="104" height="10" rx="3" fill="#33517a"/>
    <rect x="106" y="138" width="104" height="10" rx="3" fill="#33517a"/>
    <rect x="106" y="154" width="104" height="10" rx="3" fill="#33517a"/>
    <!-- exhaust -->
    <rect x="122" y="86" width="12" height="30" rx="4" fill="url(#stl)"/>
    <rect x="118" y="78" width="20" height="12" rx="4" fill="#7d92a8"/>
    <!-- pump head -->
    <rect x="226" y="128" width="86" height="66" rx="8" fill="url(#stl)"/>
    <circle cx="252" cy="150" r="11" fill="#617a93"/>
    <circle cx="252" cy="150" r="6.5" fill="#eef4fa"/>
    <circle cx="286" cy="150" r="11" fill="#617a93"/>
    <circle cx="286" cy="150" r="6.5" fill="#eef4fa"/>
    <rect x="238" y="170" width="62" height="12" rx="4" fill="#7d92a8"/>
    <!-- control panel -->
    <rect x="150" y="90" width="46" height="30" rx="5" fill="#f2f7fb" stroke="#9db0c3"/>
    <rect x="156" y="96" width="20" height="8" rx="2" fill="#4da3ff"/>
    <circle cx="186" cy="100" r="3.5" fill="#f0782a"/>
    <rect x="156" y="108" width="34" height="4" rx="2" fill="#c1cfdd"/>
    <!-- HP hose -->
    <path d="M312 160 C 348 160 352 130 352 104 C 352 84 336 76 322 82" fill="none" stroke="#22384f" stroke-width="7" stroke-linecap="round"/>
    <text x="108" y="188" font-family="Inter,Arial" font-weight="800" font-size="11" fill="#9fd0ff" letter-spacing="1">BLUEPOWER</text>
  `),
  pump30: svgWrap(`
    <!-- 14ft container -->
    <rect x="66" y="86" width="268" height="112" rx="6" fill="url(#nvy)"/>
    ${Array.from({length:12},(_,i)=>`<rect x="${80+i*19}" y="94" width="7" height="96" rx="2" fill="#20406a" />`).join('')}
    <rect x="66" y="86" width="268" height="16" rx="6" fill="#274d7c"/>
    <!-- door -->
    <rect x="292" y="94" width="34" height="96" rx="3" fill="#16304f" stroke="#2f5583" stroke-width="1.5"/>
    <rect x="304" y="130" width="9" height="22" rx="3" fill="#8fa6bd"/>
    <!-- vents -->
    <rect x="82" y="108" width="30" height="22" rx="3" fill="#0a1626"/>
    <rect x="86" y="112" width="22" height="3" fill="#33517a"/><rect x="86" y="118" width="22" height="3" fill="#33517a"/><rect x="86" y="124" width="22" height="3" fill="#33517a"/>
    <!-- orange stripe + brand -->
    <rect x="66" y="170" width="268" height="9" fill="url(#org)"/>
    <text x="128" y="152" font-family="Inter,Arial" font-weight="900" font-size="20" letter-spacing="1.5"><tspan fill="#4da3ff">BLUE</tspan><tspan fill="#fff">POWER</tspan></text>
    <!-- feet -->
    <rect x="74" y="198" width="18" height="10" fill="#22384f"/>
    <rect x="308" y="198" width="18" height="10" fill="#22384f"/>
    <!-- hose to ground -->
    <path d="M334 150 C 366 152 372 176 356 196" fill="none" stroke="#22384f" stroke-width="7" stroke-linecap="round"/>
  `),
  pump50: svgWrap(`
    <!-- 20ft container, lighter -->
    <rect x="40" y="90" width="320" height="108" rx="6" fill="url(#stl)"/>
    ${Array.from({length:15},(_,i)=>`<rect x="${54+i*19}" y="98" width="7" height="92" rx="2" fill="#7f95ab"/>`).join('')}
    <rect x="40" y="90" width="320" height="14" rx="6" fill="#d5dfe9"/>
    <!-- double doors open hint -->
    <rect x="318" y="98" width="36" height="92" rx="3" fill="#617a93" stroke="#8fa6bd" stroke-width="1.5"/>
    <rect x="330" y="132" width="8" height="20" rx="3" fill="#dfe8f0"/>
    <!-- navy band + brand -->
    <rect x="40" y="162" width="320" height="22" fill="url(#nvy)"/>
    <text x="58" y="178" font-family="Inter,Arial" font-weight="900" font-size="14" letter-spacing="1.2"><tspan fill="#4da3ff">BLUE</tspan><tspan fill="#fff">POWER</tspan></text>
    <text x="252" y="178" font-family="Inter,Arial" font-weight="700" font-size="10" fill="#9fb4ca" letter-spacing="1">HIGH FLOW &middot; 166 L/MIN</text>
    <!-- feet -->
    <rect x="50" y="198" width="18" height="10" fill="#67809a"/>
    <rect x="332" y="198" width="18" height="10" fill="#67809a"/>
    <!-- twin hoses -->
    <path d="M360 140 C 384 142 388 168 374 194" fill="none" stroke="#22384f" stroke-width="7" stroke-linecap="round"/>
    <path d="M360 122 C 392 126 396 164 384 196" fill="none" stroke="#44607c" stroke-width="5" stroke-linecap="round" opacity=".55"/>
  `),
  vertidrive: svgWrap(`
    <!-- steel wall -->
    <rect x="52" y="34" width="296" height="150" rx="6" fill="url(#stlL)"/>
    <line x1="52" y1="84" x2="348" y2="84" stroke="#a4b7c9" stroke-width="2"/>
    <line x1="52" y1="134" x2="348" y2="134" stroke="#a4b7c9" stroke-width="2"/>
    <line x1="150" y1="34" x2="150" y2="184" stroke="#a4b7c9" stroke-width="2"/>
    <line x1="250" y1="34" x2="250" y2="184" stroke="#a4b7c9" stroke-width="2"/>
    <!-- cleaned swath -->
    <rect x="168" y="88" width="44" height="94" fill="#f2f7fc" opacity=".9"/>
    <!-- crawler robot -->
    <g transform="translate(158,74)">
      <rect x="0" y="0" width="64" height="40" rx="9" fill="url(#nvy)"/>
      <rect x="6" y="-8" width="52" height="14" rx="6" fill="url(#org)"/>
      <circle cx="10" cy="42" r="9" fill="#22384f" stroke="#8fa6bd" stroke-width="2.5"/>
      <circle cx="54" cy="42" r="9" fill="#22384f" stroke="#8fa6bd" stroke-width="2.5"/>
      <circle cx="10" cy="-2" r="7" fill="#22384f" stroke="#8fa6bd" stroke-width="2.5"/>
      <circle cx="54" cy="-2" r="7" fill="#22384f" stroke="#8fa6bd" stroke-width="2.5"/>
      <rect x="24" y="10" width="16" height="16" rx="4" fill="#4da3ff"/>
      <!-- spray -->
      <path d="M32 40 l-7 16 M32 40 l0 18 M32 40 l7 16" stroke="#7cc3ff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    </g>
    <!-- umbilical -->
    <path d="M222 88 C 290 60 330 96 344 150" fill="none" stroke="#22384f" stroke-width="6" stroke-linecap="round"/>
    <text x="62" y="176" font-family="Inter,Arial" font-weight="700" font-size="10" fill="#8399ad" letter-spacing="1">STEEL SURFACE &middot; MAGNETIC ADHESION</text>
  `),
  conjet: svgWrap(`
    <!-- tracks -->
    <rect x="96" y="168" width="120" height="30" rx="15" fill="#22384f"/>
    <circle cx="112" cy="183" r="9" fill="#8fa6bd"/><circle cx="156" cy="183" r="9" fill="#8fa6bd"/><circle cx="200" cy="183" r="9" fill="#8fa6bd"/>
    <!-- body -->
    <rect x="100" y="128" width="116" height="44" rx="8" fill="url(#nvy)"/>
    <rect x="100" y="128" width="116" height="12" rx="6" fill="url(#org)"/>
    <rect x="112" y="148" width="34" height="16" rx="4" fill="#33517a"/>
    <text x="152" y="161" font-family="Inter,Arial" font-weight="800" font-size="10" fill="#9fd0ff" letter-spacing="1">CONJET</text>
    <!-- boom -->
    <rect x="196" y="98" width="14" height="48" rx="6" transform="rotate(24 203 122)" fill="url(#stl)"/>
    <rect x="216" y="66" width="12" height="52" rx="6" transform="rotate(-14 222 92)" fill="url(#stl)"/>
    <!-- cutting head -->
    <g transform="translate(232,52) rotate(18)">
      <rect x="-6" y="0" width="30" height="18" rx="5" fill="url(#org)"/>
      <rect x="2" y="18" width="14" height="26" rx="4" fill="#22384f"/>
    </g>
    <!-- water jet + concrete spall -->
    <path d="M244 96 l10 34 M244 96 l2 38 M244 96 l-6 36" stroke="#7cc3ff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>
    <circle cx="252" cy="146" r="4" fill="#b9c8d8"/><circle cx="238" cy="152" r="3" fill="#b9c8d8"/><circle cx="262" cy="154" r="2.6" fill="#b9c8d8"/>
    <!-- concrete edge -->
    <path d="M228 198 h132 v-34 l-24 8 -22 -12 -26 14 -20 -8 -18 12 z" fill="#c7d4e2"/>
    <path d="M228 198 h132" stroke="#9db0c3" stroke-width="3"/>
  `),
  vacexc: svgWrap(`
    <!-- chassis -->
    <rect x="58" y="168" width="286" height="14" rx="5" fill="#22384f"/>
    <circle cx="106" cy="192" r="17" fill="#16283e"/><circle cx="106" cy="192" r="8" fill="#8fa6bd"/>
    <circle cx="238" cy="192" r="17" fill="#16283e"/><circle cx="238" cy="192" r="8" fill="#8fa6bd"/>
    <circle cx="286" cy="192" r="17" fill="#16283e"/><circle cx="286" cy="192" r="8" fill="#8fa6bd"/>
    <!-- cab -->
    <path d="M58 168 v-52 a8 8 0 0 1 8-8 h44 a10 10 0 0 1 9 6 l12 26 v28 z" fill="url(#nvy)"/>
    <path d="M66 116 h40 l10 22 h-50 z" fill="#9fd0ff" opacity=".9"/>
    <!-- tank -->
    <rect x="140" y="96" width="204" height="72" rx="20" fill="url(#stl)"/>
    <rect x="140" y="96" width="204" height="18" rx="9" fill="#d5dfe9"/>
    <text x="168" y="140" font-family="Inter,Arial" font-weight="900" font-size="15" letter-spacing="1.2"><tspan fill="#1d4e8c">BLUE</tspan><tspan fill="#22384f">POWER</tspan></text>
    <!-- Ex marking -->
    <rect x="300" y="122" width="32" height="20" rx="4" fill="#f7d34c"/>
    <text x="306" y="137" font-family="Inter,Arial" font-weight="900" font-size="13" fill="#141d29">Ex</text>
    <!-- suction boom -->
    <rect x="196" y="52" width="90" height="13" rx="6" transform="rotate(8 196 58)" fill="url(#org)"/>
    <path d="M288 74 C 316 84 324 118 318 150" fill="none" stroke="#22384f" stroke-width="11" stroke-linecap="round"/>
    <path d="M318 150 l0 30" stroke="#22384f" stroke-width="11" stroke-linecap="round"/>
    <!-- debris -->
    <circle cx="318" cy="196" r="3.4" fill="#8fa2b6"/><circle cx="308" cy="202" r="2.6" fill="#8fa2b6"/><circle cx="328" cy="203" r="2.2" fill="#8fa2b6"/>
  `),
  vacload: svgWrap(`
    <!-- trailer frame -->
    <rect x="70" y="172" width="264" height="12" rx="4" fill="#22384f"/>
    <circle cx="252" cy="196" r="15" fill="#16283e"/><circle cx="252" cy="196" r="7" fill="#8fa6bd"/>
    <circle cx="292" cy="196" r="15" fill="#16283e"/><circle cx="292" cy="196" r="7" fill="#8fa6bd"/>
    <rect x="86" y="184" width="10" height="22" fill="#22384f"/>
    <!-- tank -->
    <rect x="76" y="102" width="252" height="70" rx="24" fill="url(#nvy)"/>
    <rect x="76" y="102" width="252" height="16" rx="8" fill="#274d7c"/>
    <text x="116" y="146" font-family="Inter,Arial" font-weight="900" font-size="15" letter-spacing="1.2"><tspan fill="#4da3ff">BLUE</tspan><tspan fill="#fff">POWER</tspan></text>
    <!-- cyclone dome -->
    <ellipse cx="128" cy="100" rx="26" ry="12" fill="url(#stl)"/>
    <rect x="112" y="76" width="32" height="26" rx="8" fill="url(#stl)"/>
    <!-- filter unit -->
    <rect x="236" y="70" width="52" height="34" rx="7" fill="url(#org)"/>
    <rect x="244" y="78" width="36" height="5" rx="2" fill="#b24f0e"/><rect x="244" y="88" width="36" height="5" rx="2" fill="#b24f0e"/>
    <!-- Ex marking -->
    <rect x="290" y="128" width="30" height="20" rx="4" fill="#f7d34c"/>
    <text x="296" y="143" font-family="Inter,Arial" font-weight="900" font-size="13" fill="#141d29">Ex</text>
    <!-- suction hose -->
    <path d="M328 140 C 362 146 368 176 352 200" fill="none" stroke="#22384f" stroke-width="10" stroke-linecap="round"/>
  `)
};

/* ---------- product data (sample / demo) ---------- */

/* ---------- iranga (pavyzdiniai duomenys) ---------- */
const PRODUCTS = [
  {
    id:'aq20', cat:'pump', grid:'gridPumps', art:'pump20',
    name:'Aquajet 20 HT Jetting Pump',
    tagline:'Compact 2 800 bar unit for surface preparation, coating removal and industrial cleaning.',
    desc:'A compact skid-mounted ultra-high-pressure unit that fits where containers don\u2019t. The 20 HT is the workhorse for surface preparation, paint and coating removal, tube bundle cleaning and light concrete scarification \u2014 easy to mobilise, simple to operate, and fully serviced before every hire.',
    chips:['2 800 bar','40 L/min','Diesel'],
    table:[['Max pressure','2 800 bar'],['Flow rate','40 L/min'],['Drive','Diesel, Stage V'],['Format','Skid / trailer'],['Weight','~2 100 kg'],['Certification','CE \u00b7 SIR-inspected']],
    apps:['Surface preparation','Coating & paint removal','Heat exchangers','Tank cleaning'],
    week:24500, status:{free:true, taken:[4]}
  },
  {
    id:'aq30', cat:'pump', grid:'gridPumps', art:'pump30',
    name:'Aquajet 30 HT Jetting Pump',
    tagline:'Our 3 000 bar flagship in a 14-foot container \u2014 built for hydro-demolition and heavy jetting.',
    desc:'The most requested unit in our fleet. Housed in a 14-foot container with integrated tool storage, the 30 HT delivers a full 3 000 bar for hydro-demolition robots, concrete removal and the heaviest industrial cleaning jobs. Arrives ready to run \u2014 fuel and water are all you need.',
    chips:['3 000 bar','60 L/min','14-ft container'],
    table:[['Max pressure','3 000 bar'],['Flow rate','60 L/min'],['Drive','Diesel, Stage V'],['Format','14-ft container'],['Weight','~8 400 kg'],['Certification','CE \u00b7 SIR-inspected']],
    apps:['Hydro-demolition','Concrete removal','Robot operation','Heavy industrial cleaning'],
    week:32000, status:{free:false, taken:[0,1,2]}
  },
  {
    id:'aq50', cat:'pump', grid:'gridPumps', art:'pump50',
    name:'Aquajet 50 HT Jetting Pump',
    tagline:'High-flow 166 L/min unit in a 20-foot container \u2014 runs two operations at once.',
    desc:'When the job needs volume, the 50 HT delivers. With 166 litres per minute at 1 600 bar in a 20-foot container, it powers large hydro-demolition robots and supports two simultaneous operations. The unit of choice for bridge decks, dams and large-scale surface removal.',
    chips:['1 600 bar','166 L/min','20-ft container'],
    table:[['Max pressure','1 600 bar'],['Flow rate','166 L/min'],['Drive','Diesel, Stage V'],['Format','20-ft container'],['Weight','~11 900 kg'],['Certification','CE \u00b7 SIR-inspected']],
    apps:['Large-scale hydro-demolition','Bridge & dam rehabilitation','Dual-operator jetting','Runway cleaning'],
    week:36500, status:{free:true, taken:[]}
  },
  {
    id:'vm3', cat:'robot', grid:'gridRobots', art:'vertidrive',
    name:'Vertidrive M3',
    tagline:'Magnetic crawler robot for high-pressure washing and grinding of vertical steel.',
    desc:'A remote-operated magnetic crawler that climbs vertical and overhead steel \u2014 ship hulls, storage tanks, offshore structures. It removes coatings, rust and marine growth up to 10\u00d7 faster than hand lancing, and keeps your operators safely on the ground instead of on ropes.',
    chips:['Magnetic','Remote operated','Up to 2 500 bar'],
    table:[['Adhesion','Permanent magnets'],['Operation','Remote control'],['Working pressure','Up to 2 500 bar'],['Surfaces','Vertical / overhead steel'],['Cleaning width','~300 mm'],['Certification','CE']],
    apps:['Ship hulls','Storage tanks','Offshore structures','Coating removal'],
    week:18500, status:{free:true, taken:[6]}
  },
  {
    id:'cj557', cat:'robot', grid:'gridRobots', art:'conjet',
    name:'Conjet 557 HT Robot',
    tagline:'High-pressure hydro-demolition robot \u2014 efficient and safe removal of e.g. concrete.',
    desc:'Precision concrete removal without vibrations or micro-cracking. The Conjet 557 removes deteriorated concrete to a programmed depth while leaving rebar clean and intact \u2014 the method of choice for bridges, tunnels, dams and parking structures. One operator, no confined-space entry, no jackhammer damage.',
    chips:['Hydro-demolition','Programmable depth','Tracked'],
    table:[['Type','Hydro-demolition robot'],['Removal depth','Programmable'],['Reach','Multi-position arm'],['Drive','Tracked, remote'],['Pairs with','Aquajet 30 HT / 50 HT'],['Certification','CE']],
    apps:['Bridge decks','Tunnels & dams','Concrete rehabilitation','Selective demolition'],
    week:42000, status:{free:false, taken:[0,1]}
  },
  {
    id:'vexc', cat:'atex', grid:'gridAtex', art:'vacexc',
    name:'Vacuum Excavator',
    tagline:'ATEX-approved suction excavation for safe digging around live infrastructure.',
    desc:'Excavate around cables, pipelines and live process equipment without a single strike risk. ATEX certification means it works inside explosive atmospheres \u2014 refineries, silo plants, chemical sites \u2014 where conventional excavation is not an option.',
    chips:['ATEX','Suction excavation','Zone-rated'],
    table:[['Certification','ATEX (Ex zones)'],['Method','Air suction excavation'],['Applications','Cables, pipes, process areas'],['Spoil handling','On-board tank'],['Operation','1\u20132 operators'],['Availability','With or without operator']],
    apps:['Utility exposure','Refineries & silos','Cable trenching','Ex-zone works'],
    week:21000, status:{free:true, taken:[]}
  },
  {
    id:'vload', cat:'atex', grid:'gridAtex', art:'vacload',
    name:'Vacuum Loader',
    tagline:'ATEX-approved vacuum loader for dust, powders, sludge and industrial residues.',
    desc:'Bulk recovery of dust, powders, granulates and sludge \u2014 including combustible materials \u2014 in ATEX-classified areas. The natural partner to our silo cleaning operations: what the BinWhip loosens, the vacuum loader removes, without manual entry or airborne dust.',
    chips:['ATEX','Wet & dry','High capacity'],
    table:[['Certification','ATEX (Ex zones)'],['Media','Dust, powder, sludge, granulate'],['Loading','Continuous vacuum'],['Discharge','Tipping / big-bag'],['Operation','1 operator'],['Availability','With or without operator']],
    apps:['Silo & tank residues','Combustible dust','Spill recovery','Filter & duct cleaning'],
    week:19500, status:{free:true, taken:[2]}
  }
];
