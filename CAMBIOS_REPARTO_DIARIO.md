# REPARTO DE TAREAS POR DÍA

## Qué cambia

Hoy el sistema calcula la **ventana semanal** completa y la app la muestra toda junta bajo el título "Tareas de hoy". De ahí las 78.

Con este cambio, cada tarea queda asignada a un día fijo de la semana:

- Las **diarias** siguen apareciendo todos los días.
- Las que tienen día obligatorio (`DIA_PREFERIDO`, como el arranque del generador los viernes) respetan el suyo.
- El resto se reparte parejo entre los días laborables, de forma estable: la misma tarea cae siempre el mismo día de la semana.

De 78 por semana pasás a unas 15 o 16 por día.

**Lo que no cambia:** una tarea que no se hizo el día que le tocaba no desaparece. Sigue a la vista el resto de la semana, marcada como "Era para el martes". Vence solo cuando cierra la semana, igual que antes.

---

## Parte 1 — Backend (Planificador.gs)

Son cuatro reemplazos en el archivo **Planificador.gs**. Usá Ctrl+F para encontrar cada bloque.

### Reemplazo 1 de 4 — agregar dos funciones

**Buscá:**

```javascript
function esLaborable(fecha) {
  return diasLaborables().indexOf(nombreDia(fecha)) !== -1;
}
```

**Reemplazalo por:**

```javascript
function esLaborable(fecha) {
  return diasLaborables().indexOf(nombreDia(fecha)) !== -1;
}

/** Posición de un día dentro de la semana laboral. -1 si no es laborable. */
function indiceDia(d) {
  return diasLaborables().indexOf(String(d).toUpperCase().substring(0, 3));
}

/**
 * Día de la semana en que se espera cada tarea.
 *
 * Si la tarea tiene día obligatorio, ese. Si no, se reparte de forma
 * estable entre los días laborables: la misma tarea cae siempre el mismo
 * día, y el conjunto queda repartido parejo a lo largo de la semana.
 *
 * Esto reemplaza al comportamiento anterior, donde toda la carga de la
 * ventana semanal aparecía el primer día.
 */
function diaAsignado(tarea) {
  const dias = diasLaborables();
  const pref = String(tarea.DIA_PREFERIDO || '').toUpperCase().substring(0, 3);
  if (pref && dias.indexOf(pref) !== -1) return pref;

  const id = String(tarea.ID_TAREA || '');
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) % 100000;
  return dias[n % dias.length];
}
```

### Reemplazo 2 de 4 — el cálculo del día

**Buscá:**

```javascript
    // si tiene día fijo, recién aparece a partir de ese día de la semana
    const pref = String(t.DIA_PREFERIDO || '').toUpperCase().substring(0, 3);
    const esDeHoy = !pref || nombreDia(fecha) === pref || nombreDia(fecha) > pref;
```

**Reemplazalo por:**

```javascript
    const pref = String(t.DIA_PREFERIDO || '').toUpperCase().substring(0, 3);
    const frec = String(t.FRECUENCIA).toUpperCase();
    const asign = (frec === 'DIARIA') ? nombreDia(fecha) : diaAsignado(t);
    const iHoy = indiceDia(nombreDia(fecha));
    const iAsign = indiceDia(asign);

    // Una tarea no desaparece si no se hizo el día que le tocaba: sigue a
    // la vista el resto de la semana. En un día no laborable se muestra
    // todo lo que quede pendiente de la semana.
    const esDeHoy = (frec === 'DIARIA') || (iHoy === -1) || (iHoy >= iAsign);
```

### Reemplazo 3 de 4 — los datos que se envían a la app

**Buscá:**

```javascript
      diaPreferido: pref,
      urgente: !!pref && nombreDia(fecha) === pref,
      disponibleHoy: esDeHoy,
```

**Reemplazalo por:**

```javascript
      diaPreferido: pref,
      diaAsignado: asign,
      urgente: !!pref && nombreDia(fecha) === pref,
      atrasadaSemana: iHoy > iAsign && iAsign !== -1,
      disponibleHoy: esDeHoy,
```

### Reemplazo 4 de 4 — el orden de la lista

**Buscá:**

```javascript
    if (a.urgente !== b.urgente) return a.urgente ? -1 : 1;
```

**Reemplazalo por:**

```javascript
    if (a.urgente !== b.urgente) return a.urgente ? -1 : 1;
    if (a.atrasadaSemana !== b.atrasadaSemana) return a.atrasadaSemana ? -1 : 1;
```

Guardá con Ctrl+S y publicá: **Implementar → Administrar implementaciones → lápiz ✏ → Versión: Nueva versión → Implementar**.

---

## Parte 2 — App (GitHub)

Subí a tu repositorio los dos archivos actualizados:

- **index.html** — contadores y vistas nuevas
- **sw.js** — ya viene con la versión `gmp-v3`, que es lo que fuerza a los teléfonos a bajar la versión nueva

En el repositorio: **Add file → Upload files**, arrastrás los dos, Commit changes.

---

## Parte 3 — Probar

1. En el celular, cerrá la app por completo y abrila dos veces (la primera baja la versión nueva, la segunda la muestra).
2. El primer contador ahora dice **"Para hoy"** en lugar de "Pendientes", y el número tiene que ser mucho más chico.
3. Debajo aparece un botón **"Toda la semana"** con el total, por si el técnico quiere adelantar trabajo.
4. Entrá a una tarea: abajo del todo de la ficha figura el día que le toca.

---

## Si querés reducir todavía más

El reparto por día acomoda la carga, pero no cambia el volumen total. Si después de verlo repartido seguís pensando que es demasiado, los tres lugares donde se recorta de verdad son:

**Los equipos del local.** El más efectivo y el que menos duele. Panel → Equipos por local: todo tipo de equipo que el local no tenga y esté marcado genera tareas fantasma. Es el primer lugar donde mirar.

**Las frecuencias del catálogo.** Panel → Tareas, columna Frecuencia. Varias quedaron en semanal porque así venían del Excel, sin que nadie hubiera revisado si era realista. La limpieza de carcasa de los splits, por ejemplo, difícilmente necesite ser semanal.

**Las excepciones por local.** Panel → Excepciones, cuando el catálogo general está bien pero un local puntual no necesita esa frecuencia. Acción `CAMBIAR_FRECUENCIA` o `EXCLUIR`, sin tocar los otros 149 locales.

Un aviso sobre editar frecuencias a mano en la planilla: el servidor guarda una copia de las tablas por 10 minutos. Si editás desde el panel, el cambio se ve al instante; si editás la planilla directamente, esperá 10 minutos o ejecutá la función `marcarMaestrosCambiados` desde el editor.
