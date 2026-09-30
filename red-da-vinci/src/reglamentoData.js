// Datos públicos del Escalafón y del Reglamento de la Red Da Vinci.
// Para cambiar un texto de la página, editá este archivo.
// Marcas dentro de los textos:  **negrita**   y   [[punto a definir]]  (se muestra como etiqueta amarilla)

export const LEVELS = [
  {
    id: 'aprendiz',
    icon: '🌱',
    name: 'Aprendiz',
    how: 'Registrarte y aceptar las reglas de la red.',
    unlocks: 'Publicar obra en exhibición, con revisión previa antes de que se vea en el feed.'
  },
  {
    id: 'discipulo',
    icon: '🎨',
    name: 'Discípulo',
    how: 'Perfil verificado por la curaduría y 3 obras aprobadas, sin infracciones.',
    unlocks: 'Publicar sin revisión previa.'
  },
  {
    id: 'artesano',
    icon: '🛠️',
    name: 'Artesano',
    how: '60 días de antigüedad, 10 obras aprobadas y sin denuncias confirmadas en los últimos 90 días.',
    unlocks: 'Tokenizar obra (NFT único y tokens fraccionados).'
  },
  {
    id: 'maestro',
    icon: '🏛️',
    name: 'Maestro',
    how: 'Ser Artesano y tener 5 artistas invitados que ya llegaron a Artesano.',
    unlocks: 'Beneficios a definir (por ejemplo destacar obra y proponer muestras).'
  },
  {
    id: 'medici',
    icon: '👑',
    name: 'Medici',
    how: 'Maestro con 12 meses de antigüedad y aporte sostenido a la comunidad, aprobado por el consejo de curadores. Las curadoras fundadoras son Medici desde el inicio.',
    unlocks: 'Participar del Fondo Medici.'
  }
];

export const REGLAMENTO = [
  {
    title: 'Objeto y principios',
    blocks: [
      { type: 'p', text: 'La Red Da Vinci es una red de artistas que publican, exhiben y comercializan su obra, y que se sostiene con el aporte de sus integrantes. Se rige por estos principios:' },
      { type: 'ul', items: [
        '**Transparencia:** las reglas, los porcentajes y los movimientos de dinero son públicos.',
        '**Reciprocidad:** quien aporta a la red tiene un camino claro para participar de sus beneficios.',
        '**Respeto por la autoría:** cada artista es responsable de que su obra sea propia.',
        '**Sostenibilidad:** una parte de los ingresos mantiene la plataforma funcionando.'
      ] }
    ]
  },
  {
    title: 'Definiciones',
    blocks: [
      { type: 'table', headers: ['Término', 'Significado'], rows: [
        ['Red / Cooperativa', 'La Red Da Vinci, su comunidad y su equipo. [[figura jurídica que la representa]]'],
        ['Plataforma', 'La aplicación y sitio web de la Red Da Vinci.'],
        ['Artista', 'Persona registrada que publica obra propia en la Plataforma.'],
        ['Obra', 'Creación artística publicada en la Plataforma por su autor.'],
        ['NFT único', 'Token que representa la titularidad de una obra física individual.'],
        ['Token fraccionado', 'Una de las partes en que se divide una obra o colección para su venta.'],
        ['Tenedor', 'Persona que posee uno o más tokens fraccionados de una obra.'],
        ['Medici', 'El nivel más alto del escalafón. Sus integrantes participan del Fondo Medici.'],
        ['Curador', 'Integrante del equipo que revisa perfiles y obras.'],
        ['Fondo Medici', 'Monto acumulado del 5% de cada ingreso, destinado a los Medici.'],
        ['Ingreso', 'Todo dinero que genere una obra o la Red: ventas, regalías, exposiciones, muestras u otros. [[base de cálculo: monto bruto o neto de comisiones]]']
      ] }
    ]
  },
  {
    title: 'Reglas de conducta',
    blocks: [
      { type: 'p', text: 'Todo integrante debe cumplir estas reglas. Las publicaciones que no las cumplan serán bloqueadas o eliminadas, y las infracciones repetidas pueden llevar a la suspensión de la cuenta. Las cuentas nuevas pasan por revisión antes de que sus publicaciones sean visibles, y cualquier usuario puede denunciar contenido que no respete las reglas.' },
      { type: 'rules' }
    ]
  },
  {
    title: 'Escalafón de estatus',
    blocks: [
      { type: 'p', text: 'Los integrantes avanzan por cinco niveles. Las cifras son una propuesta inicial y pueden ajustarse antes del lanzamiento.' },
      { type: 'levels' },
      { type: 'p', text: '**Invitaciones.** Cada integrante tiene un código de invitación personal. Un artista invitado cuenta cuando llega a Artesano, no antes. Para ser Maestro hay que tener 5 invitados que ya llegaron a Artesano.' },
      { type: 'p', text: '**Medici fundadores.** El equipo de curadores integra el nivel Medici desde el inicio de la Red, y los artistas que cada curadora elige (hasta 5) entran directo como Artesanos. [[condición permanente o mientras ejerzan la curaduría]]' }
    ]
  },
  {
    title: 'Distribución de ingresos',
    blocks: [
      { type: 'p', text: 'Los ingresos de cada obra se reparten según el tipo de tokenización. Los ejemplos usan una venta de 1.000 USDT.' },
      { type: 'h', text: 'NFT único' },
      { type: 'table', headers: ['Destinatario', 'Porcentaje', 'Ejemplo'], rows: [
        ['Artista', '80%', '800 USDT'],
        ['Fondo Medici', '5%', '50 USDT'],
        ['Plataforma', '15%', '150 USDT'],
        ['**Total**', '**100%**', '**1.000 USDT**']
      ] },
      { type: 'h', text: 'Tokens fraccionados' },
      { type: 'table', headers: ['Destinatario', 'Porcentaje', 'Ejemplo'], rows: [
        ['Artista', '60%', '600 USDT'],
        ['Tenedores de tokens', '20%', '200 USDT'],
        ['Fondo Medici', '5%', '50 USDT'],
        ['Plataforma', '15%', '150 USDT'],
        ['**Total**', '**100%**', '**1.000 USDT**']
      ] },
      { type: 'h', text: 'Otros ingresos' },
      { type: 'p', text: 'Los ingresos por exposiciones, muestras o cualquier otra actividad vinculada a una obra se reparten con el esquema correspondiente al tipo de esa obra. Los ingresos de la Red que no estén vinculados a una obra específica: [[cómo se reparten]]. Reventas: [[si generan ingresos para la Red y cómo se reparten]].' }
    ]
  },
  {
    title: 'Tokens fraccionados: qué recibe el tenedor',
    blocks: [
      { type: 'p', text: 'Quien compra tokens fraccionados recibe dos cosas:' },
      { type: 'ol', items: [
        '**Una impresión de la obra**, cuya calidad depende del nivel del token adquirido.',
        '**El 20% de los ingresos de esa obra**, repartido entre todos los tenedores en proporción a los tokens que posee cada uno, mientras conserve los tokens. Incluye los ingresos por exposiciones y muestras.'
      ] },
      { type: 'p', text: 'El tenedor no recibe la obra física. Niveles de impresión (tamaño, soporte y calidad): [[tabla de niveles]]. Costos de producción y envío: [[quién los paga]].' }
    ]
  },
  {
    title: 'NFT único: qué recibe el comprador',
    blocks: [
      { type: 'p', text: 'Quien compra un NFT único recibe la **obra física** y su certificado de autenticidad. No participa de los ingresos posteriores de la obra. Envío, seguro y aduana: [[quién los paga]]. Derechos de autor que conserva el artista: [[definir con el abogado]].' }
    ]
  },
  {
    title: 'Fondo Medici',
    blocks: [
      { type: 'ul', items: [
        'El Fondo Medici está formado por el **5% de cada ingreso** de la Red.',
        'Se acumula desde el lanzamiento, **aunque todavía no haya integrantes en el nivel Medici**, y no se utiliza para otro fin.',
        'Su saldo y cada aporte son públicos y quedan registrados en blockchain.',
        'Se reparte entre los Medici vigentes en la fecha de cada reparto: [[partes iguales o según puntos de aporte]].',
        'Los repartos se realizan cada 3 meses (propuesta). Primer reparto: [[fecha o condición]].',
        'Quien asciende a Medici participa del saldo acumulado [[desde su ingreso o también del acumulado anterior]].'
      ] }
    ]
  },
  {
    title: 'Fondo de la plataforma',
    blocks: [
      { type: 'p', text: 'El 15% de cada ingreso se destina **exclusivamente** a sostener la Plataforma, y sus cuentas son públicas. Incluye servidores y almacenamiento, desarrollo, moderación, costos de blockchain y gastos de la Red. Rendición de cuentas: [[periodicidad y responsable]].' }
    ]
  },
  {
    title: 'Preparación y lanzamiento',
    blocks: [
      { type: 'p', text: 'Antes del lanzamiento público habrá un período de preparación de 2 meses para difundir la Red, incorporar artistas y conseguir usuarios. Durante ese tiempo este Reglamento está publicado y visible. Los ingresos se cuentan desde la fecha de lanzamiento: [[fecha]].' }
    ]
  },
  {
    title: 'Pérdida y suspensión del estatus',
    blocks: [
      { type: 'p', text: 'Un integrante puede perder su nivel o ser suspendido por:' },
      { type: 'ul', items: [
        'Infracciones a las reglas de conducta, en especial publicar obra ajena como propia.',
        'Fraude, por ejemplo cuentas falsas para cumplir requisitos de ascenso.',
        'Inactividad mayor a 12 meses (propuesta).'
      ] },
      { type: 'p', text: 'Antes de aplicar una sanción se le avisa al integrante y se le da la oportunidad de responder durante 10 días. Montos ya devengados y tokens que posea: [[qué pasa con ellos]].' }
    ]
  },
  {
    title: 'Transparencia',
    blocks: [
      { type: 'p', text: 'La Red mantiene un sitio público con este Reglamento vigente y su historial de cambios, la lista de integrantes Medici, el saldo y los movimientos del Fondo Medici, y un informe trimestral de ingresos y distribución.' }
    ]
  },
  {
    title: 'Contrato inteligente',
    blocks: [
      { type: 'p', text: 'El reparto de ingresos y el Fondo Medici se ejecutarán mediante un contrato inteligente en [[blockchain a definir]], con pagos en [[moneda estable a definir]]. El contrato se limita a lo que puede medirse sin discusión: recibir los cobros, dividirlos según los porcentajes del reglamento, acumular el Fondo Medici y pagar a quienes correspondan.' },
      { type: 'p', text: 'Los ascensos de nivel y las sanciones no las decide el contrato: las decide la Red según este Reglamento, y el contrato recibe la lista actualizada de Medici.' },
      { type: 'p', text: 'Antes de manejar fondos reales, el contrato será auditado por un tercero independiente. Mecanismo de pausa ante errores: [[definir]].' }
    ]
  },
  {
    title: 'Modificaciones',
    blocks: [
      { type: 'p', text: 'Este Reglamento puede modificarse con aviso previo de 30 días (propuesta) y aprobación de [[quién decide]]. Los cambios no afectan derechos ya adquiridos por los tenedores de tokens sobre las obras que compraron.' }
    ]
  },
  {
    title: 'Conflictos',
    blocks: [
      { type: 'p', text: 'Ante un conflicto, las partes intentarán resolverlo por mediación. Jurisdicción y ley aplicable: [[definir]].' }
    ]
  },
  {
    title: 'Vigencia',
    blocks: [
      { type: 'p', text: 'Este Reglamento rige desde la fecha de lanzamiento y se publica junto con la Plataforma.' }
    ]
  }
];
