# CineGalería

Galería de películas y series hecha con Next.js. Muestra una cartelera con títulos populares y un buscador con la ficha completa de cada película. Los datos vienen de [OMDb API](https://www.omdbapi.com/).

## Tecnologías

- Next.js 16 (App Router) con TypeScript
- Tailwind CSS
- axios

## Instalación

Necesitas Node.js 20 o superior y una API key gratuita de OMDb ([pídela aquí](https://www.omdbapi.com/apikey.aspx)).

```bash
npm install
cp .env.example .env.local
```

Abre `.env.local` y pega tu key:

```
OMDB_API_KEY=tu_api_key_aqui
```

## Uso

```bash
npm run dev
```

Abre [http://localhost:3002](http://localhost:3002).

## SSR y CSR

- **Página principal (`/`), SSR:** se renderiza en el servidor en cada visita. Las películas llegan ya dentro del HTML, así la página carga con contenido y los buscadores la pueden leer.
- **Buscador (`/buscar`) y modal de detalle, CSR:** se ejecutan en el navegador porque necesitan estado, eventos y efectos: los resultados se actualizan mientras escribes y el detalle se abre sin recargar la página.

La API key nunca llega al navegador. El buscador llama a las rutas propias `/api/search` y `/api/movie/[id]`, y es el servidor quien consulta OMDb.

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. En **Environment Variables** agrega `OMDB_API_KEY` con tu key.
3. Despliega. Vercel detecta Next.js y usa `npm run build` automáticamente.
