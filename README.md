# ZenLife Client

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## Project Description

ZenLife Client is a modern web application designed to promote a balanced lifestyle through various features including daily planning, finance tracking, chat functionalities, and positive thinking prompts. This application leverages the power of Vue.js and TypeScript to provide a responsive and engaging user experience.

### Key Features
- **Daily Planner**: Organize your tasks and schedule efficiently.
- **Finance Management**: Track your budget and expenses.
- **Chat Functionality**: Communicate with friends and family seamlessly.
- **Positive Thoughts**: Receive daily motivational prompts to uplift your mood.
- **Water Intake Tracker**: Monitor your hydration levels effectively.

## Tech Stack

| Technology          | Description                        |
|---------------------|------------------------------------|
| ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat&logo=vuedotjs&logoColor=white) | JavaScript framework for building user interfaces. |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | A superset of JavaScript that adds static types. |
| ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) | Backend service for authentication and real-time database. |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | A build tool that significantly improves the development experience. |

## Installation Instructions

### Prerequisites
- Node.js (v14 or later)
- npm (Node package manager)
- A Firebase account for backend services

### Step-by-Step Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ThommyShelby9/zenlife_client.git
   cd zenlife_client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and add your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

## Usage

To run the project locally, execute the following command:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Project Structure

The project is organized into several key directories and files:

```
zenlife_client/
├── public/                  # Static assets served by the app
│   ├── img/                 # Images and icons
│   ├── js/                  # JavaScript files
│   ├── favicon.ico          # Favicon for the application
│   ├── offline.html         # Offline page
│   └── robots.txt          # Robots.txt for SEO
├── src/                     # Source code for the application
│   ├── api/                 # API service files for interacting with backend
│   ├── assets/              # CSS and image assets
│   ├── components/          # Vue components for UI
│   ├── composables/         # Reusable logic using Vue's Composition API
│   ├── layouts/             # Layout components
│   ├── router/              # Vue Router configuration
│   ├── services/            # Services for business logic
│   ├── stores/              # Vuex store modules for state management
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── views/               # Vue views for different application pages
│   ├── App.vue              # Main Vue application component
│   ├── main.ts              # Entry point for the application
│   └── registerServiceWorker.ts # Service worker registration
├── .env                     # Environment variables for development
├── package.json             # Project metadata and dependencies
└── vite.config.ts           # Vite configuration file
```

### Main Directories
- **public**: Contains all static assets such as images, icons, and offline pages.
- **src**: The main source code for the application, organized into components, services, and views.
- **services**: Contains logic for interacting with APIs and managing business logic.
- **views**: Contains the different pages of the application, each represented as a Vue component.

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Open a pull request.

Thank you for your interest in contributing to ZenLife Client!
