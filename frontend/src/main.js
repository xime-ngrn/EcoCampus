import './assets/styles/tokens.css'
import './assets/styles/base.css'
import './assets/styles/components.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // Pinia primero: el router usa el store de sesión
app.use(router)

app.mount('#app')
