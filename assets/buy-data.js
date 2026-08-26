/* =========================================================
   BLUEPOWER — buy: parduodama iranga
   -----------------------------------------------------------
   Duomenys paimti is Conjet gamintojo lapu (PDF, 2021):
     Conjet-ACR_-Robot-327.pdf / -557XL.pdf / -101-Nalta.pdf
   Nuotraukos istrauktos is tu paciu PDF (juodo fono renderiai).

   condition: 'new' arba 'used'  -> zenkliukas kortelėje
   price: null -> "Price on request". Irasius skaiciu -> "from X kr".
   ========================================================= */

const BUY_ITEMS = [
  {
    id: 'acr327',
    brand: 'Conjet',
    name: 'Conjet ACR 327',
    condition: 'new',
    photo: 'assets/units/conjet-327.webp',
    price: null,

    tagline: 'Compact and flexible — passes through an opening under 0.9 m.',
    taglineNo: 'Kompakt og fleksibel — passerer gjennom åpninger under 0,9 m.',
    chips: ['1 180 kg', '1 600 mm cut', 'Electric'],

    desc: 'Robot 327 is fully automated via the Conjet ONE control system and was developed to work in confined spaces and areas. Arm and tool variations combine to match the project: the high-pressure lance takes either a single oscillating nozzle or a double nozzle assembly, and a ship cleaning and paint removal rotor head can be selected. Arm and feed beam rotate 360°, and removable side covers give optimum reach in corners.',
    descNo: 'Robot 327 er helautomatisk via ConjetONE-styresystemet og er utviklet for trange rom og områder. Armer og verktøy kan kombineres etter prosjektets behov: høytrykkslansen tar enten én oscillerende dyse eller en dobbeltdyse, og et rotorhode for skipsrengjøring og malingsfjerning kan velges. Arm og matebjelke roterer 360°, og avtakbare sidedeksler gir optimal rekkevidde i hjørner.',

    apps: ['Parking decks', 'Narrow tunnels', 'Pipes'],
    appsNo: ['Parkeringsdekk', 'Trange tunneler', 'Rør'],

    specs: [
      ['Width — carrier', '820–1 200 mm'],
      ['Cutting width', '1 600 mm'],
      ['Length', '2 850 mm'],
      ['Height', '1 420 mm'],
      ['Cutting height — overhead', '2 000 mm / 2 850 mm*'],
      ['Cutting height — vertical', '2 400 mm / 3 300 mm*'],
      ['Weight / with counterweight', '1 180 kg / 1 330 kg'],
      ['Maximum reaction force', '1 500 N'],
      ['Power supply', '3-phase 380–480 V, 16 A · 3-phase 200 V, 32 A'],
      ['Certification', 'CE · EMC']
    ],
    note: '* with extension arm'
  },

  {
    id: 'acr557',
    brand: 'Conjet',
    name: 'Conjet ACR 557XL',
    condition: 'new',
    photo: 'assets/units/conjet-557xl.webp',
    price: null,

    tagline: 'Exceptional reach and flexibility — up to 6.3 m vertical.',
    taglineNo: 'Eksepsjonell rekkevidde og fleksibilitet — opptil 6,3 m vertikalt.',
    chips: ['2 700 kg', '6,3 m reach', 'Diesel / electric'],

    desc: 'The track-driven Robot 557XL is equipped with a multi-purpose arm allowing full flexibility. Together with an adjustable chassis it is a versatile and compact solution with extended reach and stability. The tracks extend and the main body slides back up to 400 mm to shift the centre of gravity, and an automatic Stability Control System monitors the feed beam position and warns the operator.',
    descNo: 'Den beltedrevne Robot 557XL har en flerbruksarm som gir full fleksibilitet. Sammen med et justerbart chassis er den en allsidig og kompakt løsning med utvidet rekkevidde og stabilitet. Beltene kan utvides og hovedkroppen skyves inntil 400 mm bakover for å flytte tyngdepunktet, og et automatisk stabilitetskontrollsystem overvåker matebjelkens posisjon og varsler operatøren.',

    apps: ['Parking decks', 'Bridges', 'Tunnels', 'High walls', 'Quays and docks'],
    appsNo: ['Parkeringsdekk', 'Broer', 'Tunneler', 'Høye vegger', 'Kaier og dokker'],

    specs: [
      ['Weight', '2 700 kg'],
      ['Length', '3 560 mm'],
      ['Width / with extended tracks', '1 200–1 900 mm'],
      ['Height, minimum', '1 750 mm'],
      ['Cutting height — vertical', '6 350 mm'],
      ['Cutting height — overhead', '5 900 mm'],
      ['Cutting below track level', '3 050 mm'],
      ['Cutting width', '2 100 mm'],
      ['Maximum reaction force', '3 000 N'],
      ['Power supply', 'Diesel 18,7 kW · Electric 3×380–480 V, 32 A'],
      ['Certification', 'CE · EMC']
    ],
    note: ''
  },

  {
    id: 'nalta101',
    brand: 'Conjet',
    name: 'Conjet 101 NALTA',
    condition: 'new',
    photo: 'assets/units/conjet-101.webp',
    price: null,

    tagline: "Efficient and portable — the world's smallest hydrodemolition robot.",
    taglineNo: 'Effektiv og portabel — verdens minste hydrodemoleringsrobot.',
    chips: ['3 000 bar', '90 kg unit', 'Works underwater'],

    desc: 'The Nalta is designed to work where space is limited, such as between a building and scaffolding, and can be dismantled into components light enough to be carried by one person. It allows selective concrete removal in narrow, confined areas inaccessible with other methods, and is operated remotely from up to 50 metres on horizontal, vertical or angled surfaces. Because no electricity is present at the cutting head, it can be used underwater for repairing bridge foundations and similar structures.',
    descNo: 'Nalta er laget for å arbeide der plassen er begrenset, for eksempel mellom en bygning og stillas, og kan demonteres i deler lette nok til å bæres av én person. Den gir selektiv betongfjerning i trange områder som er utilgjengelige med andre metoder, og fjernstyres fra inntil 50 meter på horisontale, vertikale eller skrå flater. Siden det ikke er strøm ved skjærehodet, kan den brukes under vann til reparasjon av brofundamenter og lignende konstruksjoner.',

    apps: ['Bridge bearing foundations', 'Dam surfaces and spillways', 'Dry docks and quay docks', 'Canals', 'Under water'],
    appsNo: ['Brolagerfundamenter', 'Damflater og flomløp', 'Tørrdokker og kaidokker', 'Kanaler', 'Under vann'],

    specs: [
      ['Length per section', '990 mm'],
      ['Weight per section', '8 kg'],
      ['Weight lance unit', '12 kg'],
      ['Weight step unit', '9 kg'],
      ['Weight hydraulic unit', '90 kg'],
      ['Maximum reaction force', '600 N'],
      ['Power supply', '1/3 phase, 50/60 Hz'],
      ['Maximum water pressure', '3 000 bar'],
      ['Certification', 'CE · EMC']
    ],
    note: ''
  }
];
