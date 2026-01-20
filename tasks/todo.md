# FacturaView - Plan de Implementación

## MVP (Fase 0) - ✅ COMPLETADO

### Setup y Configuración
- [x] Setup proyecto (Bun + Vite + Vanilla JS)
- [x] Configurar Tailwind CSS v4
- [x] Configurar Vitest para tests

### Parser Facturae
- [x] Parser Facturae básico
- [x] Soporte versión 3.2.2
- [x] Soporte versión 3.2.1
- [x] Soporte versión 3.2
- [x] Parseo de emisor (empresa y persona física)
- [x] Parseo de receptor
- [x] Parseo de líneas de detalle
- [x] Parseo de impuestos (múltiples tipos de IVA)
- [x] Parseo de retenciones IRPF
- [x] Parseo de información de pago (IBAN, BIC)
- [x] Detección de factura firmada
- [x] Soporte facturas rectificativas (importes negativos)

### UI/UX
- [x] Dropzone con drag & drop
- [x] Vista completa de factura
- [x] Tarjetas emisor/receptor
- [x] Tabla de líneas de detalle
- [x] Desglose de impuestos y totales
- [x] Información de pago
- [x] Diseño responsive (móvil)

### Exportación
- [x] Exportar a PDF (jsPDF directo)
- [x] Exportar a Excel (3 hojas: General, Líneas, Impuestos)

### Testing
- [x] Tests del parser (27 tests)
- [x] Tests de exportación (13 tests)
- [x] Fixtures de prueba (6 archivos XML)

**Total: 40 tests pasando**

---

## Próximos Pasos (Prioridad Alta)

- [x] Deploy en Railway (configuración completada en `railway.toml`)
- [ ] Probar con facturas reales de usuarios
- [ ] Mejorar manejo de errores (mensajes más descriptivos)
- [ ] Añadir loading state durante parseo

---

## Nice to Have (Fase 1)

- [ ] Validar firma digital (mostrar detalles del certificado)
- [ ] Detectar y mostrar errores específicos en XML malformado
- [ ] Modo oscuro
- [ ] Múltiples facturas en lote (Modality="L")
- [ ] Copiar datos al portapapeles (botón copiar)
- [ ] Historial local (localStorage)
- [ ] Selector de idioma (ES/EN)

---

## Futuro (Fase 2+)

- [ ] Soporte UBL (formato europeo)
- [ ] Soporte VeriFactu (cuando se publique especificación)
- [ ] API para integraciones
- [ ] Comparar dos facturas
- [ ] PWA (instalable como app)

---

## Fixtures de Test Disponibles

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| `simple-322.xml` | 3.2.2 | Factura básica empresa a empresa |
| `complex-322.xml` | 3.2.2 | 4 líneas, 3 tipos IVA (4%, 10%, 21%) |
| `simple-321.xml` | 3.2.1 | Suministros industriales |
| `simple-32.xml` | 3.2 | Factura legacy (floristería) |
| `with-retention.xml` | 3.2.2 | Autónomo con IRPF 15% |
| `rectificativa.xml` | 3.2.2 | Factura rectificativa (negativos) |