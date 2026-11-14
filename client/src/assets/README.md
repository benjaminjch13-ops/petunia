# assets

Recursos gráficos que se importan desde el código.

Las ilustraciones de Petunia (mascota Tuni, hojas, flores decorativas, marcadores
de posición) son **SVG en línea** dentro de componentes React para poder animarlas
con CSS y cambiar expresiones/poses por props:

- `components/Mascot.jsx` — Tuni (expresiones y poses).
- `components/BotanicalDecor.jsx` — ramas, hojas y flores decorativas.
- `components/FlowerImage.jsx` — ilustración de respaldo mientras carga la foto.

Los archivos estáticos que se sirven tal cual están en `client/public/`
(`images/` logo, `icons/` favicon, `mascot/` exportación SVG de Tuni).
