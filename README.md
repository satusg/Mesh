# Mesh

Mesh is a full-stack checkout demo with:

- a React + Vite frontend in `frontend`
- an Express + TypeScript backend in `backend`
- Mesh Connect payment initiation and webhook handling

## Local development

Install dependencies and run both apps:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5174` and backend runs on `http://localhost:3001`.

## Deploy on Render

This repo includes [`render.yaml`](./render.yaml) so you can deploy both services from the same GitHub repository.

### 1. Create the backend service

Create a Render Blueprint or Web Service from this repository and use the backend service defined in `render.yaml`.

Set these backend environment variables:

- `NODE_ENV=production`
- `ENABLE_CLIENT_PAYMENT_CONFIRMATION=true`
- `LICENSE_SECRET=<long-random-secret>`
- `MESH_CLIENT_ID=<your-mesh-client-id>`
- `MESH_CLIENT_SECRET=<your-mesh-client-secret>`
- `MESH_RECEIVING_ADDRESS=<your-wallet-address>`
- `MESH_NETWORK_ID=<your-network-id>`
- `MESH_ASSET_SYMBOL=USDC`

Leave `CORS_ORIGIN` blank until your frontend URL exists, then set it to the deployed frontend origin.

Example:

```bash
CORS_ORIGIN=https://mesh-frontend.onrender.com
```

You can also allow local and hosted frontend together:

```bash
CORS_ORIGIN=http://localhost:5174,https://mesh-frontend.onrender.com
```

### 2. Create the frontend static site

Create the static site from the same repository using the frontend service in `render.yaml`.

Set these frontend environment variables:

- `VITE_API_URL=<your-backend-url>`
- `VITE_MESH_CLIENT_ID=<your-mesh-client-id>`
- `VITE_PRODUCT_ID=a1b2c3d4-0000-0000-0000-000000000001`

Example:

```bash
VITE_API_URL=https://mesh-api.onrender.com
```

### 3. Update backend CORS

After the frontend deploy gives you its public URL, update backend `CORS_ORIGIN` to match the frontend origin and redeploy the backend once.

### 4. Update Mesh dashboard settings

To make the hosted checkout flow work, add your deployed frontend origin to the allowed Mesh origins or callback settings in the Mesh dashboard.

At minimum, make sure the hosted frontend URL is allowed alongside your local development origin if you want to test both.

## Required environment variables

See [`.env.example`](./.env.example) for the full list used by frontend and backend.
