import { createRouter, createWebHistory } from 'vue-router'

// Use dynamic imports to enable code splitting
const Home = () => import('../views/Home.vue')
const Recipes = () => import('../views/Recipes.vue')
const RecipeDetail = () => import('../views/RecipeDetail.vue')
const MealPlan = () => import('../views/MealPlan.vue')
const Auth = () => import('../views/Auth.vue')
const Disclaimer = () => import('../views/Disclaimer.vue')
const LetsGoShopping = () => import('../views/LetsGoShopping.vue')
import userStorage from '../utils/userStorage'
import app, { db, hasValidConfig } from '@/firebase.js'
import { getAuth, getIdTokenResult } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: Recipes
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetail,
    props: true
  },
  {
    path: '/meal-plan',
    name: 'MealPlan',
    component: MealPlan,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: Disclaimer
  },
  {
    path: '/shopping',
    name: 'LetsGoShopping',
    component: LetsGoShopping
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth & Role navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRole = to.meta?.requiresRole // string | string[] | undefined

  const auth = hasValidConfig && app ? getAuth(app) : null
  let sessionUser = userStorage.getCurrentUser()

  // If route requires auth but local session missing, try Firebase (only when config valid)
  if (requiresAuth && !sessionUser) {
    const fbUser = auth?.currentUser
    if (!fbUser) {
      return next({ path: '/auth', query: { redirect: to.fullPath } })
    }
    if (hasValidConfig && db) {
      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid))
        const profile = snap.exists() ? snap.data() : {}
        let derivedRole = profile.role || 'user'
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
        sessionUser = {
          id: fbUser.uid,
          email: fbUser.email,
          firstName: profile.firstName || 'User',
          lastName: profile.lastName || '',
          role: derivedRole
        }
        userStorage.saveCurrentUser(sessionUser, true)
      } catch (e) {
        if (import.meta.env.DEV) console.debug('Failed to hydrate session from Firestore:', e)
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
        sessionUser = { id: fbUser.uid, email: fbUser.email, role: derivedRole }
        userStorage.saveCurrentUser(sessionUser, true)
      }
    }
  }

  // Enforce auth
  if (requiresAuth && !sessionUser) {
    return next({ path: '/auth', query: { redirect: to.fullPath } })
  }

  // Enforce role if configured
  if (requiredRole && sessionUser) {
    let effectiveRole = sessionUser.role || 'user'
    const fbUser = auth?.currentUser
    if (fbUser) {
      try {
        const tokenResult = await getIdTokenResult(fbUser)
        const claims = tokenResult?.claims || {}
        if (claims.role) {
          effectiveRole = claims.role
        } else if (Array.isArray(claims.roles) && claims.roles.includes('administrator')) {
          effectiveRole = 'administrator'
        } else if (claims.admin === true) {
          effectiveRole = 'administrator'
        }
      } catch (_) {}
    }
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(effectiveRole)) {
      return next({ path: '/', query: { denied: 'role' } })
    }
  }

  return next()
})

export default router