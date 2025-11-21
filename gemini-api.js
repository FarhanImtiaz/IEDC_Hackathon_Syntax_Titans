/**
 * Gram-Sahayak Platform - Gemini API Integration
 * Handles all interactions with Google's Gemini API for multimodal processing
 */

const GEMINI_API_KEY = 'AIzaSyAEDOHEBTWKO-Lm0oUgpArHYybwFI-fF-g';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Converts a File object to base64 string
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Determines MIME type from file extension
 */
function getMimeType(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp3': 'audio/mp3',
    'wav': 'audio/wav',
    'aac': 'audio/aac',
    'ogg': 'audio/ogg',
    'flac': 'audio/flac',
    'm4a': 'audio/m4a'
  };
  return mimeTypes[extension] || file.type;
}

/**
 * Main function to call Gemini API with multimodal input
 * @param {string} prompt - Text prompt for the AI
 * @param {File} file - Optional file (image or audio)
 * @param {string} modelName - Gemini model to use
 */
async function callGeminiAPI(prompt, file = null, modelName = 'gemini-2.5-flash') {
  try {
    const url = `${GEMINI_API_BASE}/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

    let requestBody = {
      contents: [{
        parts: [
          { text: prompt }
        ]
      }]
    };

    // If file is provided, add it to the request
    if (file) {
      const base64Data = await fileToBase64(file);
      const mimeType = getMimeType(file);

      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extract the text response
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      return text;
    } else {
      throw new Error('No response generated from API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

/**
 * Module 1: ET-AI Trauma Triage
 * Analyzes trauma images and returns structured assessment
 */
async function analyzeTrauma(imageFile) {
  const prompt = `You are an emergency medical AI assistant analyzing a trauma image. 
  
Analyze this injury image and provide a STRICT JSON response with the following structure:

{
  "severity_score": <number 1-10>,
  "severity_level": "<LOW|MEDIUM|HIGH>",
  "injury_type": "<description of injury type>",
  "immediate_actions": [
    "<step 1>",
    "<step 2>",
    "<step 3>"
  ],
  "call_emergency": <true|false>,
  "warning_signs": [
    "<sign 1>",
    "<sign 2>"
  ],
  "assessment": "<brief clinical assessment>"
}

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.

Severity Score Guide:
- 1-3: Minor injury (LOW) - bruises, small cuts
- 4-6: Moderate injury (MEDIUM) - deeper wounds, possible fractures
- 7-10: Severe injury (HIGH) - life-threatening, major trauma

Set call_emergency to true if severity >= 7 or life-threatening signs present.`;

  const response = await callGeminiAPI(prompt, imageFile);

  // Try to extract JSON from the response
  try {
    // Remove markdown code blocks if present
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    console.log('Raw response:', response);
    throw new Error('Failed to parse trauma analysis results');
  }
}

/**
 * Module 2: Polyglot Scribe
 * Transcribes and translates medical consultations
 */
async function transcribeConsultation(audioFile) {
  const prompt = `You are a medical scribe AI analyzing an audio recording of a doctor-patient consultation.

The audio may be in various Indian languages or dialects (Hindi, Bhojpuri, Marathi, Telugu, Tamil, etc.).

Provide a STRICT JSON response with the following structure:

{
  "detected_language": "<language name>",
  "transcript_original": "<full transcript in original language>",
  "transcript_english": "<full English translation>",
  "chief_complaint": "<main reason for visit>",
  "duration": "<how long has the problem existed>",
  "symptoms": [
    "<symptom 1>",
    "<symptom 2>",
    "<symptom 3>"
  ],
  "medical_history": "<relevant medical history mentioned>",
  "clinical_note": "<structured clinical summary suitable for EHR>"
}

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.`;

  const response = await callGeminiAPI(prompt, audioFile);

  try {
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    console.log('Raw response:', response);
    throw new Error('Failed to parse transcription results');
  }
}

/**
 * Module 4: Rx-Vox
 * OCR for prescriptions and text-to-speech conversion
 */
async function readPrescription(imageFile) {
  const prompt = `You are a prescription reading AI that performs OCR on handwritten medical prescriptions.

Analyze this prescription image and provide a STRICT JSON response with the following structure:

{
  "doctor_name": "<doctor's name if visible>",
  "date": "<prescription date if visible>",
  "patient_name": "<patient name if visible>",
  "medications": [
    {
      "medicine_name": "<medication name>",
      "dosage": "<dosage amount>",
      "frequency": "<how often to take>",
      "duration": "<how many days>",
      "instructions": "<special instructions>",
      "colloquial_instruction": "<simple language instruction for patient>"
    }
  ],
  "general_advice": "<any general medical advice>",
  "follow_up": "<follow-up instructions>"
}

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.

For colloquial_instruction, write simple, clear instructions in plain English that can be easily translated to audio.
Example: "Take one red pill every morning after breakfast with water"`;

  const response = await callGeminiAPI(prompt, imageFile);

  try {
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    console.log('Raw response:', response);
    throw new Error('Failed to parse prescription results');
  }
}

/**
 * Transcribe audio using Gemini (supports any length, auto-detects language)
 * @param {File} audioFile - Audio file to transcribe
 * @returns {Object} { transcript, language_code, language }
 */
async function transcribeAudioWithSarvam(audioFile) {
  try {
    // Use Gemini for transcription - it supports audio and auto-detects language
    const prompt = `Transcribe this audio recording accurately. Detect the language being spoken.
    
Return ONLY a JSON object with this structure:
{
  "transcript": "<full transcription in original language>",
  "language": "<detected language name>",
  "language_code": "<ISO language code like en-IN, hi-IN, ta-IN, etc>"
}

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanation.`;

    const response = await callGeminiAPI(prompt, audioFile, 'gemini-2.5-flash');

    // Parse JSON response
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const data = JSON.parse(jsonText);
    console.log('Gemini STT Response:', data);

    return {
      transcript: data.transcript || '',
      language_code: data.language_code || 'en-IN',
      language: data.language || 'Unknown'
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

/**
 * Generate Medical Summary using Gemini
 * @param {string} transcription - Transcribed conversation
 * @param {string} sourceLanguage - Original language
 * @returns {Object} Structured medical summary
 */
async function generateMedicalSummary(transcription, sourceLanguage) {
  const prompt = `You are a medical AI assistant analyzing a doctor-patient conversation transcript.

The conversation was in ${sourceLanguage}. Generate a comprehensive clinical summary suitable for doctor-to-doctor handoff.

Provide a STRICT JSON response with the following structure:

{
  "chief_complaint": "<main reason for visit>",
  "duration": "<how long has the problem existed>",
  "symptoms": "<detailed symptom description>",
  "medical_history": "<relevant past medical history mentioned>",
  "physical_exam": "<physical examination findings if mentioned>",
  "assessment": "<doctor's initial assessment or impression>",
  "treatment_plan": "<recommended medications, procedures, or treatments>",
  "follow_up": "<follow-up instructions and timeline>",
  "red_flags": "<warning signs patient should watch for>"
}

CRITICAL: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.

Use professional medical terminology while remaining clear. This summary will be used by another doctor to understand the patient's case.

Conversation Transcript:
${transcription}`;

  try {
    const response = await callGeminiAPI(prompt, null, 'gemini-2.5-flash');

    // Parse JSON response
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error('Medical summary generation error:', error);
    throw new Error('Failed to generate medical summary');
  }
}

/**
 * Translate Medical Summary to Target Language
 * @param {Object} summary - Medical summary object
 * @param {string} targetLanguageCode - Target language code (e.g., 'hi-IN')
 * @returns {Object} Translated summary
 */
async function translateMedicalSummary(summary, targetLanguageCode) {
  const languageNames = {
    'en-IN': 'English',
    'hi-IN': 'Hindi',
    'bn-IN': 'Bengali',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'mr-IN': 'Marathi',
    'od-IN': 'Odia',
    'pa-IN': 'Punjabi',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'gu-IN': 'Gujarati'
  };

  const targetLanguage = languageNames[targetLanguageCode] || 'English';

  const prompt = `Translate the following medical summary to ${targetLanguage}.

Maintain medical terminology accuracy and professional tone. Translate field names as well.

Original Medical Summary (JSON):
${JSON.stringify(summary, null, 2)}

Provide the translated summary as JSON with the following structure:

{
  "chief_complaint": "<translated>",
  "duration": "<translated>",
  "symptoms": "<translated>",
  "medical_history": "<translated>",
  "physical_exam": "<translated>",
  "assessment": "<translated>",
  "treatment_plan": "<translated>",
  "follow_up": "<translated>",
  "red_flags": "<translated>"
}

CRITICAL: Respond ONLY with the translated JSON. No markdown, no explanation.`;

  try {
    const response = await callGeminiAPI(prompt, null, 'gemini-2.5-flash');

    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate medical summary');
  }
}

/**
 * Translate text to a specific language using Gemini
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'hi-IN', 'mr-IN')
 */
async function translateToLanguage(text, targetLanguage) {
  const languageNames = {
    'en-IN': 'English',
    'hi-IN': 'Hindi',
    'bn-IN': 'Bengali',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'mr-IN': 'Marathi',
    'od-IN': 'Odia',
    'pa-IN': 'Punjabi',
    'ta-IN': 'Tamil',
    'te-IN': 'Telugu',
    'gu-IN': 'Gujarati'
  };

  const targetLangName = languageNames[targetLanguage] || 'Hindi';

  const prompt = `Translate the following medical prescription instructions to ${targetLangName}. 
  
Use simple, colloquial language that a rural patient with limited literacy can easily understand. 
Use common everyday words, not formal medical terminology.

English text to translate:
${text}

Respond ONLY with the translated text in ${targetLangName}. No explanation, no extra text, just the translation.`;

  try {
    const response = await callGeminiAPI(prompt, null, 'gemini-2.5-flash');
    return response.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

/**
 * Text-to-Speech using Sarvam.ai API
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code (e.g., 'en-IN', 'hi-IN')
 */
async function textToSpeech(text, language = 'en-IN') {
  const SARVAM_API_KEY = 'sk_bwbz2lvp_fH1cCnOrHBJb4djNaIiclkDm';
  const SARVAM_API_URL = 'https://api.sarvam.ai/text-to-speech';

  // Map language codes to Sarvam.ai language codes (some use different format)
  const languageMap = {
    'en-IN': 'en-IN',
    'hi-IN': 'hi-IN',
    'bn-IN': 'bn-IN',
    'kn-IN': 'kn-IN',
    'ml-IN': 'ml-IN',
    'mr-IN': 'mr-IN',
    'od-IN': 'od-IN', // Odia
    'pa-IN': 'pa-IN',
    'ta-IN': 'ta-IN',
    'te-IN': 'te-IN',
    'gu-IN': 'gu-IN'
  };

  const targetLanguage = languageMap[language] || 'en-IN';

  try {
    const response = await fetch(SARVAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: targetLanguage,
        speaker: 'anushka', // Using female voice
        pitch: 0,
        pace: 1.0,
        loudness: 1.0,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: 'bulbul:v2'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Sarvam.ai API Error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    // Sarvam.ai returns base64 encoded audio in the 'audios' array
    if (data.audios && data.audios.length > 0) {
      const base64Audio = data.audios[0];

      // Convert base64 to audio blob and play
      const audioBlob = base64ToBlob(base64Audio, 'audio/wav');
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        audio.play();
      });
    } else {
      throw new Error('No audio generated from Sarvam.ai API');
    }
  } catch (error) {
    console.error('Sarvam.ai TTS Error:', error);
    throw error;
  }
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

// Export functions for use in app.js
window.GeminiAPI = {
  analyzeTrauma,
  transcribeConsultation,
  readPrescription,
  translateToLanguage,
  textToSpeech,
  transcribeAudioWithSarvam,
  generateMedicalSummary,
  translateMedicalSummary
};
