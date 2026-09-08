# PUBLICAR LA APP DEL TÉCNICO EN GITHUB PAGES

Son cinco archivos y quince minutos. No hace falta instalar nada ni usar comandos.

Los archivos:

```
index.html        la app
sw.js             lo que permite abrirla sin señal
manifest.json     lo que permite instalarla en el teléfono
icon-192.png      ícono
icon-512.png      ícono grande
```

Los cinco van juntos, en la misma carpeta, con esos nombres exactos.

---

## PASO 1 — Crear la cuenta

Entrá a **github.com** y tocá **Sign up**. Pide correo, contraseña y un nombre de usuario.

El nombre de usuario va a formar parte de la dirección de la app, así que elegí algo sobrio: si ponés `mantenimiento-py`, la app va a quedar en `mantenimiento-py.github.io/app`.

Confirmá el correo que te llega y listo.

---

## PASO 2 — Crear el repositorio

Un repositorio es simplemente una carpeta en internet.

1. Arriba a la derecha, el **+** → **New repository**.
2. **Repository name**: `app` (corto, va en la dirección).
3. Dejá marcado **Public**.

   > Público significa que el código de la app se puede ver, no tus datos. Los datos viven en tus planillas, que siguen siendo privadas. Sin código y PIN válidos, nadie saca nada.

4. Marcá **Add a README file**.
5. **Create repository**.

---

## PASO 3 — Subir los archivos

1. Dentro del repositorio, botón **Add file** → **Upload files**.
2. Arrastrá los cinco archivos, o usá "choose your files".
3. Abajo, en **Commit changes**, escribí `Primera versión` y confirmá.

---

## PASO 4 — Encender GitHub Pages

1. Pestaña **Settings** (arriba del repositorio).
2. Menú izquierdo, **Pages**.
3. En **Source** elegí **Deploy from a branch**.
4. En **Branch** elegí **main**, carpeta **/ (root)**, y **Save**.

Esperá un par de minutos y recargá esa página: arriba te va a mostrar la dirección, algo como:

```
https://TU-USUARIO.github.io/app/
```

Esa es la dirección de la app. La que le pasás a los técnicos.

---

## PASO 5 — Instalarla en el teléfono

Abrila en el celular con Chrome.

Va a aparecer un botón **Instalar en el teléfono** después de entrar. Si no aparece, hacelo desde el menú de Chrome (los tres puntitos) → **Instalar aplicación** o **Agregar a pantalla principal**.

Una vez instalada abre como cualquier app: ícono propio, pantalla completa, sin barra de navegador.

---

## PASO 6 — Probar que funciona sin señal

Esta es la prueba que importa, y conviene hacerla antes de repartirla:

1. Abrí la app instalada y entrá con **T001**.
2. Dejá que sincronice: arriba a la derecha tiene que decir "Al día".
3. **Poné el teléfono en modo avión.**
4. Cerrá la app por completo y volvé a abrirla.
5. Tiene que abrir igual, mostrar las tareas y decir "Sin señal" arriba.
6. Registrá una tarea. Arriba va a decir "1 sin enviar".
7. Sacá el modo avión. En unos segundos vuelve a decir "Al día".
8. Abrí el panel: la tarea está registrada.

Si eso funciona, el requisito de trabajar sin conexión está cumplido de verdad.

---

## Cómo actualizar la app más adelante

Cuando te pase una versión nueva:

1. En el repositorio, **Add file** → **Upload files**, y subís el archivo cambiado con el mismo nombre. Se reemplaza solo.
2. Si cambió `index.html`, **también hay que subir `sw.js` con el número de versión aumentado** (`gmp-v1` → `gmp-v2`, en la primera línea). Sin eso, los teléfonos siguen mostrando la versión vieja guardada.

Los técnicos no tienen que hacer nada: la próxima vez que abran la app con señal, se actualiza sola.

---

## Si algo falla

| Qué ves | Qué pasa |
|---|---|
| La dirección da error 404 | Pages tarda unos minutos la primera vez. Esperá y recargá |
| Abre pero no deja entrar | Fijate que el código y el PIN sean los correctos. La primera vez hace falta señal |
| "Failed to fetch" al entrar | La URL del backend quedó mal en `index.html`, o la implementación de Apps Script no está publicada como "Cualquier usuario" |
| No ofrece instalarse | Tiene que ser Chrome y la dirección tiene que empezar con `https`. En iPhone se hace desde Compartir → Agregar a inicio |
| Se actualizó el archivo pero la app muestra lo viejo | Faltó subir el número de versión en `sw.js` |
