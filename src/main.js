import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'

// Font Awesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'


library.add(faTrash, faEdit)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
