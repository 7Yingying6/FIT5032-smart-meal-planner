"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importRecipes = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const params_1 = require("firebase-functions/params");
// Initialize Admin SDK once
admin.initializeApp();
const db = admin.firestore();
// Secret token for protection (managed via Secret Manager)
const IMPORT_TOKEN_SECRET = (0, params_1.defineSecret)('IMPORT_TOKEN');
// Load recipes JSON bundled with the function
const recipes_json_1 = __importDefault(require("./data/recipes.json"));
exports.importRecipes = functions
    .runWith({ secrets: ['IMPORT_TOKEN'] })
    .region('us-central1')
    .https.onRequest(async (req, res) => {
    // Allow only POST method
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    // Resolve secret value with local fallback for development
    const secretToken = (await IMPORT_TOKEN_SECRET.value()) || process.env.IMPORT_TOKEN || 'REPLACE_WITH_SECRET_TOKEN';
    // Basic auth via token header or query
    const tokenHeader = req.headers['x-import-token'];
    const tokenQuery = req.query.token;
    const token = (Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader) || (Array.isArray(tokenQuery) ? tokenQuery[0] : tokenQuery);
    if (!token || token !== secretToken) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const collectionRef = db.collection('recipes');
        let inserted = 0;
        let skipped = 0;
        // Optional: skip if a recipe with same id already exists
        for (const recipe of recipes_json_1.default) {
            const id = String(recipe.id);
            const docRef = collectionRef.doc(id);
            const doc = await docRef.get();
            if (doc.exists) {
                skipped++;
                continue;
            }
            await docRef.set(recipe, { merge: true });
            inserted++;
        }
        res.status(200).json({ success: true, inserted, skipped, total: recipes_json_1.default.length });
    }
    catch (error) {
        console.error('Import failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
