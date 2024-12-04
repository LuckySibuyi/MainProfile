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
  let currentStep = "name";

  const messages = {
    init: ["Hello<br />I am Jarvis<span class='emoji'>&#129302;</span>your assistant.", "How can I help you today?"],
    options: ["Skills", "Resume", "LinkedIn", "Github", "Leave a message"],
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

  // Show Options with Icons
  function showOptions(options) {
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options-container";

    options.forEach((option) => {
      const optionElement = document.createElement("button");
      optionElement.className = "option";
      optionElement.innerHTML = getOptionWithIcon(option);
      optionElement.addEventListener("click", () => handleOption(option));
      optionsContainer.appendChild(optionElement);
    });

    chatBox.appendChild(optionsContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Get Option with Icon
  function getOptionWithIcon(option) {
    switch (option.toLowerCase()) {
      case "skills":
        return `<i class="fas fa-cogs"></i> Skills`;  // Gear icon for Skills
      case "github":
        return `<i class="fab fa-github"></i> Github`;  // GitHub icon
      case "linkedin":
        return `<i class="fab fa-linkedin"></i> LinkedIn`;  // LinkedIn icon
      default:
        return option;  // Default option text
    }
  }

  // Show Options Button
  function showOptionsButton() {
    const showOptionsBtn = document.createElement("button");
    showOptionsBtn.className = "show-options";
    showOptionsBtn.innerHTML = "Show More Options";

    const showOptionsBtnContainer = document.createElement("div");
    showOptionsBtnContainer.className = "show-options-container";

    showOptionsBtnContainer.appendChild(showOptionsBtn);

    showOptionsBtn.addEventListener("click", () => {
      showOptions(messages.options);
      showOptionsBtnContainer.remove();
    });

    chatBox.appendChild(showOptionsBtnContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Handle Option Click
  // Handle Option Click
function handleOption(option) {
  addMessage("user", option);
  clearOptions();
  switch (option.toLowerCase()) {
    case "skills":
      addMessage("bot", "Here are some skills I have:<br>- JavaScript<br>- HTML & CSS<br>- React<br>- Node.js");
      break;

    case "resume":
      addMessage("bot", "You can view my resume [here](#).");
      break;

    case "github":
      addMessage("bot", "Here is my GitHub profile:");
      addLinkButton("Visit GitHub", "https://github.com/yourprofile");
      break;

    case "linkedin":
      addMessage("bot", "Here is my LinkedIn profile:");
      addLinkButton("Visit LinkedIn", "https://linkedin.com/in/yourprofile");
      break;

    case "leave a message":
      inputContainer.style.display = "flex";
      addMessage("bot", "Please provide your name:");
      inputField.placeholder = "Enter your name here";
      inputField.focus();
      inputField.removeEventListener("keypress", handleInput);
      inputField.addEventListener("keypress", handleInput);
      break;

    default:
      addMessage("bot", "I'm not sure how to handle that. Please choose an option from the list.");
      setTimeout(() => showOptions(messages.options), 1000);
      break;
  }

  if (option.toLowerCase() !== "leave a message") {
    inputContainer.style.display = "none";
    setTimeout(showOptionsButton, 1000);
  }
}

// Add a button with a link
function addLinkButton(label, url) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "link-button-container";

  const linkButton = document.createElement("button");
  linkButton.className = "link-button";
  linkButton.innerHTML = label;
  linkButton.addEventListener("click", () => {
    window.open(url, "_blank"); // Open link in a new tab
  });

  buttonContainer.appendChild(linkButton);
  chatBox.appendChild(buttonContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}


  // Handle Input (Name, Email, and Message)
  function handleInput(event) {
    // Check if the event is a keypress or button click
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      const userInput = inputField.value.trim();

      if (userInput) {
        inputField.value = ""; // Clear the input field
        addMessage("user", userInput); // Display user input

        if (currentStep === "name") {
          userName = userInput;
          addMessage("bot", `Nice to meet you, ${userName}! What's your email?`);
          inputField.placeholder = "Enter your email here";
          currentStep = "email";

        } else if (currentStep === "email") {
          // Validate email format
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailPattern.test(userInput)) {
            userEmail = userInput;
            addMessage("bot", `Thanks! Now, type your message:`);
            inputField.placeholder = "Enter your message here";
            currentStep = "message";
          } else {
            // Show error message for invalid email
            addMessage("bot", "That doesn't look like a valid email address. Please try again:");
            inputField.placeholder = "Enter a valid email here";
          }

        } else if (currentStep === "message") {
          userMessage = userInput;
          addMessage("bot", `Thanks for your message, ${userName}. We'll reply to ${userEmail} soon.`);
          inputContainer.style.display = "none"; // Hide the input container
          currentStep = "name";
          setTimeout(() => addMessage("bot", "Is there anything else I can assist you with?"), 500);
          setTimeout(showOptionsButton, 1000);
        }
      }
    }
  }

  // Add Event Listener to "Send" button for sending message
  sendMessageButton.addEventListener("click", (event) => handleInput(event));

  function clearOptions() {
    document.querySelectorAll(".option").forEach((el) => el.remove());
  }
});
