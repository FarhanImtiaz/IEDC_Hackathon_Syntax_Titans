# 🔐 API Key Security Setup Guide

## ⚠️ URGENT: Your API Key Was Leaked

Your Gemini API key was exposed and flagged by Google's security systems. Follow these steps immediately:

## Step 1: Revoke the Old Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Find the leaked key (ending in `...K4Oi4`)
3. Click "Delete" or "Revoke" to disable it

## Step 2: Generate a New Key

1. In the same page, click **"Create API Key"**
2. Select your Google Cloud project (or create one)
3. Copy the new key (looks like: `AIzaSy...`)
4. **Do NOT share this key or commit it to Git!**

## Step 3: Configure Your Application

1. Open `config.js` in your project
2. Replace `'YOUR_NEW_GEMINI_API_KEY_HERE'` with your new key:
   ```javascript
   const API_CONFIG = {
     GEMINI_API_KEY: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX',  // ← Paste your new key here
     SARVAM_API_KEY: 'sk_bwbz2lvp_fH1cCnOrHBJb4djNaIiclkDm'
   };
   ```
3. Save the file

## Step 4: Verify Setup

1. Refresh your browser at http://localhost:8000
2. Try uploading a trauma image
3. The error should be gone!

## 🛡️ Security Best Practices

### ✅ DO:
- Keep `config.js` in `.gitignore` (already done ✓)
- Use environment variables for production deployments
- Rotate API keys regularly
- Set up usage quotas in Google Cloud Console

### ❌ DON'T:
- Hardcode API keys in source files
- Commit `config.js` to Git
- Share screenshots showing your API keys
- Push code with keys to GitHub/GitLab

## 📁 File Structure

```
IEDC_Hack/
├── config.js          ← YOUR SECRET FILE (not in Git)
├── .gitignore         ← Protects config.js
├── gemini-api.js      ← Loads from config.js
├── app.js
└── index.html
```

## 🚀 For Production/Deployment

If deploying to a server, use environment variables instead:

```javascript
// config.js for production
const API_CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  SARVAM_API_KEY: process.env.SARVAM_API_KEY || ''
};
```

Then set environment variables on your server:
```bash
export GEMINI_API_KEY="your-key-here"
export SARVAM_API_KEY="your-key-here"
```

## Need Help?

If you still see the error:
1. Double-check you've replaced the key in `config.js`
2. Make sure you deleted the old leaked key from Google AI Studio
3. Clear your browser cache and reload
4. Check browser console for any errors

---

**Remember**: API keys are like passwords - keep them secret and secure! 🔒
