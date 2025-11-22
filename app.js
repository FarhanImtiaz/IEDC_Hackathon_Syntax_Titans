/**
 * Synapse Care Platform - Main Application Logic
 * Handles UI interactions, file uploads, and module switching
 */

// ==================== Navigation & Module Switching ====================

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeTraumaTriage();
  initializePolyglotScribe();

  initializeRxVox();
});

function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const modules = document.querySelectorAll('.module-container');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all links and modules
      navLinks.forEach(l => l.classList.remove('active'));
      modules.forEach(m => m.classList.remove('active'));

      // Add active class to clicked link
      link.classList.add('active');

      // Show corresponding module
      const moduleId = link.getAttribute('data-module');
      const moduleElement = document.getElementById(moduleId);
      if (moduleElement) {
        moduleElement.classList.add('active');
      }
    });
  });
}

// ==================== Utility Functions ====================

function setupFileUpload(uploadZoneId, fileInputId, previewContainerId, previewElementId, onFileSelected) {
  const uploadZone = document.getElementById(uploadZoneId);
  const fileInput = document.getElementById(fileInputId);
  const previewContainer = document.getElementById(previewContainerId);

  // Click to upload
  uploadZone.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file, previewContainer, previewElementId, onFileSelected);
    }
  });

  // Drag and drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelection(file, previewContainer, previewElementId, onFileSelected);
    }
  });
}

function handleFileSelection(file, previewContainer, previewElementId, callback) {
  previewContainer.classList.remove('hidden');

  const previewElement = document.getElementById(previewElementId);

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewElement.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else if (file.type.startsWith('audio/')) {
    const audioUrl = URL.createObjectURL(file);
    previewElement.src = audioUrl;
  }

  if (callback) {
    callback(file);
  }
}

function showLoading(containerId) {
  const container = document.getElementById(containerId);
  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Processing with Gemini AI...</p>
    </div>
  `;
}

function showError(containerId, message) {
  const container = document.getElementById(containerId);
  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="alert alert-error">
      <span>⚠️</span>
      <span>${message}</span>
    </div>
  `;
}

// ==================== Module 1: ET-AI Trauma Triage ====================

let traumaFile = null;
let traumaTranslatedText = null; // Store translated text for audio playback

function initializeTraumaTriage() {
  setupFileUpload(
    'trauma-upload-zone',
    'trauma-file-input',
    'trauma-preview',
    'trauma-preview-image',
    (file) => {
      traumaFile = file;
      document.getElementById('trauma-analyze-btn').disabled = false;
      document.getElementById('trauma-clear-btn').classList.remove('hidden');
    }
  );

  document.getElementById('trauma-analyze-btn').addEventListener('click', analyzeTraumaImage);
  document.getElementById('trauma-clear-btn').addEventListener('click', clearTrauma);
}

async function analyzeTraumaImage() {
  if (!traumaFile) return;

  const analyzeBtn = document.getElementById('trauma-analyze-btn');
  const languageSelect = document.getElementById('trauma-language-select');
  const selectedLanguage = languageSelect.value;

  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = '<div class="loading-spinner"></div> <span>Analyzing...</span>';

  showLoading('trauma-results');

  try {
    // Step 1: Analyze trauma with Gemini (original logic)
    const result = await window.GeminiAPI.analyzeTrauma(traumaFile);

    // Step 2: If language is not English, translate the assessment
    let translatedText = null;
    if (selectedLanguage !== 'en-IN') {
      const resultsContainer = document.getElementById('trauma-results');
      resultsContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Translating assessment to selected language...</p>
        </div>
      `;

      translatedText = await window.GeminiAPI.translateTraumaAssessment(result, selectedLanguage);
      traumaTranslatedText = translatedText; // Store for audio playback
    }

    // Display results with translation
    displayTraumaResults(result, selectedLanguage, translatedText);
  } catch (error) {
    console.error('Trauma analysis error:', error);
    showError('trauma-results', `Error: ${error.message}`);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '<span>🔍 Analyze Trauma</span>';
  }
}

function displayTraumaResults(data, selectedLanguage = 'en-IN', translatedText = null) {
  const resultsContainer = document.getElementById('trauma-results');

  let severityClass = 'severity-low';
  if (data.severity_score >= 7) severityClass = 'severity-high';
  else if (data.severity_score >= 4) severityClass = 'severity-medium';

  console.log('Trauma Analysis Result:', data);
  console.log('Severity Score:', data.severity_score);

  // Unified Emergency Button (replaces static alert)
  // Shows if severity >= 8 OR if API explicitly says call_emergency
  const showEmergencyBtn = data.severity_score >= 8 || data.call_emergency;

  const emergencySection = showEmergencyBtn ? `
    <div style="margin: 1.5rem 0; text-align: center;">
      <button id="sos-emergency-btn" class="sos-btn" onclick="handleSOSEmergency()">
        <span class="sos-icon">🚨</span>
        <span class="sos-text">CALL EMERGENCY SERVICES</span>
        <span class="sos-subtitle">Click to Alert (108)</span>
      </button>
    </div>
  ` : '';

  const actionSteps = data.immediate_actions.map(step =>
    `<li class="action-step">${step}</li>`
  ).join('');

  const warningSignsHtml = data.warning_signs && data.warning_signs.length > 0 ? `
    <div class="result-card">
      <div class="result-label">⚠️ Warning Signs</div>
      <ul style="margin: 0; padding-left: 1.5rem; color: var(--text-primary);">
        ${data.warning_signs.map(sign => `<li>${sign}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  // Language name mapping
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

  // Multilingual transcript section
  const multilingualSection = translatedText ? `
    <div class="mt-3">
      <div class="result-card" style="background: var(--gradient-primary); padding: 1.5rem; border-radius: 12px;">
        <div class="result-label" style="color: white; opacity: 0.9;">🌐 Assessment in ${languageNames[selectedLanguage]}</div>
        <div class="result-value" style="color: white; font-size: 1.125rem; font-weight: 600; white-space: pre-wrap; line-height: 1.8; margin-top: 0.75rem;">
          ${translatedText}
        </div>
        <button class="btn btn-primary mt-2" onclick="playTraumaAudio('${selectedLanguage}', event)" style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; border: none; font-weight: 600; padding: 0.75rem 1.5rem; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
          🔊 Play Audio Instructions
        </button>
      </div>
    </div>
  ` : '';

  resultsContainer.innerHTML = `
    ${emergencySection}
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Trauma Assessment Results</h3>
      </div>
      
      <div class="results-grid">
        <div class="result-card">
          <div class="result-label">Severity Score</div>
          <div class="result-value">
            <div class="severity-indicator ${severityClass}">
              ${data.severity_score}/10
            </div>
          </div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Emergency Response</div>
          <div class="result-value">${data.call_emergency ? '🚨 YES - Call Now' : '✅ No immediate emergency'}</div>
        </div>
      </div>
      
      <div class="mt-3">
        <div class="result-card">
          <div class="result-label">Clinical Assessment</div>
          <div class="result-value">${data.assessment}</div>
        </div>
      </div>
      
      <div class="mt-3">
        <div class="card-title mb-2">Immediate Action Steps</div>
        <ol class="action-steps">
          ${actionSteps}
        </ol>
      </div>
      
      ${warningSignsHtml}
      
      ${multilingualSection}
      
      <details class="mt-3">
        <summary style="cursor: pointer; color: var(--primary-teal); font-weight: 600;">
          View Raw JSON Response
        </summary>
        <div class="json-display mt-2">
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      </details>
    </div>
  `;

  resultsContainer.classList.remove('hidden');

  // Add SOS button event listener if it exists
  const sosBtn = document.getElementById('sos-emergency-btn');
  if (sosBtn) {
    console.log('SOS Button attached to DOM');
    sosBtn.addEventListener('click', handleSOSEmergency);
  } else {
    console.log('SOS Button NOT rendered (Severity < 8)');
  }
}

function clearTrauma() {
  traumaFile = null;
  traumaTranslatedText = null; // Clear translated text
  document.getElementById('trauma-file-input').value = '';
  document.getElementById('trauma-preview').classList.add('hidden');
  document.getElementById('trauma-results').classList.add('hidden');
  document.getElementById('trauma-analyze-btn').disabled = true;
  document.getElementById('trauma-clear-btn').classList.add('hidden');
}

function handleSOSEmergency() {
  // Create custom styled alert overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
  `;

  const alertBox = document.createElement('div');
  alertBox.style.cssText = `
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(220, 38, 38, 0.5);
    text-align: center;
    max-width: 400px;
    border: 2px solid rgba(255, 255, 255, 0.2);
  `;

  alertBox.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 1rem;">🚨</div>
    <h2 style="color: white; font-size: 1.8rem; margin-bottom: 0.5rem; font-weight: 700;">
      EMERGENCY SERVICES CALLED
    </h2>
    <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.1rem; margin-bottom: 1.5rem; line-height: 1.6;">
      Help is on the way. Stay calm and follow the immediate action steps provided.
    </p>
    <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; margin-bottom: 1.5rem;">
      Emergency Number: 108 (India)
    </p>
    <button onclick="this.closest('[style*=fixed]').remove()" style="
      background: white;
      color: #dc2626;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    ">
      OK
    </button>
  `;

  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// Global function for robust audio playback (handles long text & errors)
window.playGlobalAudio = async function (textToPlay, selectedLanguage, event) {
  const button = event.target;

  console.log('🎯 Global Play button clicked!');
  console.log('Selected language:', selectedLanguage);

  if (!textToPlay) {
    alert('No text available for audio playback.');
    return;
  }

  console.log('Text length:', textToPlay.length);

  // Save original button text and style
  const originalButtonText = button.innerHTML;
  const originalDisabled = button.disabled;

  button.disabled = true;
  button.innerHTML = '<div class="loading-spinner"></div> <span>Generating Audio...</span>';

  try {
    console.log('📞 Calling Sarvam.AI TTS...');

    // Play audio using Sarvam.AI TTS (handles chunking internally)
    await window.GeminiAPI.textToSpeech(textToPlay, selectedLanguage);

    console.log('✅ Audio playback completed successfully!');
    button.innerHTML = '✅ Audio Played';

    // Reset button after 3 seconds
    setTimeout(() => {
      button.disabled = originalDisabled;
      button.innerHTML = originalButtonText;
    }, 3000);

  } catch (error) {
    console.error('❌ TTS error:', error);
    console.error('Error details:', error.message);

    button.disabled = originalDisabled;
    button.innerHTML = originalButtonText;

    // Show user-friendly error
    alert('Error playing audio:\n\n' + error.message + '\n\nCheck console for details.');
  }
};

// Wrapper for Trauma module to keep HTML simple
window.playTraumaAudio = function (selectedLanguage, event) {
  // Use the global variable storing the trauma text
  window.playGlobalAudio(traumaTranslatedText, selectedLanguage, event);
};


// ==================== Module 2: Polyglot Scribe ====================

let scribeFile = null;

function initializePolyglotScribe() {
  setupFileUpload(
    'scribe-upload-zone',
    'scribe-file-input',
    'scribe-preview',
    'scribe-audio-player',
    (file) => {
      scribeFile = file;
      document.getElementById('scribe-filename').textContent = file.name;
      document.getElementById('scribe-transcribe-btn').disabled = false;
      document.getElementById('scribe-clear-btn').classList.remove('hidden');
    }
  );

  document.getElementById('scribe-transcribe-btn').addEventListener('click', transcribeAudio);
  document.getElementById('scribe-clear-btn').addEventListener('click', clearScribe);
}

async function transcribeAudio() {
  if (!scribeFile) return;

  const transcribeBtn = document.getElementById('scribe-transcribe-btn');
  const languageSelect = document.getElementById('scribe-language-select');
  const selectedLanguage = languageSelect.value;

  transcribeBtn.disabled = true;
  transcribeBtn.innerHTML = '<div class="loading-spinner"></div> <span>Processing...</span>';

  const resultsContainer = document.getElementById('scribe-results');
  resultsContainer.classList.remove('hidden');

  try {
    // Step 1: Transcribe audio with Sarvam.ai (auto-detect language)
    resultsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Step 1/3: Transcribing audio with Sarvam.ai...</p>
      </div>
    `;

    const sttResult = await window.GeminiAPI.transcribeAudioWithSarvam(scribeFile);

    // Step 2: Generate medical summary with Gemini
    resultsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Step 2/3: Generating comprehensive medical summary...</p>
      </div>
    `;

    const medicalSummary = await window.GeminiAPI.generateMedicalSummary(
      sttResult.transcript,
      sttResult.language
    );

    // Step 3: Translate summary if language is different from source
    let translatedSummary = null;
    if (selectedLanguage !== 'en-IN' && sttResult.language_code !== selectedLanguage) {
      resultsContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Step 3/3: Translating medical summary...</p>
        </div>
      `;

      translatedSummary = await window.GeminiAPI.translateMedicalSummary(
        medicalSummary,
        selectedLanguage
      );
    }

    // Display combined results
    displayMedicalSummaryResults({
      source_language: sttResult.language,
      source_language_code: sttResult.language_code,
      target_language_code: selectedLanguage,
      transcript: sttResult.transcript,
      medical_summary: medicalSummary,
      translated_summary: translatedSummary
    });

  } catch (error) {
    console.error('Transcription/Summary error:', error);
    showError('scribe-results', `Error: ${error.message}`);
  } finally {
    transcribeBtn.disabled = false;
    transcribeBtn.innerHTML = '<span>✨ Transcribe & Summarize</span>';
  }
}

function displayMedicalSummaryResults(data) {
  const resultsContainer = document.getElementById('scribe-results');

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

  const targetLanguageName = languageNames[data.target_language_code] || 'English';
  const summary = data.translated_summary || data.medical_summary;

  const languageBadge = data.translated_summary ? `
    <div class="alert alert-info mb-3">
      <span>🌐</span>
      <span><strong>Detected:</strong> ${data.source_language} → <strong>Translated to:</strong> ${targetLanguageName}</span>
    </div>
  ` : `
    <div class="alert alert-success mb-3">
      <span>✓</span>
      <span><strong>Detected Language:</strong> ${data.source_language}</span>
    </div>
  `;

  resultsContainer.innerHTML = `
    ${languageBadge}
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">📋 Medical Summary for Doctor Handoff</h3>
        <p class="card-subtitle">Professional clinical summary in ${targetLanguageName}</p>
      </div>
      
      <div class="results-grid">
        <div class="result-card">
          <div class="result-label">👤 Chief Complaint</div>
          <div class="result-value">${summary.chief_complaint}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">⏱️ Duration</div>
          <div class="result-value">${summary.duration}</div>
        </div>
      </div>
      
      <div class="mt-3">
        <div class="result-card">
          <div class="result-label">🩺 Symptoms</div>
          <div class="result-value" style="white-space: pre-wrap; line-height: 1.8;">${summary.symptoms}</div>
        </div>
      </div>
      
      ${summary.medical_history ? `
        <div class="mt-3">
          <div class="result-card">
            <div class="result-label">📋 Medical History</div>
            <div class="result-value" style="white-space: pre-wrap; line-height: 1.8;">${summary.medical_history}</div>
          </div>
        </div>
      ` : ''}
      
      ${summary.physical_exam ? `
        <div class="mt-3">
          <div class="result-card">
            <div class="result-label">🔍 Physical Examination</div>
            <div class="result-value" style="white-space: pre-wrap; line-height: 1.8;">${summary.physical_exam}</div>
          </div>
        </div>
      ` : ''}
      
      <div class="mt-3">
        <div class="result-card" style="background: var(--gradient-ocean); padding: 1.5rem; border-radius: 12px;">
          <div class="result-label" style="color: white; opacity: 0.9;">⚕️ Clinical Assessment</div>
          <div class="result-value" style="color: white; font-size: 1.125rem; font-weight: 600; white-space: pre-wrap; line-height: 1.8;">${summary.assessment}</div>
        </div>
      </div>
      
      <div class="mt-3">
        <div class="result-card" style="background: var(--gradient-purple); padding: 1.5rem; border-radius: 12px;">
          <div class="result-label" style="color: white; opacity: 0.9;">💊 Treatment Plan</div>
          <div class="result-value" style="color: white; font-size: 1.125rem; font-weight: 600; white-space: pre-wrap; line-height: 1.8;">${summary.treatment_plan}</div>
        </div>
      </div>
      
      <div class="mt-3">
        <div class="result-card">
          <div class="result-label">📅 Follow-up Instructions</div>
          <div class="result-value" style="white-space: pre-wrap; line-height: 1.8;">${summary.follow_up}</div>
        </div>
      </div>
      
      ${summary.red_flags ? `
        <div class="mt-3">
          <div class="alert alert-warning">
            <span>⚠️</span>
            <div>
              <strong>Warning Signs to Watch For:</strong>
              <p style="margin-top: 0.5rem; white-space: pre-wrap;">${summary.red_flags}</p>
            </div>
          </div>
        </div>
      ` : ''}
      
      <details class="mt-3">
        <summary style="cursor: pointer; color: var(--primary-teal); font-weight: 600; margin-bottom: 1rem;">
          📝 View Original Transcription
        </summary>
        <div class="result-card">
          <div class="result-label">Original Language (${data.source_language})</div>
          <div class="result-value" style="white-space: pre-wrap; line-height: 1.8;">${data.transcript}</div>
        </div>
      </details>
      
      <details class="mt-3">
        <summary style="cursor: pointer; color: var(--primary-teal); font-weight: 600;">
          View Raw JSON Response
        </summary>
        <div class="json-display mt-2">
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      </details>
    </div>
  `;

  resultsContainer.classList.remove('hidden');
}

function clearScribe() {
  scribeFile = null;
  document.getElementById('scribe-file-input').value = '';
  document.getElementById('scribe-preview').classList.add('hidden');
  document.getElementById('scribe-results').classList.add('hidden');
  document.getElementById('scribe-transcribe-btn').disabled = true;
  document.getElementById('scribe-clear-btn').classList.add('hidden');
}





// ==================== Module 4: Rx-Vox ====================

let rxFile = null;
let prescriptionData = null;

function initializeRxVox() {
  setupFileUpload(
    'rx-upload-zone',
    'rx-file-input',
    'rx-preview',
    'rx-preview-image',
    (file) => {
      rxFile = file;
      document.getElementById('rx-read-btn').disabled = false;
      document.getElementById('rx-clear-btn').classList.remove('hidden');
    }
  );

  document.getElementById('rx-read-btn').addEventListener('click', readPrescription);
  document.getElementById('rx-clear-btn').addEventListener('click', clearRx);
}

async function readPrescription() {
  if (!rxFile) return;

  const readBtn = document.getElementById('rx-read-btn');
  readBtn.disabled = true;
  readBtn.innerHTML = '<div class="loading-spinner"></div> <span>Reading...</span>';

  showLoading('rx-results');

  try {
    const result = await window.GeminiAPI.readPrescription(rxFile);
    prescriptionData = result;
    displayRxResults(result);
  } catch (error) {
    console.error('Prescription reading error:', error);
    showError('rx-results', `Error: ${error.message}`);
  } finally {
    readBtn.disabled = false;
    readBtn.innerHTML = '<span>📖 Read Prescription</span>';
  }
}

function displayRxResults(data) {
  const resultsContainer = document.getElementById('rx-results');

  const medicationsHtml = data.medications.map((med, idx) => `
    <div class="card mt-2" id="rx-medication-${idx}">
      <div class="card-header">
        <h4 style="font-size: 1.125rem; margin: 0;">💊 Medication ${idx + 1}</h4>
      </div>
      <div class="results-grid">
        <div class="result-card">
          <div class="result-label">Medicine</div>
          <div class="result-value">${med.medicine_name}</div>
        </div>
        <div class="result-card">
          <div class="result-label">Dosage</div>
          <div class="result-value">${med.dosage}</div>
        </div>
        <div class="result-card">
          <div class="result-label">Frequency</div>
          <div class="result-value">${med.frequency}</div>
        </div>
        <div class="result-card">
          <div class="result-label">Duration</div>
          <div class="result-value">${med.duration}</div>
        </div>
      </div>
      ${med.instructions ? `
        <div class="mt-2">
          <div class="result-card">
            <div class="result-label">Special Instructions</div>
            <div class="result-value">${med.instructions}</div>
          </div>
        </div>
      ` : ''}
      <div class="mt-2">
        <div class="result-card" style="background: var(--gradient-primary); padding: 1rem; border-radius: 12px;">
          <div class="result-label" style="color: white; opacity: 0.9;">🔊 Patient Instructions (English)</div>
          <div class="result-value" style="color: white; font-size: 1.125rem; font-weight: 600;">
            ${med.colloquial_instruction}
          </div>
          <div id="rx-translated-${idx}" class="mt-2" style="display: none;">
            <div class="result-label" style="color: white; opacity: 0.9;">🌐 Translated Instructions</div>
            <div class="result-value translated-text" style="color: white; font-size: 1.25rem; font-weight: 700; margin-top: 0.5rem;">
              <!-- Translated text will appear here -->
            </div>
          </div>
          <button class="btn btn-secondary mt-2" onclick="speakInstructionInLanguage(${idx}, '${med.colloquial_instruction.replace(/'/g, "\\'")}', event)">
            🔊 Translate & Play Audio
          </button>
        </div>
      </div>
    </div>
  `).join('');

  const headerInfo = `
    <div class="results-grid mb-3">
      ${data.doctor_name ? `
        <div class="result-card">
          <div class="result-label">Doctor</div>
          <div class="result-value">${data.doctor_name}</div>
        </div>
      ` : ''}
      ${data.patient_name ? `
        <div class="result-card">
          <div class="result-label">Patient</div>
          <div class="result-value">${data.patient_name}</div>
        </div>
      ` : ''}
      ${data.date ? `
        <div class="result-card">
          <div class="result-label">Date</div>
          <div class="result-value">${data.date}</div>
        </div>
      ` : ''}
    </div>
  `;

  const adviceHtml = data.general_advice ? `
    <div class="mt-3">
      <div class="result-card">
        <div class="result-label">General Advice</div>
        <div class="result-value">${data.general_advice}</div>
      </div>
    </div>
  ` : '';

  const followUpHtml = data.follow_up ? `
    <div class="mt-3">
      <div class="alert alert-info">
        <span>📅</span>
        <span><strong>Follow-up:</strong> ${data.follow_up}</span>
      </div>
    </div>
  ` : '';

  resultsContainer.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Prescription Details</h3>
      </div>
      
      ${headerInfo}
      
      <div class="card-title mb-2">Medications</div>
      ${medicationsHtml}
      
      ${adviceHtml}
      ${followUpHtml}
      
      <details class="mt-3">
        <summary style="cursor: pointer; color: var(--primary-teal); font-weight: 600;">
          View Raw JSON Response
        </summary>
        <div class="json-display mt-2">
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      </details>
    </div>
  `;

  resultsContainer.classList.remove('hidden');
}

// Global function for text-to-speech with translation
window.speakInstructionInLanguage = async function (medIndex, englishText, event) {
  const languageSelect = document.getElementById('rx-language-select');
  const selectedLanguage = languageSelect.value;
  const translatedContainer = document.getElementById(`rx-translated-${medIndex}`);
  const translatedTextElement = translatedContainer.querySelector('.translated-text');
  const button = event.target;

  // Save original button text
  const originalButtonText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<div class="loading-spinner"></div> <span>Translating...</span>';

  try {
    // Show the translated container
    translatedContainer.style.display = 'block';
    translatedTextElement.innerHTML = '<div class="loading-spinner" style="margin: 0.5rem auto;"></div>';

    // Translate to selected language
    const translatedText = await window.GeminiAPI.translateToLanguage(englishText, selectedLanguage);

    // Display translated text
    translatedTextElement.textContent = translatedText;

    // Update button to show speaking
    button.innerHTML = '<div class="loading-spinner"></div> <span>Playing Audio...</span>';

    // Speak in the selected language
    await window.GeminiAPI.textToSpeech(translatedText, selectedLanguage);

    console.log('Audio playback completed');
    button.innerHTML = '✅ Audio Played';

    // Reset button after 2 seconds
    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = '🔊 Play Audio Again';
    }, 2000);

  } catch (error) {
    console.error('Translation/TTS error:', error);
    translatedTextElement.innerHTML = `<span style="color: #ef4444;">Error: ${error.message}</span>`;
    button.disabled = false;
    button.innerHTML = originalButtonText;
    alert('Error during translation or speech: ' + error.message);
  }
};

function clearRx() {
  rxFile = null;
  prescriptionData = null;
  document.getElementById('rx-file-input').value = '';
  document.getElementById('rx-preview').classList.add('hidden');
  document.getElementById('rx-results').classList.add('hidden');
  document.getElementById('rx-read-btn').disabled = true;
  document.getElementById('rx-clear-btn').classList.add('hidden');
}
