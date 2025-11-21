# Synapse Care: Rural Healthcare AI Platform

![Synapse Care](https://img.shields.io/badge/AI-Healthcare-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

A comprehensive AI-powered healthcare platform leveraging Google's Gemini multimodal capabilities to support rural healthcare workers in India. The platform consists of three independent modules designed to address critical healthcare challenges.

## 🌟 Features

### 1. 🚑 ET-AI Trauma Triage (The First Responder)
- **Purpose**: Immediate emergency assessment for trauma cases
- **Input**: Photo of physical injury
- **Output**: Severity score (1-10), immediate action steps, emergency flag
- **Use Case**: Golden hour decision support for accidents, burns, bites

### 2. 🎙️ Polyglot Scribe (The Medical Scribe)
- **Purpose**: Overcome language barriers and generate comprehensive medical summaries
- **Input**: Audio recording of doctor-patient consultation
- **Output**: Auto-detected language, detailed medical summary, optional translation
- **Key Features**: 
  - Automatic language detection for rural Indian languages
  - AI-generated structured medical summary (chief complaint, symptoms, assessment, treatment plan)
  - Translation to user-selected language for doctor-to-doctor handoff
  - Preserves original transcription alongside translated summary
- **Supported Languages**: Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali, Gujarati, Marathi, Punjabi, Odia, and English
- **Use Case**: Automatic medical documentation from multilingual consultations with professional clinical summaries

### 3. 💊 Rx-Vox (The Voice)
- **Purpose**: Patient literacy and medication compliance
- **Input**: Photo of handwritten prescription
- **Output**: Spoken audio instructions in patient's native language
- **Use Case**: Ensure correct medication dosage for low-literacy patients

## 📋 Prerequisites

- **Node.js** (v14 or higher) - Optional, for running a local server
- **Modern Web Browser** (Chrome, Firefox, Edge, or Safari)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))
- **Internet Connection** (required for Gemini API calls)

## 🚀 Quick Start

### Option 1: Using a Local Server (Recommended)

1. **Clone or download the project**
   ```bash
   cd IEDC_Hack
   ```

2. **Configure your API key**
   - Open `gemini-api.js`
   - Replace the API key on line 6:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   ```

3. **Start the local server**
   ```bash
   npx http-server -p 8000 -c-1
   ```

4. **Open in browser**
   - Navigate to: `http://localhost:8000`

### Option 2: Direct File Access

1. **Configure API key** (as above)

2. **Open the application**
   - Simply double-click `index.html`
   - Or right-click → "Open with" → Choose your browser

## 📁 Project Structure

```
IEDC_Hack/
├── index.html          # Main application entry point
├── styles.css          # Complete design system and styling
├── app.js             # Application logic and UI interactions
├── gemini-api.js      # Gemini API integration wrapper
└── README.md          # This file
```

## 🔧 Configuration

### Setting Up Your Gemini API Key

1. **Get an API key**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Click "Get API Key"
   - Create a new API key

2. **Add to the application**
   - Open `gemini-api.js` in a text editor
   - Find line 6:
   ```javascript
   const GEMINI_API_KEY = 'AIzaSy...';
   ```
   - Replace with your API key

> **⚠️ Security Note**: The API key is embedded in client-side code and will be visible to anyone who views the page source. For production deployment, implement a backend proxy server to protect the API key.

## 📖 Usage Guide

### Module 1: ET-AI Trauma Triage

1. Click **"ET-AI Trauma Triage"** in the sidebar
2. Upload an image of the injury (drag & drop or click to browse)
3. Click **"Analyze Trauma"**
4. Review the results:
   - Severity Score (1-10)
   - Immediate Action Steps
   - Emergency Alert (if severity ≥ 7)
   - Clinical Assessment

### Module 2: Polyglot Scribe

1. Click **"Polyglot Scribe"** in the sidebar
2. Upload an audio file of the doctor-patient consultation
3. Supported formats: MP3, WAV, AAC, OGG, FLAC, M4A, AMR
4. Select target language for the medical summary (if translation needed)
5. Click **"✨ Transcribe & Summarize"**
6. Review the comprehensive results:
   - **Detected Language** with visual badge
   - **Medical Summary** in structured format:
     - Chief Complaint & Duration
     - Detailed Symptoms
     - Medical History
     - Physical Examination Findings
     - Clinical Assessment
     - Treatment Plan
     - Follow-up Instructions
     - Red Flags / Warning Signs
   - **Original Transcription** (collapsible section)
   - **Translation Status** (if applicable)
   - Full medical summary in JSON format (for EHR integration)

### Module 3: Rx-Vox

1. Click **"Rx-Vox"** in the sidebar
2. Upload an image of a handwritten prescription
3. Click **"Read Prescription"**
4. Review the results:
   - Extracted Medications
   - Dosage & Frequency
   - Duration & Instructions
   - Patient-friendly Instructions
5. Click **"Play Audio"** to hear spoken instructions

## 🎨 Design Features

- **Modern Dark Theme** with glassmorphism effects
- **Vibrant Gradients** with medical color scheme (teal, blue, green)
- **Smooth Animations** and micro-interactions
- **Responsive Layout** for desktop and mobile
- **Accessible** with proper contrast and readable fonts

## 🔍 Troubleshooting

### API Errors

**Error: "Quota exceeded"**
- You've hit the free tier rate limit
- Wait for the time specified in the error message
- Consider upgrading to a paid tier for higher limits

**Error: "Invalid API key"**
- Verify your API key is correct in `gemini-api.js`
- Check that the API key has not been restricted
- Ensure the Gemini API is enabled in your Google Cloud project

**Error: "Model not found"**
- The application uses `gemini-2.5-flash`
- Verify this model is available in your region
- Check the [Gemini API documentation](https://ai.google.dev/gemini-api/docs/models)

### Browser Issues

**Application not loading**
- Clear browser cache (Ctrl+Shift+Del)
- Try a different browser
- Check browser console for errors (F12)

**Images/Audio not uploading**
- Check file size limits (10MB for images, 20MB for audio)
- Verify file format is supported
- Try a different file

### CORS Issues (if running from file://)

If you see CORS errors when opening `index.html` directly:
- Use Option 1 (local server) instead
- Or use Python's built-in server:
  ```bash
  python -m http.server 8000
  ```

## 🚢 Deployment

### For Production Use

1. **Set up a backend proxy** to protect your API key
2. **Use environment variables** instead of hardcoded keys
3. **Implement rate limiting** to prevent abuse
4. **Add user authentication** if needed
5. **Deploy to a hosting service** (Vercel, Netlify, GitHub Pages, etc.)

### Example Backend Proxy (Node.js/Express)

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/gemini', async (req, res) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    }
  );
  const data = await response.json();
  res.json(data);
});

app.listen(3000);
```

## 📊 Technical Details

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **AI Model**: Google Gemini 2.5 Flash (multimodal)
- **API Version**: v1beta
- **Styling**: Custom CSS with modern design patterns
- **Browser Support**: All modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## 🤝 Contributing

This project was developed for rural healthcare support. Contributions are welcome to:
- Add more language support
- Improve diagnostic accuracy
- Enhance UI/UX
- Add new healthcare modules

## 📄 License

This project is open-source and available for educational and healthcare purposes.

## 👨‍⚕️ Disclaimer

This application is designed to **assist** healthcare workers, not replace them. All AI-generated recommendations should be reviewed by qualified medical professionals. This tool is for educational and supportive purposes only.

## 🙏 Acknowledgments

- **Google Gemini API** for multimodal AI capabilities
- **IEDC** for supporting healthcare innovation
- **Rural healthcare workers** who inspired this platform

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
3. Open an issue in the project repository

---

**Built with ❤️ for Rural Healthcare in India**
