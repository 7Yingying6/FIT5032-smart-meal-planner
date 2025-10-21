import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { defineSecret } from 'firebase-functions/params'

// Initialize Admin SDK once
admin.initializeApp()
const db = admin.firestore()

// Secret token for protection (managed via Secret Manager)
const IMPORT_TOKEN_SECRET = defineSecret('IMPORT_TOKEN')

// Load recipes JSON bundled with the function
import recipes from './data/recipes.json'

export const importRecipes = functions
  .runWith({ secrets: ['IMPORT_TOKEN'] })
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    // Allow only POST method
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }

    // Resolve secret value with local fallback for development
    const secretToken = (await IMPORT_TOKEN_SECRET.value()) || process.env.IMPORT_TOKEN || 'REPLACE_WITH_SECRET_TOKEN'

    // Basic auth via token header or query
    const tokenHeader = req.headers['x-import-token']
    const tokenQuery = req.query.token
    const token = (Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader) || (Array.isArray(tokenQuery) ? tokenQuery[0] : tokenQuery)

    if (!token || token !== secretToken) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    try {
      const collectionRef = db.collection('recipes')

      let inserted = 0
      let skipped = 0

      // Optional: skip if a recipe with same id already exists
      for (const recipe of recipes) {
        const id = String(recipe.id)
        const docRef = collectionRef.doc(id)
        const doc = await docRef.get()
        if (doc.exists) {
          skipped++
          continue
        }
        await docRef.set(recipe, { merge: true })
        inserted++
      }

      res.status(200).json({ success: true, inserted, skipped, total: recipes.length })
    } catch (error) {
      console.error('Import failed:', error)
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  })