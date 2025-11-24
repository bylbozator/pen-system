/* frontend/src/index.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

.pen-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.role-supplier .economist-field {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.role-economist .supplier-field {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

/* Цвета полей как в Excel */
.supplier-field {
  background-color: #e6f3ff !important; /* Голубой */
}

.supplier-field-green {
  background-color: #e6ffe6 !important; /* Зеленый */
}

.economist-field-purple {
  background-color: #f0e6ff !important; /* Лиловый */
}

.economist-field-yellow {
  background-color: #fffbe6 !important; /* Желтый */
}

.calculated-field {
  background-color: #f8f9fa !important;
  font-weight: bold;
}

.status-delivered {
  color: #52c41a;
}

.status-pending {
  color: #faad14;
}

.status-cancelled {
  color: #ff4d4f;
}