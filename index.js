const chatsContainer = document.querySelector(".chat-container")
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");

const API_KEY = "AIzaSyCyAWC-Y8GY35udeBECeg_ehaeRF7loGvY";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";


let userMessage = "";

// Create message Element
const createMsgElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content; 
    return div;
}

const generateBotResponse = async () => {
    try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "content-type": "application/json"},
          body: JSON.stringify()  
        })
    } catch (error){

    }
}


// Handle Form Data Submission
const handleFormData = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if (!userMessage)return;
    promptInput.value = "";

    //Generate user message element and append to chat container...!
    
    const userMsgHTML = `<p class="message-text"> </p>`;
    const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);

        // Simulate bot response

    setTimeout(() => {

        const botMsgHTML = `<img src="gemini-logo_svgstack_com_37141773500845.svg" alt="" class="avatar"> <p class="message-text"> Just a sec...!</p>`;
        const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
        chatsContainer.appendChild(botMsgDiv);
        generateBotResponse();
    }, 600);



}

promptForm.addEventListener("submit", handleFormData);