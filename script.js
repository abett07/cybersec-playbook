const input = document.getElementById("input-line");
const output = document.getElementById("terminal-output");

const commandsList = ["help", "skills", "projects", "resume", "clear", "whoami", "matrix", "clearlog"];

const commandHistory = [];
let historyIndex = -1;

input.addEventListener("keydown", function (e) {
  // Enter
  if (e.key === "Enter") {
    const command = input.value.trim();
    if (command) {
      commandHistory.push(command);
      historyIndex = commandHistory.length;
      handleCommand(command);
      input.value = "";
    }
  }
  // ↑
  else if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
    e.preventDefault();
  }
  // ↓
  else if (e.key === "ArrowDown") {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      input.value = "";
    }
    e.preventDefault();
  }
  // TAB autocomplete
  else if (e.key === "Tab") {
    e.preventDefault();
    const match = commandsList.find(cmd => cmd.startsWith(input.value));
    if (match) input.value = match;
  }

  // Optional: Play keystroke sound
  // const audio = new Audio("assets/keypress.wav");
  // audio.play();
});

function handleCommand(command) {
  let response = "";

switch (command.toLowerCase()) {
  case "help":
    lastCommand = "help";
    response = "Available commands:\n- skills\n- projects\n- resume\n- clear\n- whoami\n- matrix\n- clearlog";
    break;

  case "skills":
    lastCommand = "skills";
    response = "🔐 Cybersecurity:\n" +
               "- Application Security, SSDLC, Threat Modeling\n" +
               "- Incident Response, Forensics, OWASP Top 10\n\n" +
               "🧪 Testing: SAST, DAST, Compliance, Fuzzing\n" +
               "🛠️ Tools: Splunk, Burp, Snort, Nessus, Nikto\n" +
               "💻 Languages: Python, Java, Bash, JS, C#";
    break;

  case "projects":
    lastCommand = "projects";
    response = "Case Files:\n1. AI Threat Hunter\n2. Log4Shell Lab\n3. HTB/THM Writeups";
    break;

  case "1":
    if (lastCommand === "projects") {
      response = "🔍 Opening case file: AI Threat Hunter...";
      setTimeout(() => {
        window.location.href = "projects/threat-hunter.html";
      }, 800);
      printWithTyping(`\n> ${command}\n${response}\n`);
      return;
    }
    break;

  case "2":
    if (lastCommand === "projects") {
      response = "🧪 Opening case file: Log4Shell Lab...";
      setTimeout(() => {
        window.location.href = "projects/log4shell.html";
      }, 800);
      printWithTyping(`\n> ${command}\n${response}\n`);
      return;
    }
    break;

  case "3":
    if (lastCommand === "projects") {
      response = "📁 Opening case file: HTB/THM Writeups...";
      setTimeout(() => {
        window.location.href = "projects/ctf-writeups.html";
      }, 800);
      printWithTyping(`\n> ${command}\n${response}\n`);
      return;
    }
    break;

  case "resume":
    lastCommand = "resume";
    response = "Opening resume page...";
    printWithTyping(`\n> ${command}\n${response}\n`);
    setTimeout(() => {
      window.location.href = "resume.html";
    }, 800);
    return;

  case "clear":
    lastCommand = null;
    output.innerHTML = "";
    return;

  case "whoami":
    lastCommand = "whoami";
    response = "👤 Name: Abett Reddy Cheruku\n" +
               "🎓 M.S. Cybersecurity, UNT (Dec 2024)\n\n" +
               "🧾 Application Security Analyst skilled in SAST/DAST, threat modeling, incident response.\n" +
               "💡 Passionate about AI-driven security & hacking challenges.";
    break;

  case "matrix":
    lastCommand = "matrix";
    response = "🔢 Initializing cyber matrix...\n🧬 Accessing neural net...\n⚠️ Glitch in the shell detected...";
    break;

  case "clearlog":
    lastCommand = "clearlog";
    response = "🗑️ All local logs securely deleted.";
    break;


  case "news":
  response = `Available feeds:\n- news hackernews\n- news krebsonsecurity\n- news nvd\n(Current: ${currentFeed})`;
  break;

  case "news hackernews":
  case "news krebsonsecurity":
  case "news nvd":
    const selected = command.split(" ")[1];
    currentFeed = selected;
    fetchCyberNews(currentFeed);
      response = `✅ Switched to ${selected.toUpperCase()} feed. Headlines updated below ⬇️`;
  break;
  
  default:
    lastCommand = null;
    response = `Command not recognized: '${command}'. Try 'help'`;
}


  printWithTyping(`\n> ${command}\n${response}\n`);
}

function printWithTyping(text) {
  let i = 0;
  const line = document.createElement("div");
  output.appendChild(line);

  function typeChar() {
    if (i < text.length) {
      line.innerHTML += text[i] === "\n" ? "<br>" : text[i];
      i++;
      setTimeout(typeChar, 10);
    } else {
      output.scrollTop = output.scrollHeight;
    }
  }

  typeChar();
}

function updateDateTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();
  const line = document.getElementById("datetime");
  line.innerHTML = `📅 ${dateStr} 🕒 ${timeStr}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Available feeds
const feeds = {
  hackernews: "https://feeds.feedburner.com/TheHackersNews",
  krebsonsecurity: "https://krebsonsecurity.com/feed/",
  nvd: "https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss-analyzed.xml"
};

let currentFeed = "hackernews";

function fetchCyberNews(feedKey = currentFeed) {
  const feedUrl = encodeURIComponent(feeds[feedKey] || feeds["hackernews"]);
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data && data.items) {
        const headlines = data.items.slice(0, 5).map(item => {
        const pubDate = new Date(item.pubDate).toLocaleString();
      return `${item.title} (${pubDate})`;
      }).join("  •  ");
        document.getElementById("news-text").textContent = `📰 ${feedKey.toUpperCase()} News: ${headlines}`;
      } else {
        document.getElementById("news-text").textContent = `⚠️ ${feedKey.toUpperCase()} feed unavailable.`;
      }
    })
    .catch(error => {
      console.error("News fetch error:", error);
      document.getElementById("news-text").textContent = `⚠️ Failed to fetch ${feedKey.toUpperCase()} news.`;
    });
}

fetchCyberNews();
setInterval(() => fetchCyberNews(currentFeed), 10 * 60 * 1000); // Refresh every 10 min
// Change feed every 30 seconds

const tipBox = document.getElementById("cyber-tip-content");

const cyberTips = [
  "🔐 Use a password manager. Random + long > memorable!",
  "🧠 Think before you click: phishing is the #1 threat vector.",
  "📦 Keep all systems updated. Patch known CVEs immediately.",
  "💣 Never trust user input — validate, sanitize, escape!",
  "📊 Enable MFA on all accounts — especially cloud tools.",
  "🔎 Monitor logs. What you don’t log, you can’t investigate.",
  "🛡️ Defense in depth beats any single security control.",
  "🎭 Assume breach. Design like attackers are already inside.",
  "🚧 Disable unused services & ports on public-facing systems.",
  "🧬 Threat model your apps — especially third-party integrations."
];

function rotateTips() {
  const randomTip = cyberTips[Math.floor(Math.random() * cyberTips.length)];
  tipBox.textContent = randomTip;
}

rotateTips(); // initial load
setInterval(rotateTips, 10000); // rotate every 10 sec
