# 🏎️ AutoInventory

A comprehensive, ultra-premium RESTful API and web application for managing a high-end car dealership inventory with authentication and role-based access control.

## 📋 Overview

A luxurious, high-contrast web application built with bespoke UI/UX and a robust backend. Features include:

- User authentication with JWT and role-based access control (Customer/Admin)
- Real-time vehicle inventory CRUD operations
- Dynamic Search, Filter, and Category logic
- Purchase reservations and stock management (Restock operations)
- Ultra-premium Split-Screen UI with Framer Motion animations
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Node.js, Express.js, PostgreSQL (Neon DB)

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database (e.g., Neon DB)
- npm/yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Chintan616/car-dealership-inventory-system.git
cd car-dealership-inventory-system

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Configure environment

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://your_db_connection_string
JWT_SECRET=your_strong_secret_key
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run application

Open two terminal windows:

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint                     | Auth Required | Role   | Description                                    |
| ------ | ---------------------------- | ------------- | ------ | ---------------------------------------------- |
| POST   | `/api/auth/register`         | ❌            | Public | Register a new user                            |
| POST   | `/api/auth/login`            | ❌            | Public | Login and receive JWT token                    |
| GET    | `/api/vehicles`              | ❌            | Public | Get all vehicles                               |
| GET    | `/api/vehicles/search`       | ❌            | Public | Search by make, model, category, min/max price |
| POST   | `/api/vehicles`              | ✅            | Admin  | Create a new vehicle listing                   |
| PUT    | `/api/vehicles/:id`          | ✅            | Admin  | Update vehicle details                         |
| DELETE | `/api/vehicles/:id`          | ✅            | Admin  | Delete a vehicle listing                       |
| POST   | `/api/vehicles/:id/purchase` | ✅            | All    | Reserve/purchase a vehicle (decreases stock)   |
| POST   | `/api/vehicles/:id/restock`  | ✅            | Admin  | Restock a vehicle (increases stock)            |

## 🎯 TDD Approach: Red-Green-Refactor

This project incorporates the Test-Driven Development (TDD) cycle for its core backend logic:

### TDD Cycle Example: Fetching Vehicles

**🔴 Red Phase - Write Failing Test**

```javascript
describe('GET /api/vehicles', () => {
  it('should return a list of vehicles', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

_Result: Test fails ❌ (endpoint doesn't exist yet)_

**🟢 Green Phase - Minimal Implementation**

```javascript
export const getVehicles = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: [], // Hardcoded empty array to pass the test
  });
};
```

_Result: Test passes ✅_

**🔵 Refactor Phase - Improve Code**

```javascript
export const getVehicles = async (req, res) => {
  try {
    // Implement actual database query
    const result = await query('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
```

_Result: All tests still pass ✅, code is dynamic and handles database errors._

## 🏗️ Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Route handlers (auth, vehicles)
│   │   ├── middleware/  # JWT & Admin authentication
│   │   ├── routes/      # API routes
│   │   └── server.ts    # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI (Navbar, Cards, FilterBar)
    │   ├── contexts/    # Auth context provider
    │   ├── lib/         # Axios API configuration
    │   └── pages/       # Dashboard, Admin Cockpit, Auth forms
    ├── index.html
    └── package.json
```

## 🤖 My AI Usage

### Tools Used

- **Google Gemini (Antigravity):** Architecture design, complex UI engineering, and API development
- **GitHub Copilot:** Code completion and boilerplate generation

### How I Used AI

- **Boilerplate (20% AI):** Initial Express/React structures → manually configured routing and context.
- **Backend/API (40% AI):** Database schemas and endpoints → instructed AI to implement JWT validation and RESTful standards.
- **UI/UX Design (80% AI):** Provided the AI with screenshots of a luxury automotive platform → the AI reverse-engineered the aesthetics (colors, fonts, split-screen layouts).
- **Debugging (30% AI):** Deployed Vercel/Render configurations → analyzed logs and instructed AI to apply patches (like TypeScript deprecation fixes).

### Transparency

All AI-assisted commits include co-author attribution. For example:

```text
git commit -m "feat(frontend): implement ultra-premium UI redesign

Co-authored-by: Google Gemini <gemini-noreply@google.com>"
```

### My Approach

AI acted as a powerful Technical Co-Pilot. Every AI-generated line of code was:

- Reviewed for architectural correctness (e.g., ensuring secure admin routes).
- Verified against the business logic requirements.
- Tested locally before deployment to Vercel and Render.

## 👨‍💻 Author

**Chintan Kasundra**

- GitHub: [@Chintan616](https://github.com/Chintan616)
- Repository: [car-dealership-inventory-system](https://github.com/Chintan616/car-dealership-inventory-system)

## 📞 Contact & Support

For questions or feedback about this project:

- Open an issue on GitHub Issues
