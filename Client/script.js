const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const ai = document.querySelector("#ai-response");

document.addEventListener('DOMContentLoaded', initializeChatbot);

function initializeChatbot() {
    const welcomeMessage = "Hello! I am your ChatBot. How can I assist you today?";
    typeEffect("Bot: " + welcomeMessage, ai, 'bot-message');
}

function toggleChatbot() {
    const chatBox = document.getElementById('chat-box');
    const chatToggle = document.getElementById('chat-toggle');
    chatBox.classList.toggle('hidden');
    chatToggle.classList.toggle('hidden');
}

function minimizeChatbot() {
    toggleChatbot();
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        displayMessage(`You: ${message}`, 'user-message');
        chatInput.value = '';

        const dressKeywords = [
            // Styles and Types
            "A-line", "sheath", "wrap", "shift", "bodycon", "maxi", "midi", "mini",
            "cocktail", "gown", "sundress", "shirt dress", "slip dress", "tunic", "dress", 
            "ethnic wear", "jumpsuit", "romper", "kaftan", "boho dress", "maternity dress", 
            "frock", "babydoll dress", "pinafore dress", "peplum dress", "tea dress", 
            "trapeze dress", "skater dress", "pencil dress", "bardot dress", "bandeau dress", 
            "mule dress", "overall dress", "sarong dress", "qipao", "cheongsam", "hanbok",
            // Fabrics and Materials
            "cotton", "silk", "linen", "chiffon", "velvet", "satin", "denim", "lace",
            "polyester", "wool", "jersey", "tulle", "organza", "brocade", "tweed", "knit", 
            "cashmere", "faux leather", "faux fur", "mesh", "tencel", "modal", "bamboo fabric",
            "suede", "corduroy", "seersucker", "viscose", "rayon", "hemp", "nylon",
            // Design Elements
            "neckline", "collar", "V-neck", "scoop neck", "halter", "off-shoulder",
            "sweetheart", "turtleneck", "cowl neck", "boat neck", "plunging", "square neck", 
            "high neck", "illusion neckline", "one-shoulder", "jewel neckline", "round neck",
            // Sleeves
            "sleeveless", "cap sleeve", "short sleeve", "three-quarter sleeve",
            "long sleeve", "puff sleeve", "bell sleeve", "kimono sleeve", "dolman", 
            "bishop sleeve", "cold-shoulder", "lantern sleeve", "balloon sleeve", 
            "flutter sleeve", "raglan sleeve", "angel sleeve",
            // Silhouette and Fit
            "fitted", "loose", "tailored", "relaxed", "empire waist", "peplum",
            "mermaid", "trumpet", "ball gown", "princess cut", "sheath", "fit-and-flare",
            "oversized", "asymmetrical", "bias cut", "shift", "tent dress", "column dress",
            // Length and Hemline
            "floor-length", "ankle-length", "tea-length", "knee-length", "mini",
            "high-low", "asymmetrical", "handkerchief hem", "ruffle hem", "midi",
            "tea-length", "micro-mini", "maxi", "above knee", "below knee", "mid-thigh",
            // Embellishments and Details
            "beaded", "sequined", "embroidered", "pleated", "ruched", "draped",
            "fringe", "appliqué", "cutout", "backless", "open back", "keyhole", 
            "feathered", "pearl embellishments", "crystal embellishments", "metallic",
            "tassels", "lace-up", "ribbons", "smocked", "tie-front", "sash", 
            "rhinestones", "buttons", "zippers", "studs", "pockets", "patches", 
            "scalloped edges", "lace trim", "belted waist", "gathers", "piping",
            // Closures
            "zipper", "buttons", "hook-and-eye", "tie closure", "snap buttons",
            "lace-up", "wrap", "pullover", "belted", "elastic waist", "drawstring",
            // Patterns and Prints
            "floral", "polka dot", "striped", "plaid", "geometric", "abstract",
            "animal print", "solid color", "ombré", "tie-dye", "paisley", "tropical",
            "camouflage", "chevron", "herringbone", "ikat", "tribal", "art deco", 
            "floral embroidery", "polka dot print", "stripe pattern", "houndstooth", 
            "gingham", "tartan", "argyle", "batik", "damask", "toile",
            // Occasions
            "casual", "formal", "wedding", "prom", "cocktail", "office wear",
            "beach wear", "evening wear", "party", "bridesmaid", "homecoming",
            "gala", "red carpet", "holiday", "travel", "festival", "date night",
            "reception", "garden party", "brunch", "luncheon", "baby shower", 
            "bridal shower", "business casual", "interview",
            // Seasons and Weather
            "summer dress", "winter dress", "spring dress", "fall dress",
            "all-season", "resort wear", "transitional", "rainy day",
            "layered", "lightweight", "insulated", "warm weather", "cold weather", 
            "seasonal", "holiday season", "resort", "cruise wear",
            // Gender and Identity
            "women's", "men's", "unisex", "gender-neutral", "non-binary",
            "androgynous", "feminine", "masculine", "inclusive", "gender-fluid", 
            "transgender", "queer fashion",
            // Size and Fit
            "plus size", "petite", "maternity", "curve", "inclusive sizing",
            "tall", "regular", "short", "custom fit", "tailored fit", "loose fit", 
            "standard fit", "athletic fit", "oversized fit", "slim fit",
            // Sustainability and Ethics
            "eco-friendly", "sustainable", "organic", "recycled", "fair trade",
            "vegan", "cruelty-free", "upcycled", "zero-waste", "biodegradable",
            "ethical", "slow fashion", "handmade", "artisanal", "locally made",
            "carbon neutral", "minimal waste", "renewable materials",
            // Brands and Designers
            "luxury", "high-street", "designer", "fast fashion", "couture",
            "ready-to-wear", "bespoke", "vintage", "contemporary", "streetwear",
            "indie", "ethical fashion", "handmade", "boutique", "limited edition", 
            "one-of-a-kind", "collaborative", "runway", "high fashion", 
            "emerging designers", "legacy brands", "celebrity brands"
        ];
        
        const isDressRelated = dressKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));

        setTimeout(() => {
            if (isDressRelated) {
                typeEffect(`Bot: I have generated an image for "${message}"`, ai, 'bot-message');
                generateImage(message);
            } else {
                typeEffect("Bot: " + getConversationalResponse(message), ai, 'bot-message');
            }
        }, 1000);
    }
}

function getConversationalResponse(message) {
    const responses = {
        hello: "Hello! How can I assist you today?",
        hi: "Hello! How can I assist you today?",
        'how are you': "I'm just a bot, but I'm here to help you!",
        'thank you': "You're welcome! Is there anything else I can help you with?",
        bye: "Goodbye! Have a great day!",
        ok:"Cool! What you need? "
    };
    
    const lowerCaseMessage = message.toLowerCase();
    for (const key in responses) {
        if (lowerCaseMessage.includes(key)) {
            return responses[key];
        }
    }

    return "I am a chatbot designed to generate dress designs. Please ask me about dresses, gowns, skirts, or other apparel.";
}

async function generateImage(prompt) {
    try {
        const response = await fetch('http://localhost:4000/image/generation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, aspect_ratio: '1:1', style: 'PHOTOREALISTIC' })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from server:', errorData);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const imageUrl = data.data[0].asset_url;

        if (!imageUrl) throw new Error('Image URL is undefined');

        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.style.width = "300px";
        imageElement.style.height = "80%";
        ai.appendChild(imageElement);

        scrollToBottom(ai);

        // After generating the image, ask if the user wants to proceed
        askToProceedWithDesign();
    } catch (error) {
        console.error('Error generating image:', error);
    }
}

function askToProceedWithDesign() {
    const question = "Do you want to proceed with this design? (yes/no)";
    typeEffect("Bot: " + question, ai, 'bot-message');

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = 'Type your answer here...';
    inputElement.classList.add('message', 'user-message');
    ai.appendChild(inputElement);

    scrollToBottom(ai);

    inputElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const userAnswer = inputElement.value.trim().toLowerCase();
            inputElement.remove();

            if (userAnswer === 'yes') {
                const ques = "These are some designers that can help you bring your selected design to life. Please select any one designer to whom you want to give your dress order."
                typeEffect("Bot: " + ques, ai, 'bot-message');

                showDesignerOptions();
            } else if (userAnswer === 'no') {
                const promptMessage = "Please provide a new design prompt:";
                typeEffect("Bot: " + promptMessage, ai, 'bot-message');

                const newPromptElement = document.createElement('input');
                newPromptElement.type = 'text';
                newPromptElement.placeholder = 'Type your design prompt here...';
                newPromptElement.classList.add('message', 'user-message');
                ai.appendChild(newPromptElement);
                scrollToBottom(ai);

                newPromptElement.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        const newPrompt = newPromptElement.value.trim();
                        newPromptElement.remove();
                        generateImage(newPrompt);
                    }
                });
            } else {
                typeEffect("Bot: Please answer with 'yes' or 'no'.", ai, 'bot-message');
                askToProceedWithDesign();
            }
        }
    });
}

function showDesignerOptions() {
    const designers = [
        { name: 'Yashi', description: 'Specializes in evening gowns.', imageUrl: './images/girl.webp' },
        { name: 'Muskan', description: 'Known for casual wear.', imageUrl: './images/girl.webp' },
        { name: 'Anthony', description: 'Expert in bridal dresses.', imageUrl: './images/boy.png' }
    ];

    const designerContainer = document.createElement('div');
    designerContainer.classList.add('designer-container');
    ai.appendChild(designerContainer);

    designers.forEach(designer => {
        const designerCard = document.createElement('div');
        designerCard.classList.add('designer-card');
        designerCard.innerHTML = `
          
            <img src="${designer.imageUrl}" alt="${designer.name}">
            <div class="designer-info">
                <h3>${designer.name}</h3>
                <p>${designer.description}</p>
            </div>
        `;
        designerCard.addEventListener('click', function() {
            typeEffect(`Bot: You have selected ${designer.name}. I will get back to you with best price soon.`, ai, 'bot-message');
        });

        designerContainer.appendChild(designerCard);
    });

    scrollToBottom(ai);
}

function typeEffect(text, container, messageType, marginTop = 0) {
    let i = 0;
    const typingSpeed = 50;
    const element = document.createElement('div');
    element.style.marginTop = `${marginTop}px`;
    element.classList.add('message', messageType);

    container.appendChild(element);

    (function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, typingSpeed);
            scrollToBottom(container);
        }
    })();
}

function displayMessage(text, messageType) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', messageType);
    messageElement.textContent = text;
    ai.appendChild(messageElement);
    scrollToBottom(ai);
}

function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}


