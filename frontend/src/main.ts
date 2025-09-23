import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

// Create Vue app
const app = createApp(App);

// Use router
app.use(router);

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error("Global error:", err);
  console.error("Component instance:", instance);
  console.error("Error info:", info);

  // Here you could send error to monitoring service
  // Example: Sentry.captureException(err);
};

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  console.warn("Global warning:", msg);
  console.warn("Component instance:", instance);
  console.warn("Trace:", trace);
};

// Mount app
app.mount("#app");

// Handle uncaught Promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});
