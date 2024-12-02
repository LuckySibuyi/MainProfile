function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleButton");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const closeButton = document.getElementById("closeButton");
  const chatBox = document.getElementById("chat");
  const inputField = document.getElementById("input");
  const sendMessageButton = document.getElementById("button");
  const refreshButton = document.querySelector(".refBtn");
  const inputContainer = document.querySelector(".input-container");

  let userName = "";
  let userEmail = "";
  let userMessage = "";
  let currentStep = "name"; // Track the current step: "name", "email", or "message"

  const messages = {
    init: ["Hello<br />I am Jarvis<span class='emoji'>&#129302;</span>your assistant.", "How can I help you today?"],
    options: ["Movies 🎥", "News 📰", "Shopping 🛍️", "Music 🎵", "Others"],
  };

  // Toggle Chatbot
  toggleButton.addEventListener("click", () => {
    chatbotContainer.style.display = "flex";
    toggleButton.style.display = "none";
    initializeChat();
  });

  closeButton.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
    toggleButton.style.display = "block";
  });

  refreshButton.addEventListener("click", () => {
    initializeChat();
    inputContainer.style.display = "none";
  });

  // Initialize Chat
  function initializeChat() {
    chatBox.innerHTML = "";
    inputContainer.style.display = "none";
    messages.init.forEach((message, index) => {
      setTimeout(() => addMessage("bot", message), index * 500);
    });
    setTimeout(() => showOptions(messages.options), messages.init.length * 500);
  }

  // Add Message
  function addMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.className = sender === "bot" ? "bot-message" : "user-message";

    const icon = sender === "bot" 
      ? `<img src="bot.jpg" alt="bot-icon" class="avatar">` 
      : `<img src="avatar.jpg" alt="user-icon" class="avatar">`;

    messageElement.innerHTML = sender === "bot" ? `${icon} <span>${text}</span>` : `<span>${text}</span> ${icon}`;
    
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Show Options
  function showOptions(options) {
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options-container"; // Add the options container
  
    options.forEach((option) => {
      const optionElement = document.createElement("button");
      optionElement.className = "option";
      optionElement.innerHTML = option;
      optionElement.addEventListener("click", () => handleOption(option));
      optionsContainer.appendChild(optionElement);
    });
  
    chatBox.appendChild(optionsContainer); // Append the container to the chatbox
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Show Options Button
  // Show Options Button
function showOptionsButton() {
  const showOptionsBtn = document.createElement("button");
  showOptionsBtn.className = "show-options";
  showOptionsBtn.innerHTML = "Show More Options";

  const showOptionsBtnContainer = document.createElement("div");
  showOptionsBtnContainer.className = "show-options-container"; // Add the container class

  showOptionsBtnContainer.appendChild(showOptionsBtn); // Append button to container

  showOptionsBtn.addEventListener("click", () => {
    showOptions(messages.options);
    showOptionsBtnContainer.remove(); // Remove the button after showing options
  });

  chatBox.appendChild(showOptionsBtnContainer); // Append the container to the chatbox
  chatBox.scrollTop = chatBox.scrollHeight;
}


  // Handle Option Click
  function handleOption(option) {
    addMessage("user", option); // Show user response
    clearOptions();

    if (option.toLowerCase() === "others") {
      // Ask for name if "Others" is selected
      inputContainer.style.display = "flex";
      addMessage("bot", "Please provide your name:");
      inputField.placeholder = "Enter your name here";
      inputField.focus();
      inputField.removeEventListener("keypress", handleInput);
      inputField.addEventListener("keypress", handleInput);
    } else {
      inputContainer.style.display = "none";
      setTimeout(() => addMessage("bot", `You selected: ${option}`), 500);
      setTimeout(showOptionsButton, 1000); // Show the "Show Options" button after a selection
    }
  }

  // Handle Input (Name, Email, and Message)
  function handleInput(event) {
    if (event.key === "Enter" || event.target === sendMessageButton) {
      if (inputField.value.trim()) {
        const userInput = inputField.value.trim();
        inputField.value = ""; // Clear input field

        if (currentStep === "name") {
          userName = userInput;
          addMessage("user", userName);
          addMessage("bot", "Thank you! Now, please provide your email address:");
          inputField.placeholder = "Enter your email here";
          currentStep = "email";
        } else if (currentStep === "email") {
          userEmail = userInput;
          addMessage("user", userEmail);
          addMessage("bot", "Great! Finally, please type your message:");
          inputField.placeholder = "Enter your message here";
          currentStep = "message";
        } else if (currentStep === "message") {
          userMessage = userInput;
          addMessage("user", userMessage);
          addMessage("bot", `Thank you, ${userName}! We've received your message and will get back to you at ${userEmail} soon.`);
          inputContainer.style.display = "none"; // Hide input container
          currentStep = "name"; // Reset for next interaction
          setTimeout(() => addMessage("bot", "Would you like to see the options again?"), 500);
          setTimeout(showOptionsButton, 1000); // Show the "Show Options" button
        }
      }
    }
  }

  // Add Event Listener to "Send" button for sending message
  sendMessageButton.addEventListener("click", handleInput);

  function clearOptions() {
    document.querySelectorAll(".option").forEach((el) => el.remove());
  }
});
