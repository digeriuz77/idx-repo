/**
 * MI-Dojo Application - Simplified for Demo
 */

// Global state
const state = {
  currentScreen: 'welcome',
  sessionId: null,
  persona: null,
  messages: [],
  feedback: null
};

// DOM Elements
const elements = {
  // Screens
  welcomeScreen: document.getElementById('welcome-screen'),
  chatScreen: document.getElementById('chat-screen'),
  feedbackScreen: document.getElementById('feedback-screen'),
  loadingOverlay: document.getElementById('loading-overlay'),
  
  // Welcome screen
  scenarioType: document.getElementById('scenario-type'),
  changeReadiness: document.getElementById('change-readiness'),
  additionalContext: document.getElementById('additional-context'),
  communicationSample: document.getElementById('communication-sample'),
  createPersonaBtn: document.getElementById('create-persona-btn'),
  
  // Chat screen
  personaInfo: document.getElementById('persona-info'),
  chatMessages: document.getElementById('chat-messages'),
  messageInput: document.getElementById('message-input'),
  sendMessageBtn: document.getElementById('send-message-btn'),
  endSessionBtn: document.getElementById('end-session-btn'),
  getCoachingBtn: document.getElementById('get-coaching-btn'),
  coachingFeedback: document.getElementById('coaching-feedback'),
  
  // Feedback screen
  feedbackContent: document.getElementById('feedback-content'),
  backToChatBtn: document.getElementById('back-to-chat-btn')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Attach event listeners
  elements.createPersonaBtn.addEventListener('click', createPersona);
  elements.sendMessageBtn.addEventListener('click', sendMessage);
  elements.endSessionBtn.addEventListener('click', () => showScreen('welcome'));
  elements.getCoachingBtn?.addEventListener('click', getSessionFeedback);
  elements.backToChatBtn?.addEventListener('click', () => showScreen('chat'));
  
  // Enter key for message sending
  elements.messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
});

// Show loading overlay
function showLoading() {
  elements.loadingOverlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoading() {
  elements.loadingOverlay.classList.add('hidden');
}

// Show a specific screen
function showScreen(screenName) {
  // Hide all screens
  elements.welcomeScreen.classList.add('hidden');
  elements.chatScreen.classList.add('hidden');
  elements.feedbackScreen?.classList.add('hidden');
  
  // Show the requested screen
  switch (screenName) {
    case 'welcome':
      elements.welcomeScreen.classList.remove('hidden');
      break;
    case 'chat':
      elements.chatScreen.classList.remove('hidden');
      elements.messageInput.focus();
      break;
    case 'feedback':
      elements.feedbackScreen?.classList.remove('hidden');
      break;
  }
  
  state.currentScreen = screenName;
}

// Create a new persona
async function createPersona() {
  try {
    showLoading();
    
    // Get values from form
    const scenarioType = elements.scenarioType.value;
    const changeReadiness = elements.changeReadiness.value;
    const additionalContext = elements.additionalContext.value.trim();
    const communicationSample = elements.communicationSample.value.trim();
    
    console.log("Creating persona with:", { scenarioType, changeReadiness, additionalContext, communicationSample });
    
    const response = await fetch('/api/persona', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        scenario_type: scenarioType,
        change_readiness: changeReadiness,
        additional_context: additionalContext,
        communication_sample: communicationSample
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate persona');
    }
    
    const data = await response.json();
    
    // Update state
    state.sessionId = data.sessionId;
    state.persona = data.persona;
    state.messages = [];
    
    // Display persona info
    renderPersonaInfo(data.persona);
    
    // Clear chat
    elements.chatMessages.innerHTML = '';
    
    // Show chat screen
    showScreen('chat');
    
    // Focus message input
    elements.messageInput.focus();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate persona. Please try again.');
  } finally {
    hideLoading();
  }
}

// Render persona info
function renderPersonaInfo(persona) {
  console.log("Rendering persona:", persona);
  
  // Check if we have a simple persona format or the full one
  if (persona.name && persona.condition) {
    // Simple persona format
    const html = `
      <h4>${persona.name}, ${persona.age}</h4>
      <p><strong>Condition:</strong> ${persona.condition}</p>
      <p><strong>Background:</strong> ${persona.background}</p>
      <h4>Resistance Factors:</h4>
      <p>${persona.resistance}</p>
      <h4>Potential Motivation:</h4>
      <p>${persona.motivation}</p>
    `;
    
    elements.personaInfo.innerHTML = html;
  } else if (persona.persona_id && persona.base_characteristics) {
    // Full persona format from TypeScript flows
    const { base_characteristics, scenario_context, change_dynamics } = persona;
    
    const html = `
      <h4>${persona.persona_id}</h4>
      <p><strong>Condition:</strong> ${base_characteristics.condition}</p>
      <p><strong>Stage of Change:</strong> ${base_characteristics.stage_of_change}</p>
      
      <h4>Key Resistance Factors:</h4>
      <ul>
        ${base_characteristics.key_resistances.map(r => `<li>${r}</li>`).join('')}
      </ul>
      
      <h4>Communication Style:</h4>
      <p>${base_characteristics.communication_style}</p>
      
      <h4>Life Context:</h4>
      <p>${scenario_context.life_circumstances}</p>
      <p><strong>Support:</strong> ${scenario_context.support_system}</p>
      
      <h4>Stress Factors:</h4>
      <ul>
        ${scenario_context.stress_factors.map(s => `<li>${s}</li>`).join('')}
      </ul>
      
      <h4>Readiness Level:</h4>
      <p>${change_dynamics.readiness_level}</p>
      
      <h4>Ambivalence Areas:</h4>
      <ul>
        ${change_dynamics.ambivalence_areas.map(a => `<li>${a}</li>`).join('')}
      </ul>
    `;
    
    elements.personaInfo.innerHTML = html;
  } else {
    // Unknown format
    elements.personaInfo.innerHTML = `<p>Error: Unknown persona format</p>`;
    console.error("Unknown persona format:", persona);
  }
}

// Send a message to the persona
async function sendMessage() {
  const message = elements.messageInput.value.trim();
  
  if (!message || !state.sessionId) {
    return;
  }
  
  try {
    // Clear any existing coaching feedback
    if (elements.coachingFeedback) {
      elements.coachingFeedback.innerHTML = '';
      elements.coachingFeedback.classList.add('hidden');
    }
    
    // Disable button while sending
    elements.sendMessageBtn.disabled = true;
    
    // Display user message
    addMessageToChat('user', message);
    elements.messageInput.value = '';
    
    // Send to API
    const response = await fetch(`/api/session/${state.sessionId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    
    // Display persona response
    addMessageToChat('persona', data.response);
    
    // Update state
    state.messages = data.messages;
    
    // Display coaching feedback if available
    if (data.coaching && data.coaching.has_coaching && elements.coachingFeedback) {
      showCoachingFeedback(data.coaching);
    }
    
    // Enable the coaching button if we have enough messages
    if (elements.getCoachingBtn && state.messages.length >= 4) {
      elements.getCoachingBtn.disabled = false;
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    elements.sendMessageBtn.disabled = false;
    elements.messageInput.focus();
  }
}

// Add a message to the chat
function addMessageToChat(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role === 'user' ? 'user-message' : 'persona-message'}`;
  
  // Format content with line breaks
  const formattedContent = content.replace(/\n/g, '<br>');
  messageDiv.innerHTML = `<p>${formattedContent}</p>`;
  
  elements.chatMessages.appendChild(messageDiv);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Show coaching feedback in the UI
function showCoachingFeedback(coaching) {
  if (!elements.coachingFeedback) return;
  
  let html = `<div class="alert alert-info">
    <h4>Coaching Feedback</h4>
    <p>${coaching.coaching_message}</p>`;
  
  if (coaching.mi_technique_used) {
    html += `<p><strong>Technique used:</strong> ${coaching.mi_technique_used}</p>`;
  }
  
  if (coaching.missed_opportunity) {
    html += `<p><strong>Missed opportunity:</strong> ${coaching.missed_opportunity}</p>`;
  }
  
  html += `</div>`;
  
  elements.coachingFeedback.innerHTML = html;
  elements.coachingFeedback.classList.remove('hidden');
}

// Get detailed session feedback and show feedback screen
async function getSessionFeedback() {
  if (!state.sessionId || state.messages.length < 4) {
    alert('Please have more conversation before requesting feedback.');
    return;
  }
  
  try {
    showLoading();
    
    const response = await fetch(`/api/session/${state.sessionId}/feedback`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get feedback');
    }
    
    const feedback = await response.json();
    state.feedback = feedback;
    
    renderFeedback(feedback);
    showScreen('feedback');
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Failed to get feedback. Please try again.');
  } finally {
    hideLoading();
  }
}

// Render the MITI feedback to the feedback screen
function renderFeedback(feedback) {
  if (!elements.feedbackContent) return;
  
  let html = `
    <h2>MITI Feedback Analysis</h2>
    
    <h3>Global Scores (1-5 scale)</h3>
    <ul>
      <li>Partnership: ${feedback.global_scores.partnership}</li>
      <li>Empathy: ${feedback.global_scores.empathy}</li>
      <li>Autonomy Support: ${feedback.global_scores.autonomy_support}</li>
      <li>Evocation: ${feedback.global_scores.evocation}</li>
    </ul>
    
    <h3>Behavior Counts</h3>
    <ul>
      <li>Open Questions: ${feedback.behavior_counts.open_questions}</li>
      <li>Closed Questions: ${feedback.behavior_counts.closed_questions}</li>
      <li>Simple Reflections: ${feedback.behavior_counts.simple_reflections}</li>
      <li>Complex Reflections: ${feedback.behavior_counts.complex_reflections}</li>
      <li>Affirming Statements: ${feedback.behavior_counts.affirming_statements}</li>
      <li>Seeking Collaboration: ${feedback.behavior_counts.seeking_collaboration}</li>
      <li>Emphasizing Autonomy: ${feedback.behavior_counts.emphasizing_autonomy}</li>
      <li>Confrontations: ${feedback.behavior_counts.confrontations}</li>
    </ul>
    
    <h3>Derived Metrics</h3>
    <ul>
      <li>Reflection to Question Ratio: ${feedback.derived_metrics.reflection_to_question_ratio.toFixed(2)}</li>
      <li>Percent Complex Reflections: ${feedback.derived_metrics.percent_complex_reflections.toFixed(2)}%</li>
      <li>Percent Open Questions: ${feedback.derived_metrics.percent_open_questions.toFixed(2)}%</li>
      <li>Percent MI Adherent: ${feedback.derived_metrics.percent_mi_adherent.toFixed(2)}%</li>
    </ul>
    
    <h3>Strengths</h3>
    <ul>
      ${feedback.strengths.map(strength => `<li>${strength}</li>`).join('')}
    </ul>
    
    <h3>Areas for Improvement</h3>
    <ul>
      ${feedback.areas_for_improvement.map(area => `<li>${area}</li>`).join('')}
    </ul>
    
    <h3>Examples</h3>
    <h4>Effective Techniques</h4>
    <ul>
      ${feedback.examples.good_examples.map(example => `<li>${example}</li>`).join('')}
    </ul>
    
    <h4>Missed Opportunities</h4>
    <ul>
      ${feedback.examples.missed_opportunities.map(example => `<li>${example}</li>`).join('')}
    </ul>
  `;
  
  elements.feedbackContent.innerHTML = html;
}
