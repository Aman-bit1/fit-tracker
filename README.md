# FitTrack Pro

A comprehensive calorie tracking and fitness management platform built with the MERN stack (MongoDB, Express, React, Node.js).

![FitTrack Pro](https://img.shields.io/badge/FitTrack%20Pro-v1.0.0-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)

## Features

### Core Features
- **User Authentication** - Secure JWT-based signup/login with password hashing
- **Dashboard** - Real-time overview of daily calories, macros, and progress
- **Food Tracking** - Add, edit, delete food entries with calories and macros
- **Food Search** - Search foods via Edamam API with autocomplete
- **Goals System** - Set daily calorie and macro targets
- **Workout Tracking** - Log workouts with automatic calorie burn calculation

### Advanced Features
- **Weekly Analytics** - Visual charts showing trends and patterns
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile-first design that works on all devices
- **Real-time Updates** - Instant data synchronization

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Recharts for data visualization
- Context API for state management
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
fittrack-pro/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md
└── SPEC.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fittrack-pro
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRE=30d
   
   # Optional: Edamam API for food search
   EDAMAM_APP_ID=your_app_id
   EDAMAM_APP_KEY=your_app_key
   ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Start the backend server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

   The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Food Entries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods` | Get food entries |
| POST | `/api/foods` | Add food entry |
| PUT | `/api/foods/:id` | Update food entry |
| DELETE | `/api/foods/:id` | Delete food entry |
| GET | `/api/foods/weekly` | Get weekly stats |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | Get user goals |
| PUT | `/api/goals` | Update goals |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | Get workouts |
| POST | `/api/workouts` | Add workout |
| DELETE | `/api/workouts/:id` | Delete workout |
| GET | `/api/workouts/stats` | Get workout stats |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?query=` | Search foods |

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/fittrack-pro |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | Token expiration | 30d |
| EDAMAM_APP_ID | Edamam API App ID | - |
| EDAMAM_APP_KEY | Edamam API Key | - |

## Deployment

### Backend (Render/Railway)
1. Push your code to GitHub
2. Connect your repository to Render or Railway
3. Set environment variables in the dashboard
4. Deploy

### Frontend (Vercel)
1. Push your code to GitHub
2. Import project to Vercel
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy

## Usage

### Adding Food
1. Go to the Dashboard or Food Log page
2. Click "Add Food" button
3. Enter food details (name, calories, macros, meal type)
4. Click "Add Food"

### Searching Foods
1. Navigate to Search page
2. Enter a search term (e.g., "chicken")
3. Click a food item to add it
4. Select meal type and confirm

### Setting Goals
1. Go to Goals page
2. Set your daily calorie target
3. Set macro targets (protein, carbs, fats)
4. Click "Save Goals"

### Logging Workouts
1. Go to Workouts page
2. Click "Add Workout"
3. Select workout type
4. Enter duration
5. Confirm to add

## Screenshots

### Dashboard
- Daily calorie progress ring
- Macro breakdown cards
- Weekly calorie chart
- Recent food entries

### Food Log
- Date navigation
- Meal categorization
- Daily totals
- CRUD operations

### Analytics
- Weekly calorie intake chart
- Workout burn trends
- Macro distribution pie chart
- Streak tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues, please open an issue on GitHub.

---

Built with ❤️ using MERN Stack
