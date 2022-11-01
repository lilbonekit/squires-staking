import { createWebHistory, createRouter } from 'vue-router'
import ConnectWallet from '@/pages/ConnectWallet'
import Home from '@/pages/Home'

const routes = [
  { name: 'connect-wallet', path: '/', component: ConnectWallet },
  { name: 'home', path: '/home', component: Home },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
