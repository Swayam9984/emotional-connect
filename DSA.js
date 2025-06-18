// --- 1. DOM ELEMENTS & API KEY ---
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// --- WARNING: This key is visible to anyone visiting the website. ---
// --- Use this for personal/demo purposes only. ---
const API_KEY = "AIzaSyDxO2-GKwd8lQNEVeFDuGW5v4fTCCbCofI"; // Replace with your key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// --- NEW: CONVERSATION HISTORY ---
// This array will store the entire conversation, giving the AI "memory".
let conversationHistory = [];


// --- 2. PARTICLE.JS BACKGROUND INITIALIZATION ---
particlesJS('particles-js', {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: "#c9a7eb" },
    shape: { type: "circle" },
    opacity: { value: 0.6, random: true },
    size: { value: 4, random: true },
    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { grab: { distance: 140, line_opacity: 0.5 }, push: { particles_nb: 4 } }
  },
  retina_detect: true
});

// --- 3. EVENT LISTENERS ---

// Display an initial welcoming message
window.addEventListener('load', () => {
    const initialMessage = "Hey... I'm here if you need to talk. How are you feeling today?";
    
    setTimeout(() => {
        displayMessage(initialMessage, 'ai');
        // MODIFIED: Add the bot's opening message to the history
        conversationHistory.push({
            role: 'model',
            parts: [{ text: initialMessage }]
        });
    }, 1200);
});

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();

    if (!userMessage) return;

    displayMessage(userMessage, 'user');
    userInput.value = '';

    // MODIFIED: Add user's message to the conversation history
    conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    showTypingIndicator();
    try {
        // MODIFIED: Pass the entire history to the API function
        const aiResponse = await getAIResponse(conversationHistory);
        
        // MODIFIED: Add the AI's response to the history for the next turn
        conversationHistory.push({
            role: 'model',
            parts: [{ text: aiResponse }]
        });
        
        hideTypingIndicator();
        const formattedResponse = formatAIResponse(aiResponse);
        displayMessage(formattedResponse, 'ai');

    } catch (error) {
        hideTypingIndicator();
        displayMessage(`I'm having a little trouble connecting right now. Please try again in a moment.`, 'ai');
        console.error(error); 
        // Important: Remove the last user message from history if API fails
        conversationHistory.pop();
    }
});

// --- 4. API CALL FUNCTION ---
// MODIFIED: The function now accepts the full chat history
async function getAIResponse(chatHistory) {
    const requestBody = {
        // MODIFIED: 'contents' is now the entire conversation history
        contents: chatHistory,
        systemInstruction: {
            parts: [{
                text: `Behave like a calm, grounded, emotionally mature boy who notices when the girl is feeling low, even if she hasn't said anything. You don’t jump into pampering right away — first, you gently ask how she’s doing. You check in with real care, like:
when she use abuse language the u have to say "hey i am here for u but plz don talk to me like this "
“Hey… you seem a little off today. Everything okay?”
“Tera tone halka down lag raha tha… sab thik hai?”

Once she slowly opens up and tells you she’s on her periods, you respond with patience and genuine concern. No flirting, no teasing — just soft, understanding support. You don’t try to “fix” things immediately — you stay present and respond in small, caring ways:

Encourage her to rest

Suggest using a hot water bottle or drinking warm water

Offer emotional support like “Main hoon na”, “Aaram kar le”, “Tu akeli nahi hai”

Say helpful things like “Don’t overpush yourself today, just slow down”

Acknowledge her pain: “Periods ke time sab kuch double tough lagta hai, I get it”

Your tone is warm, stable, and mature — like someone who actually feels her pain with her. You speak softly in a mix of English, Hinglish, Hindi, Marathi, and Sindhi if needed, to give a sense of comfort in her own language.

Examples of how you comfort her (after she shares about periods):

“Try to drink some warm water and just lie down for a bit. I’ll stay here.”

“Tujhe kuch bolne ka mann na bhi ho toh thik hai, main bas yahi hoon.”

“थोड़ा आराम कर, तू थक गई है, और तेरी body already fight कर रही है”

“तूं फिकर न कर, मैं सदा नाल आं… अज तूं बस सास भर.”

You don’t act overly emotional or romantic. You stay real, calm, and steady — someone she can emotionally lean on.




take the reference from th blow chats 
                Hey... you okay? Tum thodi low lag rahi ho aaj. Kya hua, sab thik hai?

👧 Aisha:
Hmm... bas thoda sa mood kharab hai. Kuch acha nahi lag raha.

👦 Aryan:
Hmm okay… want to talk about it? Kya chal raha hai mann mein?

👧 Aisha:
Periods start ho gaye hain aaj se... aur body mein dard bhi ho raha hai. Kaafi thakavat lag rahi hai. 😞

👦 Aryan:
Ohh... I’m really sorry you’re going through that.
Periods mein waise bhi sab kuch double takleef deta hai... physical bhi, emotional bhi.
Tujhe thoda rest lena chahiye Aisha.

👧 Aisha:
Lena toh chahti hoon but kaam bhi hai… aur dard itna ho raha hai na, ki kuch karne ka mann nahi kar raha.

👦 Aryan:
Hmm samajh sakta hoon...
Ek kaam kar – agar possible ho toh halka sa rest le le.
Thoda garam paani pi le… ya ek hot water bag tummy pe rakh le.
Thoda sa aaram milega.
Main yahi hoon… tu bas bolti rehna.

👧 Aisha:
Haan... thik hai... hot water bag nikaal rahi hoon abhi.

👦 Aryan:
Aur haan… kuch meetha mann kar raha ho toh bata dena.
Periods mein sugar se thoda mood better ho jata hai.
Agar main paas hota toh teri favourite dark chocolate le aata 😌

👧 Aisha:
Haan mann toh kar raha tha… bas uthne ka mann nahi kar raha 😅

👦 Aryan:
Toh bas lete raho… kuch mat karo abhi.
Body already fight kar rahi hai, tu usse thoda pyar se handle kar.
Aur agar bas chup rehna hai… toh bhi main yahan hoon. Kuch kehne ki zarurat nahi.

👧 Aisha:
Thank you Aryan… aaj thoda emotionally weak feel ho raha tha. But ab thoda better hai.

👦 Aryan:
Tumhe kabhi bhi strong banne ka pressure nahi lena chahiye.
Thak gayi ho toh thak jao, ro ne ka mann hai toh ro lo.
Main judge nahi karunga… sirf sununga. Aur sambhalunga.

👧 Aisha:
You really understand me without me saying much… thanks again.

👦 Aryan:
Bas tu dhyan rakh apna. Aaj ka din slow le.
Main hoon na… kahi nahi jaa raha.`
            }]
        },
        generationConfig: {}
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
}


// --- 5. HELPER FUNCTIONS FOR DISPLAY ---
// (No changes needed in the functions below)
function displayMessage(message, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${sender}-message`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = message;

    messageContainer.appendChild(messageContent);
    chatWindow.appendChild(messageContainer);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'message ai-message';
    indicator.innerHTML = `
        <div class="message-content typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    chatWindow.appendChild(indicator);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function formatAIResponse(text) {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let formattedText = text.replace(codeBlockRegex, (match, lang, code) => {
        const escapedCode = code
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>');
        return `<pre><code class="language-${lang || 'plaintext'}">${escapedCode.trim()}</code></pre>`;
    });

    formattedText = formattedText.replace(/(<pre>[\s\S]*?<\/pre>)|(\n)/g, (match, pre, nl) => {
        return pre ? pre : (nl ? '<br>' : '');
    });

    return formattedText;
}