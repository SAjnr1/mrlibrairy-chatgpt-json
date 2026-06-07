// All your sample texts
const sampleTexts = [
  " “Enjoy Reading. Enjoy Learning.” ",
  " “Unlock a World of Knowledge.” ",
  " “Every Book Opens a New Door.”  ",
  " “One week without reading makes the mind weak.” — Unknown",
  " “Read. Learn. Grow.” ",
  " “There is more treasure in books than in all the pirate’s loot on Treasure Island.” — Walt Disney",
  " “Books are a uniquely portable magic.” — Stephen King",
  " “That's the thing about books. They let you travel without moving your feet.” — Unknown",
  " “A book is a dream that you hold in your hand.” — Neil Gaiman",
  " “Books give a soul to the universe, wings to the mind, flight to the imagination, and life to everything.” — Plato",
  " “A well-read woman is a dangerous creature.” — Lisa Kleypas",
  " “The world belongs to those who read.” — Rick Holland",
  " “A peasant that reads is a prince in waiting.” — Walter Mosley",
  " “Reading…a vacation for the mind.” — Dave Barry",
  " “A book is a gift you can open again and again.” — Garrison Keillor",
  " “Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors, and the most patient of teachers.” — Charles W. Eliot",
  " “Every book is a new adventure.” — Unknown",
  " “A child who reads will be an adult who thinks.” - Unknown",
  " “The greatest gift is a passion for reading.” - Elizabeth Hardwick",
  " “The only thing you absolutely have to know is the location of the library.” — Albert Einstein",
];


// Pick one random text
const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

const element = document.getElementById("typeTarget");
let index = 0;

// Typing animation function
function typeLetter() {
  if (index < text.length) {
    element.textContent += text.charAt(index);
    index++;
    setTimeout(typeLetter, 60);  // typing speed (lower = faster)
  }
}

// Start typing animation
typeLetter();