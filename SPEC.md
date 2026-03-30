# FitTrack Pro - Specification Document

## 1. Project Overview

**Project Name:** FitTrack Pro
**Type:** Full-stack Web Application
**Core Functionality:** A comprehensive calorie tracking and fitness management platform that helps users monitor their daily nutrition, set fitness goals, track workouts, and analyze their progress over time.
**Target Users:** Fitness enthusiasts, dieters, athletes, and anyone looking to track their nutrition and fitness goals.

---

## 2. Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** Context API + useReducer
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

### External APIs
- **Food Search:** Edamam Food Database API (free tier)

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** `#10B981` (Emerald Green - health/fitness theme)
- **Primary Dark:** `#059669`
- **Primary Light:** `#34D399`
- **Secondary:** `#F59E0B` (Amber - for accents)
- **Background Light:** `#F9FAFB`
- **Background Dark:** `#111827`
- **Card Light:** `#FFFFFF`
- **Card Dark:** `#1F2937`
- **Text Primary Light:** `#111827`
- **Text Primary Dark:** `#F9FAFB`
- **Text Secondary:** `#6B7280`
- **Error:** `#EF4444`
- **Success:** `#10B981`
- **Warning:** `#F59E0B`

### Typography
- **Font Family:** Inter (Google Fonts)
- **Headings:** 
  - H1: 2.5rem (40px), font-weight: 700
  - H2: 2rem (32px), font-weight: 600
  - H3: 1.5rem (24px), font-weight: 600
  - H4: 1.25rem (20px), font-weight: 500
- **Body:** 1rem (16px), font-weight: 400
- **Small:** 0.875rem (14px), font-weight: 400

### Spacing System
- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- **Container max-width:** 1280px
- **Card padding:** 24px
- **Section gap:** 32px

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Layout Structure

#### Public Pages
1. **Landing Page**
   - Hero section with app introduction
   - Features showcase
   - CTA buttons for signup/login

2. **Login Page**
   - Email input
   - Password input
   - Remember me checkbox
   - Login button
   - Link to signup

3. **Signup Page**
   - Name input
   - Email input
   - Password input
   - Confirm password
   - Signup button
   - Link to login

#### Protected Pages
1. **Dashboard**
   - Top navigation bar with logo, user menu, dark mode toggle
   - Sidebar navigation (desktop) / Bottom nav (mobile)
   - Main content area with:
     - Today's summary card (calories, macros)
     - Calorie progress ring chart
     - Macro distribution pie chart
     - Recent food entries
     - Quick add food button
     - Weekly progress line chart

2. **Food Log Page**
   - Date selector
   - Food entries list with CRUD operations
   - Add food form (manual or search)
   - Daily total summary

3. **Search Food Page**
   - Search input with autocomplete
   - Results grid with food cards
   - Click to add to log

4. **Goals Page**
   - Daily calorie goal input
   - Macro targets (protein, carbs, fats)
   - Progress visualization
   - Save button

5. **Workouts Page**
   - Workout type selector
   - Duration input
   - Calories burned estimate
   - Workout history list

6. **Analytics Page**
   - Weekly/Monthly calorie chart
   - Macro breakdown
   - Streak counter
   - Average intake stats

### Component States
- **Buttons:** Default, Hover (scale 1.02), Active (scale 0.98), Disabled (opacity 0.5)
- **Inputs:** Default, Focus (ring-2 primary), Error (ring-2 red), Disabled
- **Cards:** Default, Hover (shadow-lg)
- **Loading:** Skeleton loaders with pulse animation

### Animations
- **Page transitions:** Fade in (200ms)
- **Card hover:** Transform scale + shadow (150ms ease)
- **Button click:** Scale down (100ms)
- **Chart animations:** 500ms ease-out on mount
- **Modal:** Fade + slide up (200ms)

---

## 4. Functionality Specification

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Auto logout on token expiration
- Protected route wrapper component
- Password requirements: min 6 characters

### Food Tracking
- Manual food entry with: name, calories, protein, carbs, fats
- Edit existing entries
- Delete entries with confirmation
- Group by meal type (breakfast, lunch, dinner, snack)
- Daily totals calculation
- Food search via Edamam API with autocomplete

### Goals System
- Set daily calorie goal (default: 2000 kcal)
- Set macro targets in grams
- Progress calculation: (current / goal) * 100
- Visual progress bars

### Activity Tracking
- Predefined workout types: Running, Walking, Cycling, Swimming, Weight Training, Yoga, HIIT, Other
- Duration in minutes
- Estimated calories burned based on workout type and duration
- Workout history with date

### Analytics
- 7-day calorie trend line chart
- Macro distribution pie chart
- Average daily intake
- Streak calculation (consecutive days meeting calorie goal)
- Weekly summary cards

### Dark Mode
- Toggle in navbar
- Persisted in localStorage
- System preference detection on first load
- Smooth transition between modes

### Notifications
- Toast notifications for actions (success/error)
- Position: top-right
- Auto-dismiss after 3 seconds

---

## 5. API Endpoints

### Auth
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Food Entries
- `GET /api/foods` - Get all food entries (with date filter)
- `POST /api/foods` - Add food entry
- `PUT /api/foods/:id` - Update food entry
- `DELETE /api/foods/:id` - Delete food entry

### Goals
- `GET /api/goals` - Get user goals
- `PUT /api/goals` - Update goals

### Workouts
- `GET /api/workouts` - Get workout history
- `POST /api/workouts` - Add workout
- `DELETE /api/workouts/:id` - Delete workout

### Search
- `GET /api/search?query=` - Search food in external API

---

## 6. Database Schema

### User
```
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  calorieGoal: Number (default: 2000),
  proteinGoal: Number (default: 150),
  carbsGoal: Number (default: 250),
  fatsGoal: Number (default: 65),
  createdAt: Date
}
```

### FoodEntry
```
{
  user: ObjectId (ref: User),
  name: String (required),
  calories: Number (required),
  protein: Number,
  carbs: Number,
  fats: Number,
  mealType: String (enum: breakfast, lunch, dinner, snack),
  date: Date (required),
  createdAt: Date
}
```

### Workout
```
{
  user: ObjectId (ref: User),
  type: String (required),
  duration: Number (required, minutes),
  caloriesBurned: Number (required),
  date: Date (required),
  createdAt: Date
}
```

---

## 7. Folder Structure

```
fittrack-pro/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── food/
│   │   │   ├── layout/
│   │   │   └── auth/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── README.md
└── SPEC.md
```

---

## 8. Acceptance Criteria

### Authentication
- [ ] User can signup with name, email, password
- [ ] User can login with email and password
- [ ] Invalid credentials show error message
- [ ] Protected routes redirect to login
- [ ] JWT token is stored and sent with requests

### Dashboard
- [ ] Shows today's total calories
- [ ] Shows macros breakdown (protein, carbs, fats)
- [ ] Displays progress towards daily goal
- [ ] Shows recent food entries
- [ ] Charts render correctly

### Food Tracking
- [ ] User can add food with all fields
- [ ] User can edit existing food
- [ ] User can delete food with confirmation
- [ ] Daily totals update automatically
- [ ] Foods grouped by meal type

### Search
- [ ] Search input triggers API call
- [ ] Results display in grid
- [ ] Clicking result adds to food log
- [ ] Loading state shown during search

### Goals
- [ ] User can set calorie goal
- [ ] User can set macro goals
- [ ] Progress displays correctly

### Workouts
- [ ] User can add workout with type and duration
- [ ] Calories burned calculated automatically
- [ ] Workout history displays

### UI/UX
- [ ] Dark mode toggle works
- [ ] Responsive on mobile/tablet/desktop
- [ ] Smooth animations
- [ ] Loading states shown
- [ ] Error messages displayed

### Performance
- [ ] Page load < 3 seconds
- [ ] API responses < 1 second
- [ ] No console errors
- [ ] Smooth scrolling and interactions
# frontend/.env.production
VITE_API_URL=https://fittrack-pro-api.onrender.com
Deploy to Vercel
Go to https://vercel.com → Sign up → "Add New..." → "Project"
Import your GitHub repo
Settings:
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Add Environment Variable:
VITE_API_URL = https://fittrack-pro-api.onrender.com
Click "Deploy"
3. Update MongoDB Atlas
Go to MongoDB Atlas → Network Access
Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
This allows Render/Vercel to connect