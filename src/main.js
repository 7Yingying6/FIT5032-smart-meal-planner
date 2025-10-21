import { createApp } from 'vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'
import { Icon } from '@iconify/vue'
import appFirebase, { hasValidConfig } from '@/firebase.js'
import { getAuth, onAuthStateChanged, getIdTokenResult } from 'firebase/auth'
import userStorage from '@/utils/userStorage.js'

const app = createApp(App)
// Register global components BEFORE installing plugins like router to avoid early render errors
app.component('Icon', Icon)
app.use(router)

// Firebase Auth session listener: hydrate/clear local session (runs only if config is valid)
if (hasValidConfig && appFirebase) {
  const auth = getAuth(appFirebase)
  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        let derivedRole = 'user'
        try {
          const tokenResult = await getIdTokenResult(fbUser)
          const claims = tokenResult?.claims || {}
          if (claims.role) {
            derivedRole = claims.role
          } else if (Array.isArray(claims.roles) && claims.roles.includes('administrator')) {
            derivedRole = 'administrator'
          } else if (claims.admin === true) {
            derivedRole = 'administrator'
          }
        } catch (_) {}
        const sessionUser = {
          id: fbUser.uid,
          email: fbUser.email,
          role: derivedRole
        }
        userStorage.saveCurrentUser(sessionUser, true)
      } catch (e) {
        if (import.meta.env.DEV) console.debug('Auth listener error', e)
        userStorage.saveCurrentUser({ id: fbUser.uid, email: fbUser.email, role: 'user' }, true)
      }
    } else {
      userStorage.logout()
    }
  })
}

app.mount('#app')

// Service Worker: register only in production, cleanup in development
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  } else {
    // In development, ensure no service worker controls the page
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister())
    })
    if (window.caches && caches.keys) {
      caches.keys().then(keys => {
        keys.forEach(k => caches.delete(k))
      })
    }
  }
}
