
# **Assistant Front**

**Version:** `0.0.1`  
A frontend application built with Angular for creating dynamic, responsive, and scalable user interfaces. This project leverages Angular's ecosystem, PrimeNG components, and ngx-translate for internationalization.

---

## **Prerequisites**

To run or build the project, ensure the following are installed on your system:

- **Node.js**: Version `18.19.0` or higher  
  [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js; ensure it's up to date.
- **Angular CLI**: Version `18.0.2`  
  Install globally if not already installed:
  ```bash
  npm install -g @angular/cli
  ```

---
## Environment Variables

Before running the application, ensure the following environment variables in the `src/app/environments` files are configured to match your project's needs:

| **Variable**       | **Description**                                      |
|---------------------|-----------------------------------------------------|
| `host`             | The base URL for your Databricks instance.           |
| `username`         | The Databricks client_id for authentication.         |
| `password`         | The Databricks access_token for authentication.      |
| `document_path`    | Path to the main document storage.                   |
| `upload_path`      | Path for user-uploaded temporary files.              |
| `endpoint_name`    | Name of the model API endpoint being used.           |


## **Installation**

Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd assistant-front
npm install
```

---

## **Available Scripts**

The following npm scripts are available to manage and run the project:

### **Development**

- **Start the development server**:
  ```bash
  npm run start
  ```
  Opens the app on [http://localhost:4200](http://localhost:4200).

- **Start with proxy configuration**:
  ```bash
  npm run start:proxy
  ```
  Redirects API requests as defined in `src/proxy.conf.json`.

- **Start in production mode**:
  ```bash
  npm run start:prod
  ```
  Runs the app with the production configuration.

### **Build**

- **Build for development**:
  ```bash
  npm run build
  ```

- **Build for production**:
  ```bash
  npm run build:prod
  ```

- **Watch for changes and rebuild**:
  ```bash
  npm run watch
  ```

### **Testing**

- **Run unit tests**:
  ```bash
  npm run test
  ```

---

## **Folder Structure**

- **`src/`**: Contains the application source code.
- **`src/proxy.conf.json`**: Proxy configuration for API requests during development.
- **`node_modules/`**: Installed dependencies.

---

## **Dependencies**

### **Core Dependencies**
- **Angular**: `^18.0.0` (core framework, router, forms, etc.)
- **RxJS**: `~7.8.0` (reactive programming)
- **PrimeNG**: `^17.18.0` (UI components)
- **ngx-translate**: `^15.0.0` (internationalization)

### **Development Dependencies**
- **Angular CLI**: `^18.0.2` (build and serve tools)
- **Karma**: `~6.4.0` (test runner)
- **TypeScript**: `~5.4.2` (JavaScript superset)

---

## **Proxy Configuration**

The proxy settings (`src/proxy.conf.json`) are used to redirect API calls during development to avoid CORS issues. Example configuration:
```json
{
  "/api": {
    "target": "http://backend-server:port",
    "secure": false,
    "changeOrigin": true
  }
}
```

Ensure your backend server is running at the specified `target` address.

---

## **Node Version**

This project requires Node.js version `18.19.0` or higher. Check your version:
```bash
node --version
```

---

## **Contributing**

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push to your branch.
4. Open a pull request.

---

## **License**

This project is private and not intended for public use or distribution.

