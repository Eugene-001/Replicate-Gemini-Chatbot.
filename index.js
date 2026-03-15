const chatsContainer = document.querySelector(".chat-container")
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");

const API_KEY = "AIzaSyDsFnB92osOJmlTz6Ii38pomKkg8wXzySA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;


let userMessage = "";
let chatHistory = [];

// Create message Element
const createMsgElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content; 
    return div;
}

//Make the API call and generate bot response...!
// Accept the bot message DOM node so we can update it in-place once the
// response arrives.
const generateBotResponse = async (botMsgDiv) => {
        const textElement = botMsgDiv.querySelector(".message-text")
    
    chatHistory.push({
        role: "user",
        parts: [{text: userMessage}]
    })

    try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({contents: chatHistory})
        });

    const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        const responseText = data.candidates[0].content.parts[0].text.replace(/\n/g, "<br>").trim();
        textElement.textContent = responseText;


    } catch (error){
        console.log(error);
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
        generateBotResponse(botMsgDiv);
    }, 600);



}

promptForm.addEventListener("submit", handleFormData);