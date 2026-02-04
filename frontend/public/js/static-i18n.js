/**
 * Standalone i18n script for static pages (faq.html, about.html, guia-facturae.html)
 * This is a standalone version that doesn't require ES modules
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'facturaview-lang';
  const DEFAULT_LANG = 'es';

  // Translations for static pages
  const translations = {
    es: {
      // Navigation
      'nav.faq': 'FAQ',
      'nav.guide': 'Guía Facturae',
      'nav.about': 'Sobre nosotros',
      'nav.home': 'Inicio',
      'changeLang': 'EN',
      'changeLangTitle': 'Change to English',

      // Footer
      'footer.copyright': '© 2026 FacturaView. Herramienta gratuita para visualizar facturas Facturae.',

      // FAQ page
      'faq.title': 'Preguntas Frecuentes',
      'faq.intro': 'Todo lo que necesitas saber sobre facturas electrónicas Facturae y cómo usar FacturaView.',
      'faq.q1.title': '¿Qué es una factura electrónica Facturae?',
      'faq.q1.answer': 'Facturae es el formato estándar de factura electrónica en España. Es un archivo XML estructurado que contiene todos los datos de una factura (emisor, receptor, líneas de detalle, impuestos, totales) en un formato que pueden leer tanto personas como máquinas. Es obligatorio para facturar a la Administración Pública española.',
      'faq.q2.title': '¿Qué versiones de Facturae existen?',
      'faq.q2.intro': 'Existen tres versiones principales:',
      'faq.q2.v32': 'Facturae 3.2 - Versión legacy, aún usada en algunos organismos',
      'faq.q2.v321': 'Facturae 3.2.1 - Común en el sector privado',
      'faq.q2.v322': 'Facturae 3.2.2 - La versión actual, obligatoria para FACe desde 2015',
      'faq.q2.supported': 'FacturaView soporta las tres versiones.',
      'faq.q3.title': '¿Qué es FACe?',
      'faq.q3.answer': 'FACe (Punto General de Entrada de Facturas Electrónicas) es el sistema de la Administración General del Estado para recibir facturas electrónicas. Si facturas a cualquier organismo público español, debes enviar tu factura Facturae firmada digitalmente a través de FACe.',
      'faq.q3.moreInfo': 'Más información:',
      'faq.q4.title': '¿Cómo puedo abrir un archivo XML de factura?',
      'faq.q4.answer1': 'Puedes usar FacturaView: simplemente arrastra tu archivo XML a la página o haz clic para seleccionarlo. FacturaView mostrará todos los datos de la factura en un formato legible, y podrás exportarla a PDF o Excel.',
      'faq.q4.answer2': 'Todo el procesamiento se hace en tu navegador, sin enviar datos a ningún servidor.',
      'faq.q5.title': '¿Qué es la firma digital XAdES?',
      'faq.q5.answer': 'XAdES (XML Advanced Electronic Signatures) es el estándar europeo para firmas digitales en documentos XML. Las facturas enviadas a FACe deben estar firmadas con XAdES para garantizar su autenticidad e integridad.',
      'faq.q5.levels': 'Existen varios niveles de firma:',
      'faq.q5.bes': 'XAdES-BES - Firma básica',
      'faq.q5.t': 'XAdES-T - Con sello de tiempo',
      'faq.q5.cxl': 'XAdES-C / XAdES-XL - Con información de validación completa',
      'faq.q6.title': '¿Es seguro subir mi factura a FacturaView?',
      'faq.q6.answer1': 'Sí. FacturaView procesa las facturas 100% en tu navegador. El archivo XML nunca sale de tu dispositivo para la visualización y exportación.',
      'faq.q6.answer2': 'Solo si la factura está firmada y quieres verificar la firma, se envía al servidor para la validación criptográfica (que requiere librerías especializadas no disponibles en el navegador).',
      'faq.q7.title': '¿La validación de firma de FacturaView es oficial?',
      'faq.q7.answer1': 'No. FacturaView realiza una validación técnica de la firma (verifica la integridad matemática y el certificado), pero no es una validación oficial con efectos legales.',
      'faq.q7.answer2': 'Para validación oficial, recomendamos usar VALIDe, el servicio del Gobierno de España que cumple con la normativa eIDAS.',
      'faq.q8.title': '¿Es obligatorio firmar las facturas electrónicas?',
      'faq.q8.intro': 'Depende del destinatario:',
      'faq.q8.public': 'Administración Pública (FACe): La firma digital es obligatoria',
      'faq.q8.private': 'Empresas privadas: La firma es opcional pero recomendable para garantizar la autenticidad',
      'faq.cta.title': '¿Tienes una factura Facturae?',
      'faq.cta.subtitle': 'Visualízala gratis con FacturaView. Sin instalación, sin registro.',
      'faq.cta.button': 'Abrir FacturaView',

      // About page
      'about.title': 'Sobre FacturaView',
      'about.intro': 'Visualiza, entiende y exporta tus facturas electrónicas Facturae de forma gratuita y privada.',
      'about.what.title': '¿Qué es FacturaView?',
      'about.what.p1': 'FacturaView es una herramienta web gratuita diseñada para autónomos y pymes españoles que necesitan visualizar facturas electrónicas en formato Facturae (XML).',
      'about.what.p2': 'Con FacturaView puedes abrir cualquier factura Facturae y ver toda su información de forma clara: emisor, receptor, líneas de detalle, impuestos y totales. También puedes exportar la factura a PDF o Excel para archivarla o compartirla.',
      'about.why.title': '¿Por qué es gratis?',
      'about.why.p1': 'FacturaView nació de una necesidad real: muchos autónomos y pequeñas empresas reciben facturas electrónicas de la Administración Pública pero no tienen herramientas sencillas para abrirlas.',
      'about.why.p2': 'Las alternativas existentes suelen requerir:',
      'about.why.alt1': 'Instalar software de escritorio',
      'about.why.alt2': 'Tener Java instalado',
      'about.why.alt3': 'Pagar por aplicaciones de facturación completas',
      'about.why.alt4': 'Subir tus facturas a servidores de terceros',
      'about.why.p3': 'FacturaView elimina todas estas barreras: funciona directamente en el navegador, sin instalación, y procesa las facturas localmente en tu dispositivo.',
      'about.privacy.title': 'Privacidad: procesamiento local',
      'about.privacy.highlight': 'Tus facturas nunca salen de tu dispositivo*',
      'about.privacy.p1': 'El parser XML de FacturaView se ejecuta 100% en tu navegador. Cuando subes un archivo:',
      'about.privacy.step1': 'El archivo se lee localmente con JavaScript',
      'about.privacy.step2': 'El XML se parsea en tu navegador',
      'about.privacy.step3': 'Los datos se muestran en pantalla',
      'about.privacy.step4': 'Los exports (PDF/Excel) se generan localmente',
      'about.privacy.note': '* La única excepción es la verificación de firmas digitales, que requiere librerías criptográficas no disponibles en el navegador. Si tu factura contiene una firma digital, el archivo se envía automáticamente a nuestro servidor para validarla. El archivo se procesa en memoria y se elimina inmediatamente después de la verificación, sin almacenarse en ningún momento.',
      'about.features.title': 'Funcionalidades',
      'about.features.view.title': 'Visualización',
      'about.features.view.v1': 'Soporta Facturae 3.2, 3.2.1 y 3.2.2',
      'about.features.view.v2': 'Muestra emisor y receptor',
      'about.features.view.v3': 'Tabla de líneas de detalle',
      'about.features.view.v4': 'Desglose de impuestos (IVA, IRPF)',
      'about.features.view.v5': 'Información de pago (IBAN, vencimiento)',
      'about.features.export.title': 'Exportación',
      'about.features.export.e1': 'Exportar a PDF legible',
      'about.features.export.e2': 'Exportar a Excel (3 hojas)',
      'about.features.export.e3': 'Generación 100% local',
      'about.features.export.e4': 'Sin marcas de agua',
      'about.features.signature.title': 'Verificación de firma',
      'about.features.signature.s1': 'Detecta firmas XAdES',
      'about.features.signature.s2': 'Verifica integridad de la firma',
      'about.features.signature.s3': 'Muestra datos del firmante',
      'about.features.signature.s4': 'Identifica nivel de firma',
      'about.features.history.title': 'Historial local',
      'about.features.history.h1': 'Guarda facturas en el navegador',
      'about.features.history.h2': 'Acceso rápido a facturas recientes',
      'about.features.history.h3': 'Datos nunca salen del dispositivo',
      'about.features.history.h4': 'Control total sobre tus datos',
      'about.limits.title': 'Limitaciones',
      'about.limits.intro': 'FacturaView es un visualizador, no un programa de facturación completo. Algunas cosas que no hace:',
      'about.limits.noCreate': 'No crea facturas: Solo visualiza facturas existentes',
      'about.limits.noSign': 'No firma facturas: Necesitas un programa de facturación para firmar',
      'about.limits.noSend': 'No envía a FACe: El envío lo debes hacer tú desde face.gob.es',
      'about.limits.noOfficial': 'Validación técnica, no oficial: La verificación de firma no tiene efectos legales. Para validación oficial usa VALIDe',
      'about.tech.title': 'Tecnología',
      'about.tech.intro': 'FacturaView está construido con tecnologías web modernas:',
      'about.tech.frontend': 'Frontend: JavaScript vanilla (ES Modules), Vite, Tailwind CSS',
      'about.tech.backend': 'Backend: Python (FastAPI) solo para validación de firmas',
      'about.tech.pdf': 'PDF: jsPDF (generación 100% cliente)',
      'about.tech.excel': 'Excel: SheetJS (generación 100% cliente)',
      'about.tech.hosting': 'Hosting: Railway',
      'about.contact.title': 'Contacto',
      'about.contact.p1': '¿Tienes preguntas, sugerencias o has encontrado un bug? Puedes contactarnos a través del formulario en la página principal.',
      'about.contact.p2': 'También puedes consultar las preguntas frecuentes o la guía del formato Facturae.',
      'about.cta.title': 'Prueba FacturaView ahora',
      'about.cta.subtitle': 'Arrastra tu factura XML y visualízala al instante. Sin registro, sin instalación.',
      'about.cta.button': 'Abrir FacturaView',

      // Guide page
      'guide.title': 'Guía Completa del Formato Facturae',
      'guide.intro': 'Todo lo que necesitas saber sobre el estándar español de factura electrónica.',
      'guide.toc': 'Contenido',
      'guide.toc1': '¿Qué es Facturae?',
      'guide.toc2': 'Versiones del formato',
      'guide.toc3': 'Estructura del XML',
      'guide.toc4': 'Tipos de factura',
      'guide.toc5': 'Firma digital XAdES',
      'guide.toc6': 'Envío a FACe',
      'guide.s1.title': '1. ¿Qué es Facturae?',
      'guide.s1.p1': 'Facturae es el formato estándar de factura electrónica en España, regulado por el Ministerio de Hacienda. Es un archivo XML que sigue un esquema definido (XSD) y contiene toda la información necesaria de una factura comercial.',
      'guide.s1.features': 'Características principales:',
      'guide.s1.f1': 'Formato abierto basado en XML',
      'guide.s1.f2': 'Esquema definido públicamente (XSD)',
      'guide.s1.f3': 'Obligatorio para facturar a la Administración Pública',
      'guide.s1.f4': 'Soporta firma digital XAdES',
      'guide.s1.f5': 'Incluye todos los datos fiscales requeridos por la normativa española',
      'guide.s1.legal': 'Marco legal:',
      'guide.s1.l1': 'Ley 25/2013 de impulso de la factura electrónica',
      'guide.s1.l2': 'Orden HAP/492/2014 que regula los requisitos técnicos',
      'guide.s1.l3': 'Obligatorio para proveedores de la Administración Pública desde 2015',
      'guide.s2.title': '2. Versiones del Formato',
      'guide.s2.version': 'Versión',
      'guide.s2.namespace': 'Namespace',
      'guide.s2.status': 'Estado',
      'guide.s2.usage': 'Uso',
      'guide.s2.current': 'Actual',
      'guide.s2.valid': 'Vigente',
      'guide.s2.legacy': 'Legacy',
      'guide.s2.face': 'FACe (obligatorio)',
      'guide.s2.private': 'Sector privado',
      'guide.s2.some': 'Algunos organismos',
      'guide.s2.diffs': 'Diferencias principales:',
      'guide.s2.diff1': '3.2 → 3.2.1: Mejoras en campos de dirección y datos bancarios',
      'guide.s2.diff2': '3.2.1 → 3.2.2: Soporte para Suministro Inmediato de Información (SII), nuevos tipos impositivos, mejoras en identificación fiscal',
      'guide.s3.title': '3. Estructura del XML',
      'guide.s3.p1': 'Un archivo Facturae tiene una estructura jerárquica con los siguientes elementos principales:',
      'guide.s3.required': 'Campos obligatorios:',
      'guide.s3.r1': 'Número de factura y serie',
      'guide.s3.r2': 'Fecha de emisión',
      'guide.s3.r3': 'NIF/CIF del emisor y receptor',
      'guide.s3.r4': 'Razón social o nombre completo',
      'guide.s3.r5': 'Dirección fiscal',
      'guide.s3.r6': 'Base imponible e impuestos',
      'guide.s3.r7': 'Total a pagar',
      'guide.s4.title': '4. Tipos de Factura',
      'guide.s4.byClass': 'Por clase de documento',
      'guide.s4.fc': 'FC - Factura completa',
      'guide.s4.fa': 'FA - Factura simplificada',
      'guide.s4.af': 'AF - Autofactura',
      'guide.s4.byOp': 'Por tipo de operación',
      'guide.s4.oo': 'OO - Factura original',
      'guide.s4.or': 'OR - Factura rectificativa',
      'guide.s4.co': 'CO - Copia de factura',
      'guide.s4.rect': 'Facturas rectificativas:',
      'guide.s4.rectDesc': 'Las facturas rectificativas (tipo OR) se usan para corregir errores o anular facturas anteriores. Deben incluir referencia a la factura original y pueden tener importes negativos.',
      'guide.s5.title': '5. Firma Digital XAdES',
      'guide.s5.p1': 'Las facturas enviadas a FACe deben estar firmadas digitalmente con el estándar XAdES (XML Advanced Electronic Signatures), que garantiza:',
      'guide.s5.auth': 'Autenticidad: El emisor es quien dice ser',
      'guide.s5.integrity': 'Integridad: El contenido no ha sido modificado',
      'guide.s5.nonrep': 'No repudio: El emisor no puede negar haber emitido la factura',
      'guide.s5.levels': 'Niveles de firma XAdES:',
      'guide.s5.level': 'Nivel',
      'guide.s5.includes': 'Incluye',
      'guide.s5.validity': 'Validez',
      'guide.s5.bes': 'Firma básica + certificado',
      'guide.s5.besVal': 'Mientras el certificado sea válido',
      'guide.s5.t': 'BES + sello de tiempo',
      'guide.s5.tVal': 'Prueba de existencia en fecha',
      'guide.s5.c': 'T + referencias de validación',
      'guide.s5.cVal': 'Referencias a CRLs/OCSP',
      'guide.s5.xl': 'C + datos de validación embebidos',
      'guide.s5.xlVal': 'Validación a largo plazo',
      'guide.s5.certs': 'Certificados válidos:',
      'guide.s5.certsIntro': 'Para firmar facturas electrónicas en España puedes usar:',
      'guide.s5.fnmt': 'Certificado de la FNMT (Fábrica Nacional de Moneda y Timbre)',
      'guide.s5.dnie': 'DNI electrónico (DNIe)',
      'guide.s5.others': 'Certificados de prestadores cualificados (Camerfirma, Firmaprofesional, etc.)',
      'guide.s6.title': '6. Envío a FACe',
      'guide.s6.p1': 'FACe (Punto General de Entrada de Facturas Electrónicas) es la plataforma del Gobierno de España para recibir facturas electrónicas de proveedores de la Administración Pública.',
      'guide.s6.reqs': 'Requisitos para enviar a FACe:',
      'guide.s6.r1': 'Factura en formato Facturae versión 3.2.2',
      'guide.s6.r2': 'Firmada digitalmente con certificado cualificado',
      'guide.s6.r3': 'Incluir los códigos DIR3:',
      'guide.s6.r3a': 'Oficina contable',
      'guide.s6.r3b': 'Órgano gestor',
      'guide.s6.r3c': 'Unidad tramitadora',
      'guide.s6.r4': 'Datos fiscales correctos y completos',
      'guide.s6.process': 'Proceso de envío:',
      'guide.s6.p1s': 'Crear la factura en formato Facturae 3.2.2',
      'guide.s6.p2s': 'Firmar con certificado digital',
      'guide.s6.p3s': 'Acceder a face.gob.es',
      'guide.s6.p4s': 'Subir el archivo firmado',
      'guide.s6.p5s': 'FACe validará y enviará al organismo correspondiente',
      'guide.s6.note': 'Importante: Los códigos DIR3 los proporciona el organismo público al que facturas. Puedes consultarlos en el directorio de FACe.',
      'guide.cta.title': 'Visualiza tus facturas Facturae',
      'guide.cta.subtitle': 'FacturaView te permite abrir, visualizar y exportar facturas Facturae de cualquier versión.',
      'guide.cta.button': 'Abrir FacturaView'
    },
    en: {
      // Navigation
      'nav.faq': 'FAQ',
      'nav.guide': 'Facturae Guide',
      'nav.about': 'About us',
      'nav.home': 'Home',
      'changeLang': 'ES',
      'changeLangTitle': 'Cambiar a Español',

      // Footer
      'footer.copyright': '© 2026 FacturaView. Free tool to view Facturae invoices.',

      // FAQ page
      'faq.title': 'Frequently Asked Questions',
      'faq.intro': 'Everything you need to know about Facturae electronic invoices and how to use FacturaView.',
      'faq.q1.title': 'What is a Facturae electronic invoice?',
      'faq.q1.answer': 'Facturae is the standard format for electronic invoices in Spain. It is a structured XML file that contains all invoice data (seller, buyer, line items, taxes, totals) in a format that can be read by both humans and machines. It is mandatory for invoicing the Spanish Public Administration.',
      'faq.q2.title': 'What versions of Facturae exist?',
      'faq.q2.intro': 'There are three main versions:',
      'faq.q2.v32': 'Facturae 3.2 - Legacy version, still used by some organizations',
      'faq.q2.v321': 'Facturae 3.2.1 - Common in the private sector',
      'faq.q2.v322': 'Facturae 3.2.2 - Current version, mandatory for FACe since 2015',
      'faq.q2.supported': 'FacturaView supports all three versions.',
      'faq.q3.title': 'What is FACe?',
      'faq.q3.answer': "FACe (General Entry Point for Electronic Invoices) is the Spanish Government's system for receiving electronic invoices. If you invoice any Spanish public organization, you must send your digitally signed Facturae invoice through FACe.",
      'faq.q3.moreInfo': 'More information:',
      'faq.q4.title': 'How can I open an invoice XML file?',
      'faq.q4.answer1': 'You can use FacturaView: simply drag your XML file to the page or click to select it. FacturaView will display all invoice data in a readable format, and you can export it to PDF or Excel.',
      'faq.q4.answer2': 'All processing is done in your browser, without sending data to any server.',
      'faq.q5.title': 'What is XAdES digital signature?',
      'faq.q5.answer': 'XAdES (XML Advanced Electronic Signatures) is the European standard for digital signatures on XML documents. Invoices sent to FACe must be signed with XAdES to guarantee their authenticity and integrity.',
      'faq.q5.levels': 'There are several signature levels:',
      'faq.q5.bes': 'XAdES-BES - Basic signature',
      'faq.q5.t': 'XAdES-T - With timestamp',
      'faq.q5.cxl': 'XAdES-C / XAdES-XL - With complete validation information',
      'faq.q6.title': 'Is it safe to upload my invoice to FacturaView?',
      'faq.q6.answer1': 'Yes. FacturaView processes invoices 100% in your browser. The XML file never leaves your device for viewing and exporting.',
      'faq.q6.answer2': 'Only if the invoice is signed and you want to verify the signature, it is sent to the server for cryptographic validation (which requires specialized libraries not available in the browser).',
      'faq.q7.title': "Is FacturaView's signature validation official?",
      'faq.q7.answer1': 'No. FacturaView performs a technical validation of the signature (verifies mathematical integrity and the certificate), but it is not an official validation with legal effects.',
      'faq.q7.answer2': 'For official validation, we recommend using VALIDe, the Spanish Government service that complies with eIDAS regulations.',
      'faq.q8.title': 'Is it mandatory to sign electronic invoices?',
      'faq.q8.intro': 'It depends on the recipient:',
      'faq.q8.public': 'Public Administration (FACe): Digital signature is mandatory',
      'faq.q8.private': 'Private companies: Signature is optional but recommended to guarantee authenticity',
      'faq.cta.title': 'Do you have a Facturae invoice?',
      'faq.cta.subtitle': 'View it for free with FacturaView. No installation, no registration.',
      'faq.cta.button': 'Open FacturaView',

      // About page
      'about.title': 'About FacturaView',
      'about.intro': 'View, understand and export your Facturae electronic invoices for free and privately.',
      'about.what.title': 'What is FacturaView?',
      'about.what.p1': 'FacturaView is a free web tool designed for Spanish freelancers and SMEs who need to view electronic invoices in Facturae (XML) format.',
      'about.what.p2': 'With FacturaView you can open any Facturae invoice and see all its information clearly: seller, buyer, line items, taxes and totals. You can also export the invoice to PDF or Excel for archiving or sharing.',
      'about.why.title': 'Why is it free?',
      'about.why.p1': 'FacturaView was born from a real need: many freelancers and small businesses receive electronic invoices from Public Administration but do not have simple tools to open them.',
      'about.why.p2': 'Existing alternatives usually require:',
      'about.why.alt1': 'Installing desktop software',
      'about.why.alt2': 'Having Java installed',
      'about.why.alt3': 'Paying for complete invoicing applications',
      'about.why.alt4': 'Uploading your invoices to third-party servers',
      'about.why.p3': 'FacturaView eliminates all these barriers: it works directly in the browser, without installation, and processes invoices locally on your device.',
      'about.privacy.title': 'Privacy: local processing',
      'about.privacy.highlight': 'Your invoices never leave your device*',
      'about.privacy.p1': "FacturaView's XML parser runs 100% in your browser. When you upload a file:",
      'about.privacy.step1': 'The file is read locally with JavaScript',
      'about.privacy.step2': 'The XML is parsed in your browser',
      'about.privacy.step3': 'Data is displayed on screen',
      'about.privacy.step4': 'Exports (PDF/Excel) are generated locally',
      'about.privacy.note': '* The only exception is digital signature verification, which requires cryptographic libraries not available in the browser. If your invoice contains a digital signature, the file is automatically sent to our server to validate it. The file is processed in memory and immediately deleted after verification, without being stored at any time.',
      'about.features.title': 'Features',
      'about.features.view.title': 'Viewing',
      'about.features.view.v1': 'Supports Facturae 3.2, 3.2.1 and 3.2.2',
      'about.features.view.v2': 'Shows seller and buyer',
      'about.features.view.v3': 'Line items table',
      'about.features.view.v4': 'Tax breakdown (VAT, IRPF)',
      'about.features.view.v5': 'Payment info (IBAN, due date)',
      'about.features.export.title': 'Export',
      'about.features.export.e1': 'Export to readable PDF',
      'about.features.export.e2': 'Export to Excel (3 sheets)',
      'about.features.export.e3': '100% local generation',
      'about.features.export.e4': 'No watermarks',
      'about.features.signature.title': 'Signature verification',
      'about.features.signature.s1': 'Detects XAdES signatures',
      'about.features.signature.s2': 'Verifies signature integrity',
      'about.features.signature.s3': 'Shows signer data',
      'about.features.signature.s4': 'Identifies signature level',
      'about.features.history.title': 'Local history',
      'about.features.history.h1': 'Saves invoices in the browser',
      'about.features.history.h2': 'Quick access to recent invoices',
      'about.features.history.h3': 'Data never leaves the device',
      'about.features.history.h4': 'Full control over your data',
      'about.limits.title': 'Limitations',
      'about.limits.intro': "FacturaView is a viewer, not a complete invoicing program. Some things it doesn't do:",
      'about.limits.noCreate': "Doesn't create invoices: Only views existing invoices",
      'about.limits.noSign': "Doesn't sign invoices: You need an invoicing program to sign",
      'about.limits.noSend': "Doesn't send to FACe: You must submit yourself at face.gob.es",
      'about.limits.noOfficial': 'Technical validation, not official: Signature verification has no legal effects. For official validation use VALIDe',
      'about.tech.title': 'Technology',
      'about.tech.intro': 'FacturaView is built with modern web technologies:',
      'about.tech.frontend': 'Frontend: Vanilla JavaScript (ES Modules), Vite, Tailwind CSS',
      'about.tech.backend': 'Backend: Python (FastAPI) only for signature validation',
      'about.tech.pdf': 'PDF: jsPDF (100% client generation)',
      'about.tech.excel': 'Excel: SheetJS (100% client generation)',
      'about.tech.hosting': 'Hosting: Railway',
      'about.contact.title': 'Contact',
      'about.contact.p1': 'Have questions, suggestions or found a bug? You can contact us through the form on the home page.',
      'about.contact.p2': 'You can also check the frequently asked questions or the Facturae format guide.',
      'about.cta.title': 'Try FacturaView now',
      'about.cta.subtitle': 'Drag your XML invoice and view it instantly. No registration, no installation.',
      'about.cta.button': 'Open FacturaView',

      // Guide page
      'guide.title': 'Complete Guide to Facturae Format',
      'guide.intro': 'Everything you need to know about the Spanish electronic invoice standard.',
      'guide.toc': 'Contents',
      'guide.toc1': 'What is Facturae?',
      'guide.toc2': 'Format versions',
      'guide.toc3': 'XML structure',
      'guide.toc4': 'Invoice types',
      'guide.toc5': 'XAdES digital signature',
      'guide.toc6': 'Sending to FACe',
      'guide.s1.title': '1. What is Facturae?',
      'guide.s1.p1': 'Facturae is the standard electronic invoice format in Spain, regulated by the Ministry of Finance. It is an XML file that follows a defined schema (XSD) and contains all the necessary information of a commercial invoice.',
      'guide.s1.features': 'Main features:',
      'guide.s1.f1': 'Open format based on XML',
      'guide.s1.f2': 'Publicly defined schema (XSD)',
      'guide.s1.f3': 'Mandatory for invoicing Public Administration',
      'guide.s1.f4': 'Supports XAdES digital signature',
      'guide.s1.f5': 'Includes all tax data required by Spanish regulations',
      'guide.s1.legal': 'Legal framework:',
      'guide.s1.l1': 'Law 25/2013 promoting electronic invoicing',
      'guide.s1.l2': 'Order HAP/492/2014 regulating technical requirements',
      'guide.s1.l3': 'Mandatory for Public Administration suppliers since 2015',
      'guide.s2.title': '2. Format Versions',
      'guide.s2.version': 'Version',
      'guide.s2.namespace': 'Namespace',
      'guide.s2.status': 'Status',
      'guide.s2.usage': 'Usage',
      'guide.s2.current': 'Current',
      'guide.s2.valid': 'Valid',
      'guide.s2.legacy': 'Legacy',
      'guide.s2.face': 'FACe (mandatory)',
      'guide.s2.private': 'Private sector',
      'guide.s2.some': 'Some organizations',
      'guide.s2.diffs': 'Main differences:',
      'guide.s2.diff1': '3.2 → 3.2.1: Improvements in address and bank data fields',
      'guide.s2.diff2': '3.2.1 → 3.2.2: Support for Immediate Information Supply (SII), new tax rates, improvements in tax identification',
      'guide.s3.title': '3. XML Structure',
      'guide.s3.p1': 'A Facturae file has a hierarchical structure with the following main elements:',
      'guide.s3.required': 'Required fields:',
      'guide.s3.r1': 'Invoice number and series',
      'guide.s3.r2': 'Issue date',
      'guide.s3.r3': 'Seller and buyer Tax ID',
      'guide.s3.r4': 'Company name or full name',
      'guide.s3.r5': 'Tax address',
      'guide.s3.r6': 'Tax base and taxes',
      'guide.s3.r7': 'Total to pay',
      'guide.s4.title': '4. Invoice Types',
      'guide.s4.byClass': 'By document class',
      'guide.s4.fc': 'FC - Full invoice',
      'guide.s4.fa': 'FA - Simplified invoice',
      'guide.s4.af': 'AF - Self-invoice',
      'guide.s4.byOp': 'By operation type',
      'guide.s4.oo': 'OO - Original invoice',
      'guide.s4.or': 'OR - Corrective invoice',
      'guide.s4.co': 'CO - Invoice copy',
      'guide.s4.rect': 'Corrective invoices:',
      'guide.s4.rectDesc': 'Corrective invoices (type OR) are used to correct errors or cancel previous invoices. They must include reference to the original invoice and may have negative amounts.',
      'guide.s5.title': '5. XAdES Digital Signature',
      'guide.s5.p1': 'Invoices sent to FACe must be digitally signed with the XAdES standard (XML Advanced Electronic Signatures), which guarantees:',
      'guide.s5.auth': 'Authenticity: The issuer is who they claim to be',
      'guide.s5.integrity': 'Integrity: The content has not been modified',
      'guide.s5.nonrep': 'Non-repudiation: The issuer cannot deny having issued the invoice',
      'guide.s5.levels': 'XAdES signature levels:',
      'guide.s5.level': 'Level',
      'guide.s5.includes': 'Includes',
      'guide.s5.validity': 'Validity',
      'guide.s5.bes': 'Basic signature + certificate',
      'guide.s5.besVal': 'While the certificate is valid',
      'guide.s5.t': 'BES + timestamp',
      'guide.s5.tVal': 'Proof of existence at date',
      'guide.s5.c': 'T + validation references',
      'guide.s5.cVal': 'References to CRLs/OCSP',
      'guide.s5.xl': 'C + embedded validation data',
      'guide.s5.xlVal': 'Long-term validation',
      'guide.s5.certs': 'Valid certificates:',
      'guide.s5.certsIntro': 'To sign electronic invoices in Spain you can use:',
      'guide.s5.fnmt': 'FNMT certificate (National Mint)',
      'guide.s5.dnie': 'Electronic ID (DNIe)',
      'guide.s5.others': 'Qualified provider certificates (Camerfirma, Firmaprofesional, etc.)',
      'guide.s6.title': '6. Sending to FACe',
      'guide.s6.p1': "FACe (General Entry Point for Electronic Invoices) is the Spanish Government's platform for receiving electronic invoices from Public Administration suppliers.",
      'guide.s6.reqs': 'Requirements for sending to FACe:',
      'guide.s6.r1': 'Invoice in Facturae format version 3.2.2',
      'guide.s6.r2': 'Digitally signed with qualified certificate',
      'guide.s6.r3': 'Include DIR3 codes:',
      'guide.s6.r3a': 'Accounting office',
      'guide.s6.r3b': 'Managing body',
      'guide.s6.r3c': 'Processing unit',
      'guide.s6.r4': 'Correct and complete tax data',
      'guide.s6.process': 'Submission process:',
      'guide.s6.p1s': 'Create the invoice in Facturae 3.2.2 format',
      'guide.s6.p2s': 'Sign with digital certificate',
      'guide.s6.p3s': 'Access face.gob.es',
      'guide.s6.p4s': 'Upload the signed file',
      'guide.s6.p5s': 'FACe will validate and send to the corresponding organization',
      'guide.s6.note': 'Important: DIR3 codes are provided by the public organization you invoice. You can look them up in the FACe directory.',
      'guide.cta.title': 'View your Facturae invoices',
      'guide.cta.subtitle': 'FacturaView lets you open, view and export Facturae invoices of any version.',
      'guide.cta.button': 'Open FacturaView'
    }
  };

  /**
   * Get current language
   */
  function getLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
    } catch (e) {}

    // Detect from browser
    try {
      var browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
      if (browserLang === 'es' || browserLang === 'en') {
        return browserLang;
      }
    } catch (e) {}

    return DEFAULT_LANG;
  }

  /**
   * Set language
   */
  function setLang(lang) {
    if (lang !== 'es' && lang !== 'en') return;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    document.documentElement.lang = lang;
  }

  /**
   * Toggle language
   */
  function toggleLang() {
    var current = getLang();
    var newLang = current === 'es' ? 'en' : 'es';
    setLang(newLang);
    return newLang;
  }

  /**
   * Get translation
   */
  function t(key) {
    var lang = getLang();
    var dict = translations[lang] || translations[DEFAULT_LANG];
    return dict[key] || key;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  function applyTranslations() {
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var translation = t(key);
      if (translation !== key) {
        el.textContent = translation;
      }
    });

    // Update lang button
    var langBtn = document.getElementById('btn-lang');
    if (langBtn) {
      langBtn.textContent = t('changeLang');
      langBtn.setAttribute('title', t('changeLangTitle'));
    }
  }

  /**
   * Initialize i18n
   */
  function init() {
    var lang = getLang();
    document.documentElement.lang = lang;

    // Apply translations on load
    applyTranslations();

    // Setup language toggle button
    var langBtn = document.getElementById('btn-lang');
    if (langBtn) {
      langBtn.addEventListener('click', function() {
        toggleLang();
        applyTranslations();
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally
  window.FacturaViewI18n = {
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    t: t,
    applyTranslations: applyTranslations
  };
})();
