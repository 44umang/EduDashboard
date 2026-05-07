# Content Broadcasting System Frontend

Frontend assignment implementation for a role-based educational content broadcasting workflow.

## Tech Stack

- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS

## Setup

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Run lint:
   - `npm run lint`
4. Build for production:
   - `npm run build`
5. Preview production build:
   - `npm run preview`

## Demo Login

- Use any valid email format and password with at least 4 characters.
- Select role during login:
  - `teacher`
  - `principal`

## Route Map

- Auth:
  - `/login`
- Teacher:
  - `/dashboard/teacher`
  - `/dashboard/teacher/upload`
  - `/dashboard/teacher/content`
- Principal:
  - `/dashboard/principal`
  - `/dashboard/principal/approvals`
  - `/dashboard/principal/content`
- Public:
  - `/live/:teacherId`

## Implemented Features

- Authentication + role-based routing
- Teacher content upload with validation and file preview
- Teacher content list with status, schedule, rejection reason, and preview
- Principal approval workflow (approve/reject with mandatory rejection reason)
- Principal all-content filtering (status + search) and pagination
- Public live content page with polling
- Loading, error, success, and empty states
- Reusable components, toasts, and skeleton loaders
- Service-layer architecture (replaceable mock API design)

## Project Structure

- `src/components` reusable UI components
- `src/pages` route-level screens
- `src/layouts` shared app layout
- `src/services` API/service abstraction and mock data logic
- `src/context` auth and toast providers
- `Frontend-notes.txt` architecture and implementation notes

## Assumptions

- This submission uses static/mock data and simulated network delays.
- Uploaded files are stored in memory for the current runtime session only.
- `teacherId=1` is used for demo live route behavior.

## Deployment

- Live URL: `<add-deployment-link-here>`

## Submission Checklist

- Public GitHub repository
- README with setup steps
- Frontend-notes.txt
- Deployment link:-https://edudashboard-app.vercel.app
