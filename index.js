const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chat-container")
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const deleteChat = document.querySelector("#delete-chats-btn");
const themeToggle = document.getElementById("themeToggle");

const API_KEY = "AIzaSyCzRgJ9fq4QAf7TNU2PItAqbcMU0FzmHEg";
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




const scrollToBottom = () => { container.scrollTo({top: container.scrollHeight, behavior: "smooth"}) };


//Typing Effect..!
const typingEffect = (text, textElement, botMsgDiv) => {
    textElement.textContent = "";
    const words = text.split(" ");
    let wordIndex = 0;
    const typingInterval = setInterval(() => {
        if (wordIndex < words.length) {
            textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex];
            // advance to the next word
            wordIndex++;

            scrollToBottom();

        } else {
            clearInterval(typingInterval);
            // remove loading state from the bot message if provided
            if (botMsgDiv && botMsgDiv.classList) botMsgDiv.classList.remove("loading");
        }
    }, 40);
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

    const responseText = data.candidates[0].content.parts[0].text.replace(/\n/g, "").trim();
        typingEffect(responseText, textElement);
        
         // Add bot response to chat history for context in future messages
        chatHistory.push({role: "model", parts:[{text:responseText}]});

    } catch (error){
        console.log(error);
    }
}


// Handle Form Data Submission
const handleFormData = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if (!userMessage || userMessage === "") return;
    promptInput.value = "";

    //Generate user message element and append to chat container...!
    
    const userMsgHTML = `<p class="message-text"> </p>`;
    const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);
    scrollToBottom();

        // Simulate bot response

    setTimeout(() => {

        const botMsgHTML = `<img src="gemini-logo_svgstack_com_37141773500845.svg" alt="" class="avatar"> <p class="message-text"> Just a sec...!</p>`;
        const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
        chatsContainer.appendChild(botMsgDiv);
        scrollToBottom();
        generateBotResponse(botMsgDiv);
    }, 600);


}

// Wire delete chats button once on load (ensure element exists)
if (deleteChat) {
    deleteChat.addEventListener("click", () => {
        chatHistory.length = 0; // clear history
        chatsContainer.innerHTML = ""; // remove messages from DOM
    });
} else {
    console.warn("#delete-chats-btn not found in DOM - delete button not wired.");
}


//Handle Suggestion clicks...
document.querySelectorAll(".suggestions-item").forEach(item => {
    item.addEventListener("click", ()=> {
        promptInput.value = item.querySelector(".text").textContent;
        promptForm.dispatchEvent(new Event("submit"));
    })
})





   
//Toggle Theme.

themeToggle.addEventListener("click", toggleFunction);

function toggleFunction(){
    const isLightTheme = document.body.classList.toggle("light-theme");
    localStorage.setItem("themeColour", isLightTheme ? "light_mode" : "dark_mode");
    themeToggle.textContent = isLightTheme ? "dark_mode" : "light_mode";
}

    // On load, set theme based on localStorage value
    const isLightTheme = localStorage.getItem("themeColour") === "light_mode";
    document.body.classList.toggle("light-theme", isLightTheme);
    themeToggle.textContent = isLightTheme ? "dark_mode" : "light_mode";    


promptForm.addEventListener("submit", handleFormData);