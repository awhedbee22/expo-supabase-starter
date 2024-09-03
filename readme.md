# CannaJournal
## Introduction

CannaJournal is a comprehensive mobile application for tracking and optimizing cannabis experiences. Built using the Expo Supabase Starter template, it provides a robust foundation for both medical patients and recreational users to log, analyze, and understand their cannabis consumption patterns.

## Features

- Easy-to-use journal entries for cannabis sessions
- Track strains, consumption methods, dosage, and effects
- Mood and symptom tracking before and after use
- Detailed insights and reports on usage patterns
- Secure, private, and encrypted data storage

## Table of Contents

- [💻 Application Overview](#application-overview)
- [⚙️ Project Configuration](#project-configuration)
- [🗄️ Project Structure](#project-structure)
- [🧱 Components And Styling](#components-and-styling)
- [🗃️ State Management](#state-management)
- [🚀 Getting Started](#getting-started)
- [📚 Additional Resources](#additional-resources)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

## Application Overview

CannaJournal is built on a solid foundation using modern web technologies:

- **Expo**: For cross-platform mobile app development
- **Supabase**: Backend as a Service for authentication and data storage
- **Expo Router**: For seamless navigation
- **TypeScript**: For enhanced type safety
- **NativeWind**: Tailwind CSS for React Native, providing utility-first styling
- **React Hook Form**: For efficient form handling
- **Zod**: For schema validation

## Project Configuration

The project is configured with:

- **ESLint**: For identifying and reporting on patterns in JavaScript/TypeScript
- **Prettier**: For code formatting
- **TypeScript**: For static type checking
- **Absolute imports**: For cleaner import statements

For detailed configuration, refer to the `tsconfig.json`, `.eslintrc.js`, and `.prettierrc` files in the project root.

## Project Structure

The project structure is organized as follows:

```
root
|
+-- app               # Contains all screens and layouts (Expo Router)
|
+-- assets            # Static assets (images, fonts, icons)
|
+-- components        # Reusable React components
|
+-- config            # Configuration files
|
+-- context           # React Context providers
|
+-- lib               # Utility functions and constants
```

## Components And Styling

CannaJournal uses a component-based architecture with NativeWind for styling:

- Custom UI components are located in the `components` directory
- Styling is done using Tailwind CSS classes via NativeWind
- The app supports both light and dark modes

## State Management

- **Form State**: Managed using React Hook Form
- **Global State**: Handled through React Context (see `context` directory)
- **Data Persistence**: Achieved using Supabase

## Getting Started

To set up CannaJournal locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/YourGithubUsername/CannaJournal.git
   cd CannaJournal
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up your Supabase project and update the `.env` file with your Supabase URL and API key.

4. Start the development server:
   ```bash
   yarn start
   ```

5. Follow the Expo CLI instructions to run the app on your desired platform (iOS simulator, Android emulator, or physical device).

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.io/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Hook Form Documentation](https://react-hook-form.com/)

## Contributing

Contributions to CannaJournal are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.