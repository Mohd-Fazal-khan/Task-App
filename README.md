# Task Management App

A professional cross-platform task management application built with React Native and Expo. This app helps users organize, track, and manage their daily tasks efficiently with features like tagging, filtering, calendar view, and authentication.

## Features

- **User Authentication**: Sign up, log in, and password recovery screens.
- **Task Management**: Add, edit, delete, and view tasks.
- **Tagging & Filtering**: Assign tags to tasks and filter them easily.
- **Calendar View**: Visualize tasks in a calendar format.
- **Modern UI**: Clean, responsive design with custom fonts and icons.
- **Navigation**: Intuitive tab and stack navigation.
- **Expo Integration**: Easy development and deployment with Expo.

## Folder Structure

```
task/
├── app.json
├── eslint.config.js
├── expo-env.d.ts
├── package.json
├── README.md
├── tsconfig.json
├── app/
│   ├── App.tsx
│   ├── components/
│   │   ├── FilterModal.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskListSection.tsx
│   │   └── TaskTag.tsx
│   ├── constants/
│   │   └── Colors.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── HomeTabs.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── LetsGoScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   └── home/
│   │       ├── AddTaskScreen.tsx
│   │       ├── AllTaskScreen.tsx
│   │       └── CalendarViewScreen.tsx
│   └── utils/
│       └── formatTags.ts
├── assets/
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf
│   └── images/
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       ├── img.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       └── splash-icon.png
├── firebase/
│   └── config.js
└── scripts/
    └── reset-project.js
```

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm >= 6.x
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd task
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   expo start
   ```

### Running on Device/Emulator

- Use Expo Go app on your mobile device or run on an emulator using Expo CLI.

## Scripts

- `npm start` - Start Expo development server
- `npm run lint` - Run ESLint
- `npm run reset` - Run project reset script

## Technologies Used

- **React Native**
- **Expo**
- **TypeScript**
- **Firebase** (for authentication and data storage)
- **ESLint** (for code quality)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact [your-email@example.com].

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
