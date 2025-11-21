# Synapse Care: Rural Healthcare AI Platform

<div align="center">

![Synapse Care](https://img.shields.io/badge/AI-Healthcare-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5-blueviolet)
![Platform](https://img.shields.io/badge/Platform-Web-orange)

**AI-powered healthcare assistance for rural India, leveraging Google's Gemini multimodal capabilities**

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage-guide) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

**Synapse Care** is a comprehensive healthcare AI platform designed to empower rural healthcare workers in India. Built with Google's Gemini 2.5 Flash multimodal AI, the platform addresses critical challenges in resource-constrained medical settings through three intelligent modules.

### The Challenge
Rural healthcare workers face:
- Limited access to specialists and diagnostic equipment
- Language barriers with diverse patient populations
- Time-consuming manual documentation
- Difficulty interpreting medical prescriptions

### Our Solution
Three AI-powered modules that provide instant, intelligent assistance:

---

## 🌟 Features

### 1. 🚨 ET-AI Trauma Triage
**The Emergency Assessment System**

Rapid severity assessment for trauma cases during the critical "golden hour."

- **Input**: Photo of physical injury (wounds, burns, bites, fractures)
- **AI Processing**: Computer vision analysis with medical knowledge
- **Output**: 
  - Severity score (1-10 scale)
  - Immediate action steps prioritized by urgency
  - Emergency alert flag for critical cases (severity ≥ 7)
  - Detailed clinical assessment
  - Resource recommendations
- **Use Case**: Triage support for accidents, burns, animal bites, and trauma in emergency situations

**Key Benefits**: Helps non-specialist healthcare workers make faster, more informed decisions when every second counts.

---

### 2. 🎙️ Polyglot Scribe
**The Intelligent Medical Scribe**

Eliminates language barriers and automates clinical documentation from doctor-patient conversations.

- **Input**: Audio recording of medical consultation (any length)
- **AI Processing**: 
  - Automatic speech recognition with language detection
  - Medical entity extraction and structuring
  - Clinical summary generation
  - Optional translation to target language
- **Output**: Comprehensive medical summary including:
  - 📋 **Chief Complaint** with duration
  - 🩺 **Detailed Symptoms** (organized and categorized)
  - 📝 **Medical History** (past conditions, medications, allergies)
  - 🔍 **Physical Examination** findings
  - 💡 **Clinical Assessment** (AI-generated diagnosis insights)
  - 💊 **Treatment Plan** (medications, procedures, lifestyle advice)
  - 📅 **Follow-up Instructions** (next steps, warning signs)
  - ⚠️ **Red Flags** (critical symptoms to watch for)
  - 🌐 **Full Transcription** (original language preserved)
  
- **Supported Languages**: 
  - Hindi • Tamil • Telugu • Malayalam • Kannada
  - Bengali • Gujarati • Marathi • Punjabi • Odia • English

- **Use Case**: 
  - Auto-documentation for multilingual consultations
  - Doctor-to-doctor handoff with translated summaries
  - EHR-ready structured clinical notes
  - Reducing documentation fatigue

**Key Benefits**: Saves 15-20 minutes per consultation, ensures nothing is lost in translation, creates professional medical records.

---

### 3. 💊 Rx-Vox
**The Prescription Interpreter**

Converts handwritten prescriptions into clear, spoken instructions for patients.

- **Input**: Photo of handwritten prescription
- **AI Processing**: 
  - OCR (Optical Character Recognition) for handwriting
  - Medical terminology interpretation
  - Natural language generation for patient instructions
  - Text-to-speech synthesis in native language
- **Output**:
  - 👨‍⚕️ Doctor & patient details
  - 💊 **Medications list** with:
    - Medicine name (generic & brand)
    - Dosage and strength
    - Frequency (timing throughout day)
    - Duration (number of days)
    - Special instructions
    - **Patient-friendly audio instructions**
  - 📋 General medical advice
  - 🔄 Follow-up instructions

- **Supported Audio Languages**: Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, and more

- **Use Case**: 
  - Ensuring medication compliance for low-literacy patients
  - Preventing dosage errors
  - Providing clear instructions in patient's native language

**Key Benefits**: Reduces medication errors, improves patient understanding, ensures treatment adherence.

---

## 📋 Prerequisites

- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Internet Connection**: Required for Gemini AI API calls
- **Gemini API Key**: [Get one free here](https://ai.google.dev/)
- **(Optional) Node.js**: v14+ for local development server

---

## 🚀 Quick Start

### Step 1: Get the Code

```bash
git clone https://github.com/FarhanImtiaz/IEDC_Hackathon_Syntax_Titans.git
cd IEDC_Hackathon_Syntax_Titans
```

### Step 2: Configure API Key

1. Get your Gemini API key from [Google AI Studio](https://ai.google.dev/)
2. Open `gemini-api.js` in a text editor
3. Replace the API key on line 6:

```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```

### Step 3: Run the Application

**Option A: Using npx (Recommended)**
```bash
npx http-server -p 8000 -c-1
```

**Option B: Using Python**
```bash
python -m http.server 8000
```

**Option C: Direct file access**
- Simply open `index.html` in your browser
- ⚠️ Note: Some features may require a local server due to browser security restrictions

### Step 4: Access the Platform

Open your browser and navigate to:
```
http://localhost:8000
```

---

## 📖 Usage Guide

### Module 1: ET-AI Trauma Triage

#### How to Use:
1. Click **"ET-AI Trauma Triage"** in the sidebar
2. Upload injury image (drag & drop or click to browse)
   - Supported formats: JPG, PNG, WEBP
   - Max file size: 10MB
3. Click **"🚨 Analyze Trauma"**
4. Wait for AI analysis (typically 5-10 seconds)

#### What You'll Get:
- **Severity Score**: 1-10 scale with color-coded indicator
- **Immediate Actions**: Step-by-step prioritized instructions
- **Emergency Alert**: Automatic flag if severity ≥ 7
- **Assessment**: Detailed clinical observations
- **Resources**: Recommended equipment and supplies

---

### Module 2: Polyglot Scribe

#### How to Use:
1. Click **"Polyglot Scribe"** in the sidebar
2. Upload consultation audio file
   - Supported formats: MP3, WAV, AAC, OGG, FLAC, M4A, AMR
   - Max file size: 20MB
   - Duration: No limit (handles long consultations)
3. Select target language for summary (optional, for translation)
4. Click **"✨ Transcribe & Summarize"**
5. Wait for AI processing (longer audio = longer processing time)

#### What You'll Get:
- **Detected Language** badge
- **Comprehensive Medical Summary** with:
  - Chief complaint with duration
  - Organized symptom list
  - Relevant medical history
  - Physical exam findings
  - AI-generated clinical assessment
  - Detailed treatment plan
  - Follow-up care instructions
  - Red flag symptoms to watch
- **Original Transcription** (collapsible section)
- **Translation Status** (if applicable)
- **JSON Export** for EHR integration

---

### Module 3: Rx-Vox

#### How to Use:
1. Click **"Rx-Vox"** in the sidebar
2. Upload prescription image
   - Supported formats: JPG, PNG, WEBP
   - Max file size: 10MB
   - Works with handwritten prescriptions
3. Click **"📋 Read Prescription"**
4. Review extracted information

#### What You'll Get:
- **Prescription Header**: Doctor name, date, patient info
- **Medications Table** with each drug's:
  - Name (brand and generic)
  - Dosage and form
  - Frequency and timing
  - Duration of treatment
  - Special instructions
  - **Play button** for audio instructions
- **General Advice**: Additional medical recommendations
- **Follow-up**: Next appointment or check-up instructions

#### Audio Instructions:
- Click the **"🔊 Play Audio"** button next to any medication
- Hear clear, spoken instructions in selected language
- Patient-friendly language for better understanding

---

## 🎨 Design Philosophy

Synapse Care features a modern, premium interface designed for medical professionals:

- **Deep Dark Theme**: Reduces eye strain during long shifts
- **Glassmorphism UI**: Modern, clean aesthetic with frosted glass effects
- **Medical Color Palette**: Teal, blue, and green gradients inspire trust
- **Smooth Animations**: Micro-interactions enhance user experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: High contrast, readable fonts, clear visual hierarchy

---

## 🔧 Technical Architecture

### Frontend Stack
- **Pure Web Technologies**: HTML5, CSS3, ES6+ JavaScript
- **No Framework Dependencies**: Lightweight and fast
- **Modern CSS**: Custom properties, Grid, Flexbox, animations
- **Responsive**: Mobile-first design approach

### AI Integration
- **Model**: Google Gemini 2.5 Flash (multimodal)
- **API**: Gemini generative AI REST API (v1beta)
- **Capabilities Used**:
  - Vision for image analysis (trauma, prescriptions)
  - Audio processing for transcription
  - Natural language generation for summaries
  - Text-to-speech for audio output

### File Structure
```
IEDC_Hack/
├── index.html          # Main application HTML
├── styles.css          # Complete design system
├── app.js             # UI logic and module switching
├── gemini-api.js      # Gemini API integration
└── README.md          # This file
```

---

## 🔐 Security Considerations

### Current Implementation (Development)
- API key is embedded in client-side `gemini-api.js`
- ⚠️ **Not suitable for production** - key is visible in browser dev tools

### Production Recommendations
1. **Backend Proxy**: Set up a server to handle API calls
2. **Environment Variables**: Store API key server-side
3. **Rate Limiting**: Prevent abuse and control costs
4. **Authentication**: Add user login if needed
5. **HTTPS**: Ensure secure transmission

### Example Backend Proxy (Node.js + Express)

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 🚢 Deployment Options

### Static Hosting (Frontend Only)
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop or connect GitHub
- **GitHub Pages**: Enable in repository settings
- **Firebase Hosting**: `firebase deploy`

### Full-Stack (with Backend Proxy)
- **Railway**: Deploy Node.js + static files
- **Render**: Web service + static site
- **Heroku**: Deploy Express backend
- **AWS/GCP**: EC2/Compute Engine + S3/Cloud Storage

---

## 🐛 Troubleshooting

### API Errors

**"Invalid API key"**
- Verify key is correct in `gemini-api.js`
- Check API is enabled at [Google AI Studio](https://ai.google.dev/)
- Ensure no extra spaces or quotes

**"Quota exceeded"**
- You've hit free tier limits
- Wait for quota reset (check error message for time)
- Consider upgrading to paid tier

**"Model not found"**
- Verify `gemini-2.5-flash` is available in your region
- Check [Gemini model documentation](https://ai.google.dev/gemini-api/docs/models)

### Upload Issues

**File not uploading**
- Check file size (images: 10MB, audio: 20MB)
- Verify file format is supported
- Try a different file

**Audio not transcribing**
- Ensure clear audio quality
- Check file isn't corrupted
- Try shorter clip first to test

### Browser Issues

**CORS errors**
- Use a local server (Option A or B above)
- Don't open HTML directly from file system
- Check browser console (F12) for details

**UI not loading**
- Clear browser cache (Ctrl+Shift+Del)
- Try incognito/private mode
- Check browser compatibility

---

## 🤝 Contributing

We welcome contributions to improve Synapse Care! Areas for enhancement:

- 🌐 **More Languages**: Add support for additional Indian languages
- 🎯 **Accuracy**: Improve prompts for better AI responses
- 🎨 **UI/UX**: Enhance design and user experience
- ⚡ **Performance**: Optimize loading and processing times
- 📱 **Mobile**: Improve responsive design for phones
- 🔬 **New Modules**: Add more healthcare AI features

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available for educational and healthcare purposes.

---

## ⚕️ Medical Disclaimer

**IMPORTANT**: Synapse Care is designed to **assist** healthcare professionals, not replace them.

- All AI-generated recommendations must be reviewed by qualified medical professionals
- This tool is for **educational and supportive purposes only**
- Not intended for direct patient diagnosis or treatment
- Healthcare workers should use their clinical judgment
- Not a substitute for proper medical training or equipment

---

## 🙏 Acknowledgments

- **Google Gemini AI**: For powerful multimodal AI capabilities
- **IEDC**: For supporting healthcare innovation
- **Rural Healthcare Workers**: Who inspired this platform with their dedication
- **Open Source Community**: For tools and libraries used

---

## 📞 Support & Resources

- **Issues**: [GitHub Issues](https://github.com/FarhanImtiaz/IEDC_Hackathon_Syntax_Titans/issues)
- **Gemini API Docs**: [Google AI Studio](https://ai.google.dev/gemini-api/docs)
- **API Key**: [Get Gemini API Key](https://ai.google.dev/)

---

<div align="center">

**Built with ❤️ for Rural Healthcare in India**

*Empowering healthcare workers • One AI consultation at a time*

</div>
