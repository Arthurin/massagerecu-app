# Project general coding guidelines

## Code Style

- Use semantic HTML5 elements (header, main, section, article, etc.)
- Prefer modern JavaScript (ES6+) features like const/let, arrow functions, and template literals
- Prefer TyperScript over Javascript

## Architecture

- Stay organised and professionnal
- Project structure should follow best guidelines (https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)

## Naming Conventions

- Use PascalCase for component names, interfaces, and type aliases, React component files (e.g., UserProfile.js) to match the component name
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (\_)
- Use ALL_CAPS for constants
- Consistent naming conventions are crucial for readability and maintainability
- Kebab-Case for Folders in src/app/: Use kebab-case (e.g., user-profile) for folder names, as it's URL-friendly and commonly used in Next.js projects.
- Lowercase for Utilities: Use lowercase for utility files and directories (e.g., utils or fetch-data.js).

## Code Quality

- Use meaningful variable and function names that clearly describe their purpose
- Include helpful comments for complex logic
- Add error handling for user inputs and API calls
