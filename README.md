# Running the project

This guide will walk you through the process of extracting and running a the project I made for the following assignment: https://github.com/woltapp/engineering-internship-2024?tab=readme-ov-file.

## Prerequisites

Before you begin, ensure that you have the following software installed on your machine:

- Node.js (version 12.0.0 or later)
- Yarn (version 1.0.0 or later)

## Steps

1. **Download the Zipped File**

   Download the zipped file of the project onto your local machine.

2. **Extract the Zipped File**

   Once the download is complete, locate the zipped file in your system's file explorer. Right-click on the file and select "Extract All..." or "Unzip". Choose a suitable location for the extracted files.

3. **Open Terminal/Command Prompt**

   Navigate to the location where you extracted the files. Open a terminal/command prompt window here. On Windows, you can do this by holding Shift and right-clicking within the folder, then selecting "Open PowerShell window here" or "Open command window here".

4. **Install Dependencies**

   Run the following command to install the project's dependencies:

   ```bash
   yarn
   ```

5. **Start the Development Server**

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
