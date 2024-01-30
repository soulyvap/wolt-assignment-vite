# Running the project

This guide will walk you through the process of extracting and running a the project I made for the following assignment: https://github.com/woltapp/engineering-internship-2024?tab=readme-ov-file.

## Prerequisites

Before you begin, ensure that you have the following software installed on your machine:

- Node.js (version 12.0.0 or later)
- Yarn (version 1.0.0 or later)

## Steps

After extracting the files:

1. **Open Terminal/Command Prompt**

   Using the terminal of your choice, navigate to the folder you have extracted from the files.

3. **Install Dependencies**

   Run the following command to install the project's dependencies:

   ```bash
   yarn
   ```

4. **Start the Development Server**

   After the installation is complete, start the development server with the following command:

   ```bash
   yarn dev
   ```

   After running this command, you should see a message in the terminal indicating the URL where the application is running (usually http://localhost:5000 or similar). Copy this URL and paste it into your web browser to view the running application.

# Running tests

After the installation is complete, run the vitest tests using the following command:

```bash
 yarn test
```

The results of the tests will be shown in your terminal.
