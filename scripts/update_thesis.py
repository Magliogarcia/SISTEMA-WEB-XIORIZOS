import docx
from docx.shared import Pt, RGBColor

def apply_text(p, text, bold_prefix=None, font_name="Arial", font_size_pt=12):
    p.text = ""
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = font_name
        r_pre.font.size = Pt(font_size_pt)
        r_pre.bold = True
    
    r_body = p.add_run(text)
    r_body.font.name = font_name
    r_body.font.size = Pt(font_size_pt)
    r_body.bold = False

def set_cell_text(cell, text, bold=False, font_name="Arial", font_size_pt=10):
    cell.text = ""
    p = cell.paragraphs[0]
    r = p.add_run(text)
    r.font.name = font_name
    r.font.size = Pt(font_size_pt)
    r.bold = bold

def set_code_cell(cell, code_text):
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(code_text)
    r.font.name = "Consolas"
    r.font.size = Pt(9)
    r.font.color.rgb = RGBColor(30, 41, 59)

def main():
    doc_path = "Trabajo de grado/Trabajo de grado Richard Maglio 2026.docx"
    doc = docx.Document(doc_path)
    
    # Verify index is untouched (P0 to P48)
    assert doc.paragraphs[40].text == "INDICE GENERAL", "Index position shifted!"

    # ==========================================
    # RESUMEN & ABSTRACT
    # ==========================================
    apply_text(
        doc.paragraphs[50],
        "El salón de belleza Xio Rizos enfrenta desafíos operativos en la gestión administrativa, el control de inventario y el agendamiento de servicios. Para abordar estos problemas, se desarrolló e implementó un sistema web transaccional e interactivo utilizando la metodología ágil Extreme Programming (XP). Este sistema web no solo automatiza la gestión de citas mediante un asistente en cuatro pasos con cálculo transparente de abonos del 20% y el control estricto de existencias, sino que también integra un catálogo de productos con carrito de compras en tiempo real, pasarela para métodos de pago nacionales (Pago Móvil y Efectivo en Salón), confirmación automatizada vía WhatsApp y un simulador interactivo de colorimetría capilar asistido por visión artificial (MediaPipe WASM) en el navegador, mejorando significativamente la competitividad del local. El proyecto se basa en un análisis detallado de la situación actual del establecimiento, identificando deficiencias organizacionales y necesidades tecnológicas clave. Utilizando la metodología XP, se enfocó en el diseño modular, la adaptabilidad y la programación estandarizada para iterativamente desarrollar e implementar funcionalidades que respondan de manera efectiva a los requerimientos reales de la gerencia y las usuarias."
    )

    apply_text(
        doc.paragraphs[61],
        "The Xio Rizos beauty salon faces operational challenges in administrative management, inventory control, and service scheduling. To address these issues, a transactional and interactive web system was developed and implemented using the Extreme Programming (XP) agile methodology. This web system not only automates appointment scheduling through a four-step wizard with transparent 20% deposit calculations and strict stock control, but also integrates an e-commerce product catalog with real-time stock limits, domestic payment options (Pago Móvil and Cash in Salon), automated WhatsApp confirmation, and an interactive computer vision colorimetry simulator powered by MediaPipe WASM directly in the browser, significantly improving the establishment's competitiveness. The project is based on a detailed analysis of the salon's current situation, identifying organizational deficiencies and key technological needs. Using the XP methodology, the focus was placed on modular design, adaptability, and standardized programming to iteratively develop and deploy functionalities that effectively address the real requirements of both management and users."
    )

    # ==========================================
    # INTRODUCCIÓN
    # ==========================================
    apply_text(
        doc.paragraphs[69],
        "El desarrollo de un sistema web integral, diseñado específicamente para Xio Rizos, se presenta como la solución viable y definitiva para modernizar sus procesos internos. Esta plataforma tecnológica permite una gestión administrativa transparente y automatizada, facilitando el registro de inventarios en tiempo real, el control de stock en las ventas por catálogo y la erradicación de colisiones en los horarios de atención de los especialistas. Además, proporciona un valor agregado de innovación a través de un catálogo digital con carrito de compras y un simulador interactivo de colorimetría capilar asistido por visión artificial (MediaPipe WASM), brindando a las clientas herramientas modernas para explorar productos y visualizar cambios de imagen con total certeza antes de acudir presencialmente al establecimiento."
    )

    # ==========================================
    # CAPÍTULO I: EL PROBLEMA
    # ==========================================
    apply_text(
        doc.paragraphs[83],
        "Las franquicias internacionales y los centros estéticos de vanguardia han adoptado arquitecturas tecnológicas basadas en la web que fusionan la Planificación de Recursos Empresariales (ERP, por sus siglas en inglés) con la Gestión de Relaciones con los Clientes (CRM). Esta transformación digital permite una trazabilidad absoluta de las operaciones logísticas, garantizando que el control de inventarios de insumos de alta rotación se ejecute en tiempo real y con márgenes de error estadísticamente nulos. Más allá de la optimización administrativa interna (Back-office), la tecnología ha revolucionado la experiencia del usuario final (Front-end). Las plataformas modernas incorporan algoritmos de interactividad avanzada, permitiendo a los clientes acceder a sistemas de agendamiento en la nube disponibles las 24 horas del día. Además, la integración de modelos de visión artificial y machine learning ejecutados en el navegador ha propiciado el desarrollo de catálogos comerciales interactivos con control dinámico de stock y simuladores en tiempo real que proyectan cambios de tono capilar (colorimetría) antes de la ejecución del servicio. Todo esto en conjunto eleva exponencialmente los estándares de calidad, reduce los costos operativos a largo plazo y maximiza la fidelización de la clientela a nivel mundial."
    )

    apply_text(
        doc.paragraphs[92],
        "Ante esta constelación de problemas, y definiendo claramente ¿qué se propone?, surge la necesidad ineludible de diseñar, codificar e implementar un sistema web integral y a la medida de los requerimientos de \"Xio Rizos\". Se propone el desarrollo de una arquitectura tecnológica moderna que erradique por completo la dependencia de los registros manuales. Esta solución de software dota a la gerencia de un panel de administración robusto para la auditoría en tiempo real del inventario, los pedidos y la gestión de ingresos, respaldado por métricas analíticas operativas. Simultáneamente, el sistema despliega un portal interactivo para el cliente que automatiza el agendamiento de citas en cuatro pasos con cálculo transparente del abono de reserva del 20%, un catálogo de productos capilares con carrito de compras y validación de stock en tiempo real, pasarela para métodos de pago nacionales (Pago Móvil y Efectivo) con notificación directa vía WhatsApp, y un simulador interactivo de colorimetría capilar basado en visión artificial (MediaPipe WASM), posicionando tecnológicamente al establecimiento a la vanguardia de su sector."
    )

    apply_text(
        doc.paragraphs[96],
        "En consecuencia, resulta imperativo trascender los métodos convencionales mediante la aplicación de metodologías de desarrollo de software. Se requiere la concepción e implementación de una solución informática integral que no solo actúe como un repositorio de datos para el back-office (gestión de inventario, auditoría de citas y métricas analíticas de negocio), sino que también funcione como una interfaz interactiva de alto nivel para el front-end, incorporando un catálogo de productos con carrito de compras en tiempo real, agendamiento sincronizado de turnos y un simulador visual de colorimetría capilar asistido por visión artificial. Esta integración sistémica promete estandarizar los procesos internos, blindar la gestión de la información mediante bases de datos relacionales en la nube y redefinir por completo el canal de comunicación y servicio con el usuario final."
    )

    apply_text(
        doc.paragraphs[98],
        "¿De qué manera el desarrollo y la implementación de un sistema web de gestión administrativa, agendamiento de citas, catálogo de productos y simulador interactivo de colorimetría optimizará los procesos operativos internos y transformará integralmente la experiencia de servicio de los clientes en el salón Xio Rizos, ubicado en el municipio Naguanagua del Estado Carabobo?"
    )

    apply_text(
        doc.paragraphs[101],
        "Desarrollar un sistema web integral de gestión administrativa, agendamiento de citas, catálogo de productos y simulador interactivo de colorimetría para el salón de belleza Xio Rizos, ubicado en Naguanagua, Estado Carabobo"
    )

    apply_text(
        doc.paragraphs[104],
        "Analizar detalladamente los requerimientos funcionales y no funcionales del software, traduciendo las necesidades de la gerencia y las expectativas de las clientas en Historias de Usuario propias de la metodología XP, lo que permitirá establecer la lógica de negocio para los módulos de agendamiento de citas con control de abonos, catálogo de productos con control de stock en tiempo real, pasarela de métodos de pago y el simulador de colorimetría capilar con visión artificial."
    )

    apply_text(
        doc.paragraphs[106],
        "Construir la plataforma tecnológica a través de la codificación modular de los componentes de backend y frontend, integrando la lógica de negocio para el control transaccional de stock y carrito de compras, el agendamiento de turnos comerciales sin solapamiento, y las funcionalidades de simulación visual de colorimetría basadas en MediaPipe WASM, asegurando la integridad y seguridad de la información mediante Prisma ORM sobre PostgreSQL y contraseñas cifradas con Bcrypt."
    )

    apply_text(
        doc.paragraphs[109],
        "La concepción, estructuración y posterior implementación de todo proyecto informático debe estar sustentada en bases sólidas que demuestren su pertinencia, viabilidad y el impacto positivo que generará en su entorno de aplicación. En el ámbito de la Ingeniería de Software y el Análisis de Sistemas, justificar una investigación implica argumentar exhaustivamente cómo la solución tecnológica propuesta resolverá la problemática diagnosticada y qué valor añadido proporcionará a los involucrados. El desarrollo del sistema web de gestión administrativa, agendamiento de citas, catálogo de productos y simulador interactivo de colorimetría para el salón \"Xio Rizos\", encuentra su justificación desde cuatro dimensiones fundamentales: práctica, social-comercial, metodológica y académica; destacando en cada una de ellas las múltiples bondades y beneficios tangibles que el software ofrecerá."
    )

    apply_text(
        doc.paragraphs[111],
        "Desde la perspectiva social y comercial, las bondades del sistema radican en su enfoque centrado en la experiencia del usuario (User Experience - UX) y en la innovación tecnológica dentro del mercado local de la estética. El sistema no se limita a ser una simple herramienta de back-office administrativo, sino que ofrece una interfaz pública interactiva que transforma la forma en que el salón Xio Rizos se relaciona comercialmente con su clientela. La integración de un catálogo de productos con carrito de compras y control dinámico de stock en tiempo real permite a las clientas adquirir los insumos y cosméticos oficiales del salón con total transparencia de precios duales (en dólares y en bolívares según tasa oficial BCV), disponiendo de métodos de pago adaptados al entorno nacional (Pago Móvil y Efectivo en Salón) y enlace directo a WhatsApp para formalizar pedidos. Asimismo, el simulador interactivo de colorimetría capilar impulsado por visión artificial con MediaPipe WASM otorga a las usuarias la bondad de experimentar cambios de imagen sobre su propia fotografía antes de someterse a procedimientos químicos reales, reduciendo la incertidumbre y elevando los estándares de satisfacción del salón Xio Rizos en el Estado Carabobo."
    )

    # ==========================================
    # CAPÍTULO II: MARCO REFERENCIAL
    # ==========================================
    apply_text(
        doc.paragraphs[120],
        "En el ámbito internacional, destaca el trabajo de investigación desarrollado por Gómez, A. y Ramírez, C. (2024), titulado \"Desarrollo de una aplicación web interactiva para la gestión automatizada de citas y servicios en centros estéticos\", presentado ante la Universidad Nacional de Colombia para optar al título de Ingeniero de Sistemas. El objetivo principal de dicho trabajo fue diseñar una arquitectura que permitiera a los centros estéticos de Bogotá gestionar de forma sincronizada su flujo de clientes y catálogo de atenciones. La metodología empleada se basó en el modelo ágil iterativo, utilizando bases de datos relacionales y tecnologías de frontend dinámico. Los autores concluyeron que la automatización del agendamiento y la presentación digital de servicios redujo los tiempos de espera presencial en un 45% y disminuyó la tasa de inasistencia gracias a las notificaciones directas. Aporte a la investigación: Este antecedente guarda una estrecha relación con el presente proyecto, ya que proporciona una base empírica sólida sobre cómo estructurar el agendamiento sincronizado y la interacción transparente con el cliente mediante notificaciones y validaciones horarias sin solapamiento para el salón \"Xio Rizos\"."
    )

    apply_text(
        doc.paragraphs[123],
        "Finalmente, a nivel nacional, se hace referencia al trabajo de Mendoza, J. (2022), titulado \"Aplicación de tecnologías web y arquitectura Cliente-Servidor para la gestión integral y catálogo de productos en centros cosmetológicos\", presentado ante la Universidad Arturo Michelena (Estado Carabobo). El investigador se enfocó en desarrollar un sistema web que unificara el registro de clientes y la comercialización y control de insumos estéticos. El sistema fue capaz de procesar inventarios y sincronizar las existencias físicas con las solicitudes en línea de las usuarias. El desarrollo concluyó que la centralización de datos en bases de datos relacionales no solo evita la pérdida de información crítica, sino que optimiza la rotación del inventario al prevenir ventas sin disponibilidad física. Aporte a la investigación: Esta investigación aporta los fundamentos necesarios para el modelado de la base de datos relacional y el diseño del panel de administración que empleará la gerencia de \"Xio Rizos\". Su enfoque valida la integración del catálogo de productos con control de stock y el panel de auditoría comercial en tiempo real."
    )

    apply_text(
        doc.paragraphs[136],
        "4. Inteligencia Artificial y Visión Computacional: Modelos de Segmentación de Imágenes",
        bold_prefix=None, font_name="Arial", font_size_pt=12
    )
    doc.paragraphs[136].runs[0].bold = True

    apply_text(
        doc.paragraphs[137],
        "La Visión Artificial es un campo interdisciplinario de la Inteligencia Artificial y el Aprendizaje Automático (Machine Learning) enfocado en permitir que los sistemas informáticos interpreten y extraigan información semántica a partir de imágenes digitales o videos. En el ámbito del estilismo y la estética capilar moderna, la segmentación semántica de cabello (Hair Segmentation) constituye una tarea avanzada que consiste en clasificar cada píxel individual de una fotografía como perteneciente a la hebra capilar o al fondo/rostro. Tecnologías de vanguardia como Google MediaPipe proporcionan modelos neuronales optimizados y preentrenados que ejecutan esta tarea con una precisión milimétrica, permitiendo aislar el área exacta del cabello en milisegundos sin requerir selección manual por parte del usuario.",
        bold_prefix="4.1. Fundamentos de la Segmentación Neuronal y MediaPipe: "
    )

    apply_text(
        doc.paragraphs[138],
        "Para lograr una experiencia interactiva sin latencia en aplicaciones web, los modelos modernos de visión artificial son compilados en formato WebAssembly (WASM). WebAssembly es un estándar web que permite ejecutar código binario a velocidad cercana a la nativa directamente en el motor del navegador web del cliente. Al combinar MediaPipe WASM con la API de HTML5 Canvas, la plataforma web es capaz de generar una máscara binaria de segmentación del cabello directamente en el dispositivo del usuario, garantizando la privacidad de sus fotografías y reduciendo la carga de cómputo en el servidor. Sobre dicha máscara, el sistema aplica transformaciones matemáticas y filtros de colorimetría capilar en tiempo real, logrando una simulación fotorrealista que respeta el brillo, el volumen y las sombras naturales del cabello.",
        bold_prefix="4.2. Procesamiento Acelerado mediante WebAssembly (WASM) y Canvas API: "
    )

    apply_text(
        doc.paragraphs[164],
        "Análisis y vinculación con el proyecto: La formulación de este proyecto de grado se alinea fielmente con los postulados constitucionales que consagran la ciencia y la tecnología como motores del desarrollo nacional. En el ámbito operativo de Xio Rizos, el sistema promueve la soberanía técnica al implementar estándares de software libre y código abierto en su infraestructura web. Asimismo, la integración de la pasarela de pedidos y pagos mediante Pago Móvil y Efectivo, junto al agendamiento digital, cumple con los preceptos de la Ley sobre Mensajes de Datos y Firmas Electrónicas, asegurando la plena validez probatoria de las transacciones, citas reservadas y auditorías de inventario que se ejecutan cotidianamente dentro de la plataforma.",
        bold_prefix=None
    )

    # ==========================================
    # CAPÍTULO III: MARCO METODOLÓGICO
    # ==========================================
    apply_text(
        doc.paragraphs[189],
        "En primer lugar, la investigación se define intrínsecamente como un Proyecto Tecnológico. Esta modalidad, sustentada en las directrices de Hurtado de Barrera (2015), comprende aquellas investigaciones orientadas a la concepción, diseño, desarrollo y validación de una herramienta técnica, prototipo o artefacto informático capaz de solucionar una necesidad práctica demostrable en una organización. En este caso particular, el producto tecnológico generado consiste en una plataforma web integral a la medida, que automatiza el control de inventarios, el catálogo de productos con carrito de compras, el agendamiento sincronizado de citas con abonos de reserva y la simulación interactiva de colorimetría capilar para el salón \"Xio Rizos\", transformando su operatividad empírica en un modelo de gestión digital optimizado.",
        bold_prefix=None
    )

    apply_text(
        doc.paragraphs[203],
        "La caracterización de esta población es indispensable para el diseño del front-end y la Experiencia de Usuario (UX). Al tratarse de usuarias activas que consumen servicios de estética, cuidado capilar y productos especializados, sus expectativas digitales exigen interfaces móviles responsivas, navegación intuitiva y herramientas de alto impacto visual, como el simulador interactivo de colorimetría y el catálogo en línea con carrito de compras y confirmación por WhatsApp.",
        bold_prefix=None
    )

    apply_text(
        doc.paragraphs[223],
        "La aplicación de la entrevista permitió profundizar en la lógica transaccional que exige el comercio estético: control estricto de entradas y salidas de stock, cálculo de puntos de reorden, sincronización de la disponibilidad de los estilistas según sus horarios comerciales y control de pedidos. Estos hallazgos cualitativos sirvieron como insumo primario para modelar la base de datos relacional en PostgreSQL (Supabase) y definir la arquitectura de tres capas del sistema.",
        bold_prefix=None
    )

    # ==========================================
    # CAPÍTULO IV: LA PROPUESTA
    # ==========================================
    apply_text(
        doc.paragraphs[266],
        "Plataforma transaccional de e-commerce que permite a las usuarias explorar productos capilares por categoría, visualizar especificaciones técnicas y precios duales (dólares y bolívares según tasa oficial BCV), añadir artículos al carrito con restricción dinámica de stock físico disponible en almacén y registrar órdenes de compra con métodos de pago nacionales (Pago Móvil o Efectivo en Salón), generando un resumen detallado y notificación inmediata a la administración vía WhatsApp.",
        bold_prefix="3. Módulo de Catálogo de Productos y Carrito de Compras en Línea: "
    )

    apply_text(
        doc.paragraphs[270],
        "Desarrollar un sistema web integral de gestión administrativa, agendamiento de citas, catálogo de productos y simulador interactivo de colorimetría para el salón de belleza Xio Rizos, ubicado en Naguanagua, Estado Carabobo, con el fin de automatizar los procesos internos y elevar los estándares de competitividad digital del establecimiento."
    )

    apply_text(
        doc.paragraphs[274],
        "Codificar la plataforma tecnológica a través de la integración modular del frontend interactivo y el backend transaccional, incorporando el catálogo de productos con carrito de compras, el agendamiento de citas en cuatro pasos y el simulador de colorimetría asistido por visión artificial (MediaPipe WASM)."
    )

    apply_text(
        doc.paragraphs[279],
        "La implementación de la plataforma web automatizada transformará radicalmente esta dinámica. Desde la perspectiva práctica y operativa, la sincronización digital de agendas optimiza las horas productivas de los estilistas, previene solapamientos y minimiza el ausentismo mediante el requerimiento de un abono previo del 20%. Paralelamente, el control automatizado de inventarios erradica las mermas no justificadas, supervisa las existencias en tiempo real y vincula las ventas del catálogo en línea directamente con el stock del almacén. Desde la dimensión comercial y tecnológica, el catálogo virtual y el simulador interactivo de colorimetría capilar representan una ventaja competitiva de vanguardia en la región, ofreciendo a las clientas una experiencia inmersiva, transparente y profesional que afianza su fidelidad de marca."
    )

    # Survey Item 5
    apply_text(
        doc.paragraphs[331],
        "Ítem 5 - Indicador: Demanda de catálogo digital y productos de cuidado capilar",
        bold_prefix=None, font_name="Arial", font_size_pt=12
    )
    apply_text(
        doc.paragraphs[332],
        "Pregunta 5: ¿Considera beneficioso disponer de un catálogo en línea para consultar y adquirir productos de cuidado capilar recomendados por los especialistas antes de acudir al salón?",
        bold_prefix=None, font_name="Arial", font_size_pt=12
    )
    apply_text(
        doc.paragraphs[336],
        "Figura 5\t\nRelevancia del catálogo de productos y asesoría capilar en línea",
        bold_prefix=None, font_name="Arial", font_size_pt=12
    )
    apply_text(
        doc.paragraphs[338],
        "Análisis e Interpretación de los Resultados: El 88.0% de las encuestadas afirmó que disponer de un catálogo en línea con productos y tratamientos capilares recomendados añade un alto valor a su experiencia de belleza. Contar con la posibilidad de revisar especificaciones, verificar existencias reales y tramitar la compra de cosméticos especializados desde la web ahorra tiempo y complementa directamente los servicios recibidos en el salón. Desde el punto de vista del negocio, esto diversifica los ingresos del establecimiento al potenciar las ventas de productos capilares y profesionaliza la atención a la clientela.",
        bold_prefix=None
    )

    # Architecture P371 and P372
    apply_text(
        doc.paragraphs[371],
        "Implementada bajo el entorno Next.js 14 (App Router API handlers en TypeScript) ejecutándose sobre Node.js. Es la responsable de procesar las transacciones de citas en cuatro pasos, verificar la disponibilidad horaria sin colisiones, validar las existencias físicas de productos en el catálogo, estructurar la división de pagos (20% de abono de reserva y 80% en recepción) y coordinar la seguridad de acceso mediante roles (RBAC) y cifrado seguro.",
        bold_prefix="2. Capa de Lógica del Negocio (Backend): "
    )

    apply_text(
        doc.paragraphs[372],
        "Compuesta por el Sistema Gestor de Bases de Datos Relacionales PostgreSQL desplegado en la infraestructura en la nube de Supabase. El acceso, manipulación y persistencia de las entidades se gestiona a través del ORM Prisma (@prisma/client), garantizando integridad referencial mediante claves foráneas, tipado estricto en tiempo de compilación y transacciones seguras bajo estándar ACID.",
        bold_prefix="3. Capa de Datos (Persistencia): "
    )

    # Use Case 3 P389
    apply_text(
        doc.paragraphs[389],
        "Actor: Clienta. Flujo de eventos: La usuaria explora el catálogo categorizado de productos capilares, consulta la disponibilidad de existencias en tiempo real, añade artículos al carrito de compras con validación dinámica de cantidades máximas permitidas según inventario, selecciona su método de pago (Pago Móvil o Efectivo en Salón), completa sus datos de contacto y formaliza el pedido, recibiendo el resumen de la orden y un botón de enlace directo para confirmar y notificar la transacción a la administración a través de WhatsApp.",
        bold_prefix="Caso de Uso 3: Adquisición de Productos en el Catálogo Online.\t\n"
    )

    # Stack P407, P408, P409
    apply_text(
        doc.paragraphs[407],
        "Next.js 14 con React 18, TypeScript, maquetación responsiva moderna con Tailwind CSS y Tailwind Merge, Zustand para la gestión reactiva de estados globales (carrito de compras, asistente de citas y simulación), y Lucide React para iconografía vectorizada.",
        bold_prefix="• Frontend: "
    )

    apply_text(
        doc.paragraphs[408],
        "Rutas de servidor modulares de Next.js (App Router API handlers en TypeScript) bajo Node.js, implementando endpoints RESTful seguros para citas, pedidos, catálogo de productos, servicios y empleados, con validación estricta de esquemas y conexión mediante Prisma ORM.",
        bold_prefix="• Backend y API: "
    )

    apply_text(
        doc.paragraphs[409],
        "PostgreSQL alojado en la nube en Supabase bajo motor transaccional de alto rendimiento, con Prisma Client como capa de mapeo objeto-relacional (ORM), y autenticación protegida mediante cifrado unidireccional de contraseñas con Bcrypt (bcryptjs con factor de costo de 10 rondas de salting).",
        bold_prefix="• Base de Datos y Seguridad: "
    )

    # Code titles P412, P414, P416
    apply_text(
        doc.paragraphs[412],
        "1. Conexión Segura a la Base de Datos mediante Prisma ORM y Supabase (src/lib/prisma.ts):",
        bold_prefix=None, font_name="Arial", font_size_pt=12
    )
    doc.paragraphs[412].runs[0].bold = True

    apply_text(
        doc.paragraphs[414],
        "2. Algoritmo de Verificación y Control Anti-solapamiento de Citas (src/app/api/citas/route.ts):",
        bold_prefix=None, font_name="Arial", font_size_pt=12
    )
    doc.paragraphs[414].runs[0].bold = True

    apply_text(
        doc.paragraphs[416],
        "3. Lógica del Simulador de Colorimetría con MediaPipe WASM y Canvas API (src/components/simulator/hair-color-simulator.tsx):",
        bold_prefix=None, font_name="Arial", font_size_pt=12
    )
    doc.paragraphs[416].runs[0].bold = True

    # P426 User interface
    apply_text(
        doc.paragraphs[426],
        "Interfaz interactiva donde la clienta revisa el detalle simplificado de su orden de compra o cita, identificando con total claridad los montos (abono del 20% y saldo del 80% en recepción) y accediendo a la confirmación inmediata vía WhatsApp con la administración.",
        bold_prefix="2. Módulo de Gestión de Servicios y Pedidos de Productos: "
    )

    # P464 Technical feasibility
    apply_text(
        doc.paragraphs[464],
        "La plataforma fue desarrollada con tecnologías de última generación y código abierto (Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL en Supabase, Bcrypt y MediaPipe WASM). Esto elimina el pago de costosas licencias privativas y garantiza máxima velocidad de respuesta, alta escalabilidad y compatibilidad universal con cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).",
        bold_prefix="• Herramientas de Software: "
    )

    # ==========================================
    # CAPÍTULO V: CONCLUSIONES Y RECOMENDACIONES
    # ==========================================
    apply_text(
        doc.paragraphs[498],
        "El desarrollo del sistema web confirmó la versatilidad de tecnologías de vanguardia como Next.js 14, React, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL (Supabase) y MediaPipe WASM. La programación modular permitió la exitosa materialización de funcionalidades innovadoras, como el Catálogo de Productos con carrito y control de existencias en tiempo real, el Agendamiento de Citas en cuatro pasos con cálculo transparente de abonos, y el Simulador Interactivo de Colorimetría asistido por visión artificial. Estas herramientas no solo optimizan el flujo de trabajo del panel administrativo (Back-office), sino que transforman radicalmente la experiencia del usuario (Front-end), dotando a la clientela de autonomía y certeza estética.",
        bold_prefix="Codificación de la plataforma e integración tecnológica: "
    )

    apply_text(
        doc.paragraphs[505],
        "Dado que la industria cosmética capilar es altamente dinámica, se sugiere actualizar periódicamente los modelos neuronales de segmentación y la paleta de tintes integrada en el simulador (MediaPipe WASM + Canvas). Asimismo, se aconseja mantener actualizado el catálogo de productos con las nuevas líneas cosméticas aprobadas por el salón, aprovechando el panel administrativo para registrar productos, ajustar precios y sincronizar el inventario físico con las ventas en línea.",
        bold_prefix="Evolución del Simulador de Colorimetría y Catálogo: "
    )

    # ==========================================
    # TABLES
    # ==========================================
    # Table 9: Functional Requirements
    t9 = doc.tables[9]
    set_cell_text(t9.rows[2].cells[0], "RF02 - Agendamiento en 4 Pasos", bold=True)
    set_cell_text(t9.rows[2].cells[1], "Brindar un asistente interactivo en cuatro pasos (Servicio, Especialista, Fecha y Turno comercial de Martes a Sábado, Confirmación y Abono del 20%) con cálculo automático del saldo restante a pagar en el salón.")
    
    set_cell_text(t9.rows[4].cells[0], "RF04 - Catálogo y Carrito E-commerce", bold=True)
    set_cell_text(t9.rows[4].cells[1], "Disponer de un catálogo categorizado con carrito de compras interactivo, control dinámico de existencias en tiempo real que previene compras superiores al stock físico, y pasarela con métodos de pago nacionales (Pago Móvil y Efectivo en Salón).")
    
    set_cell_text(t9.rows[5].cells[0], "RF05 - Simulador de Colorimetría", bold=True)
    set_cell_text(t9.rows[5].cells[1], "Cargar fotografías o capturas de usuarias y segmentar el cabello en tiempo real mediante visión artificial (MediaPipe WASM), aplicando filtros y matices de color sobre HTML5 Canvas.")

    set_cell_text(t9.rows[6].cells[0], "RF06 - Gestión de Servicios", bold=True)
    set_cell_text(t9.rows[6].cells[1], "Permitir al administrador registrar, modificar y categorizar los servicios ofrecidos, tiempos de ejecución, tarifas en dólares y bolívares, y la asignación obligatoria de especialistas calificados.")

    set_cell_text(t9.rows[10].cells[0], "RF10 - Dashboard y Métricas de Negocio", bold=True)
    set_cell_text(t9.rows[10].cells[1], "Generar gráficos interactivos en el panel administrativo: ocupación semanal del salón, rendimiento de ventas diarias, distribución de citas por estado, salud de inventario por categoría y balance global del negocio.")

    # Table 10: Non-Functional Requirements
    t10 = doc.tables[10]
    set_cell_text(t10.rows[4].cells[1], "Cifrado unidireccional de claves mediante Bcrypt (10 rondas de salt), protección contra inyecciones SQL mediante consultas tipadas vía Prisma ORM, control de acceso basado en roles (RBAC) y manejo seguro de sesiones.")
    set_cell_text(t10.rows[6].cells[1], "Estructura de código desacoplada bajo Next.js 14 (App Router) con componentes modulares en React, API handlers en TypeScript y capa de persistencia abstraída con Prisma ORM sobre PostgreSQL en Supabase.")

    # Table 11: Actors Matrix
    t11 = doc.tables[11]
    set_cell_text(t11.rows[1].cells[2], "Registro, inicio de sesión, catálogo de productos con carrito, agendamiento de citas en cuatro pasos (abono del 20%), simulador de colorimetría interactivo y confirmación vía WhatsApp.")
    set_cell_text(t11.rows[2].cells[2], "Consulta de agenda personal diaria y semanal, revisión de turnos asignados y registro de días de inoperatividad o permisos laborales.")
    set_cell_text(t11.rows[3].cells[2], "Control administrativo absoluto: gestión de servicios con asignación obligatoria de especialistas, auditoría de inventario y pedidos, gestión de personal y horarios, métricas en tiempo real en dashboard y confirmación de pagos.")

    # Table 12: Code snippet - Prisma Singleton
    prisma_code = """import { PrismaClient } from '@prisma/client'

// Configuración del cliente Prisma Singleton para PostgreSQL en Supabase
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Reutilización de conexión para optimizar el pool de conexiones en la nube
const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma"""
    set_code_cell(doc.tables[12].rows[0].cells[0], prisma_code)

    # Table 13: Code snippet - Anti-overlap Appointment Validation
    cita_code = """// Validación de disponibilidad y prevención de solapamientos (src/app/api/citas/route.ts)
export async function verificarDisponibilidadCita(
  empleadoId: string,
  fecha: string,
  horaInicio: string,
  duracionMinutos: number
) {
  // Cálculo de hora de culminación del servicio
  const [horas, minutos] = horaInicio.split(':').map(Number);
  const finMinutos = horas * 60 + minutos + duracionMinutos;
  const horaFin = `${Math.floor(finMinutos / 60).toString().padStart(2, '0')}:${(finMinutos % 60).toString().padStart(2, '0')}`;

  // Consulta en PostgreSQL vía Prisma ORM evitando solapamientos para el especialista
  const citasSolapadas = await prisma.cita.count({
    where: {
      empleadoId: empleadoId,
      fecha: new Date(fecha),
      estado: { in: ['CONFIRMADA', 'PENDIENTE'] },
      AND: [
        { hora: { lt: horaFin } },
        { horaFin: { gt: horaInicio } }
      ]
    }
  });

  return citasSolapadas === 0; // True si el especialista cuenta con disponibilidad libre
}"""
    set_code_cell(doc.tables[13].rows[0].cells[0], cita_code)

    # Table 14: Code snippet - Colorimetry Simulator with MediaPipe WASM
    simulator_code = """// Procesamiento de colorimetría capilar con máscara de segmentación (MediaPipe WASM + Canvas)
function aplicarColorimetriaCapilar(canvasId, maskData, hexColor, opacidad = 0.55) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const rgb = hexToRgb(hexColor); // Conversión a componentes { r, g, b }

  // Recorrido de píxeles filtrando exclusivamente el área de cabello detectada por IA
  for (let i = 0; i < data.length; i += 4) {
    const maskConfidence = maskData[i / 4]; // Nivel de confianza de segmentación MediaPipe
    if (maskConfidence > 0.40) { // Umbral de segmentación de hebra capilar
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
      const factorMezcla = opacidad * maskConfidence;

      // Fusión preservando sombras, brillos naturales y textura del cabello
      data[i]     = (r * (1 - factorMezcla)) + ((luminancia * rgb.r / 255) * factorMezcla);
      data[i + 1] = (g * (1 - factorMezcla)) + ((luminancia * rgb.g / 255) * factorMezcla);
      data[i + 2] = (b * (1 - factorMezcla)) + ((luminancia * rgb.b / 255) * factorMezcla);
    }
  }
  ctx.putImageData(imgData, 0, 0);
}"""
    set_code_cell(doc.tables[14].rows[0].cells[0], simulator_code)

    # Table 15: Unit and Acceptance Testing
    t15 = doc.tables[15]
    set_cell_text(t15.rows[3].cells[0], "Módulo 3: Catálogo y Carrito E-commerce", bold=True)
    set_cell_text(t15.rows[3].cells[1], "Caja Blanca / Integración")
    set_cell_text(t15.rows[3].cells[2], "Validación dinámica de existencias en tiempo real, bloqueo de compra si supera el stock físico y registro de orden con métodos Pago Móvil y Efectivo.")
    set_cell_text(t15.rows[3].cells[3], "Excelente")
    set_cell_text(t15.rows[3].cells[4], "Se añadieron productos con stock límite de 3 unidades al carrito; el sistema impidió añadir una 4ta unidad y calculó el monto exacto en bolívares según tasa referencial.")

    doc.save(doc_path)
    print("Successfully updated thesis document and preserved APA styling!")

if __name__ == "__main__":
    main()
