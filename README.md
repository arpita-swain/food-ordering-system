# FoodieGo Frontend

FoodieGo is a responsive food ordering and restaurant discovery website built with React. This repository contains the client side of the application, including its pages, reusable interface components, and interactive demo flows.

## Tech stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Leaflet and React Leaflet
- Lucide React icons

## Run locally

### Requirements

- Node.js and npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

### Create a production build

```bash
npm run build
```

To serve the production build locally:

```bash
npm run preview
```

## Frontend pages

- `/` — restaurant and food discovery
- `/search` — search and browse results
- `/restaurant/:id` — restaurant details and menu
- `/cart` and `/checkout` — cart and checkout interface
- `/order-confirmed/:id` and `/track/:id` — order confirmation and tracking views
- `/orders` — order history
- `/favorites` — saved restaurants or dishes
- `/profile`, `/login`, and `/register` — account interface
- `/support` — help and support
- `/delivery` — delivery partner demo view
- `/admin` — admin dashboard demo view

## Project structure

```text
src/
  api/          Frontend API client and service modules
  components/   Shared UI, food, restaurant, map, and modal components
  context/      Shared React state providers
  data/         Initial demo data
  pages/        Route-level page components
  routes/       Application route definitions
  utils/        Formatting and invoice helpers
```

## Notes

This README covers the frontend project. The delivery and admin pages are frontend views, and interactive checkout, tracking, and payment screens should be treated as demo UI unless connected to a real service. API modules in `src/api/` provide the frontend integration layer; backend services and deployment are outside this repository's frontend documentation.
