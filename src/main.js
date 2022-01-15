import { createApp } from 'vue'
import App from './App.vue'
import Menu from './components/Menu.vue'
import DataView from './components/DataView.vue'

createApp(App).mount('#app')
createApp(Menu).mount('#menu')
createApp(DataView).mount('#data-view')