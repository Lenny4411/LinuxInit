const output = document.getElementById("output");
const input = document.getElementById("command-input");

const fileSystem = {
  home: {
    user: {
      "readme.txt": "Bienvenue sur InitSec Terminal.\nTape `help` pour voir les commandes.",
      "tools.txt": "nmap\nwhois\nping\nhashcat\nhydra\nsqlmap\nnikto",
      "passwords.txt": "admin:admin123\nuser:password",
    },
  },
  etc: {
    "passwd": "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash",
    "shadow": "root:$6$saltsalt$encryptedhash:18000:0:99999:7:::",
  },
  bin: {
    "nmap": "Nmap 7.93 - Network exploration tool",
    "sqlmap": "sqlmap - automatic SQL injection tool",
  },
};

let currentPath = ["home", "user"];

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim();
    input.value = "";
    output.innerHTML += `\nuser@initsec:~$ ${command}\n`;
    handleCommand(command);
    output.scrollTop = output.scrollHeight;
  }
});

function handleCommand(cmd) {
  const args = cmd.split(" ");
  const base = args[0];

  switch (base) {
    case "help":
      print(`Commandes disponibles :
  ls        - liste les fichiers
  cd        - change de répertoire
  pwd       - chemin actuel
  cat       - affiche le contenu d’un fichier
  clear     - efface l’écran
  whoami    - affiche l’utilisateur
  echo      - imprime du texte
  uname     - infos système
  tools     - liste des outils hacking
  history   - historique des commandes
  exit      - quitte le terminal`);
      break;
    case "ls":
      listFiles();
      break;
    case "cd":
      changeDirectory(args[1]);
      break;
    case "pwd":
      print(`/${currentPath.join("/")}`);
      break;
    case "cat":
      catFile(args[1]);
      break;
    case "clear":
      output.innerHTML = "";
      break;
    case "whoami":
      print("user");
      break;
    case "uname":
      print("Linux initsec 6.6.0-virtual x86_64 GNU/Linux");
      break;
    case "echo":
      print(args.slice(1).join(" "));
      break;
    case "tools":
      print("Outils disponibles : nmap, sqlmap, whois, hydra, gobuster, nikto, wfuzz");
      break;
    case "history":
      print("1  ls\n2  cat readme.txt\n3  tools\n4  cd ..");
      break;
    case "exit":
      print("Déconnexion...\nÀ bientôt sur InitSec !");
      break;
    default:
      print(`Commande inconnue : ${base}`);
  }
}

function getCurrentDir() {
  return currentPath.reduce((acc, key) => acc[key], fileSystem);
}

function listFiles() {
  const dir = getCurrentDir();
  print(Object.keys(dir).join("  "));
}

function changeDirectory(dirName) {
  if (!dirName) return;
  if (dirName === "..") {
    if (currentPath.length > 1) currentPath.pop();
  } else {
    const dir = getCurrentDir();
    if (dir[dirName] && typeof dir[dirName] === "object") {
      currentPath.push(dirName);
    } else {
      print(`Aucun dossier nommé "${dirName}"`);
    }
  }
}

function catFile(fileName) {
  const dir = getCurrentDir();
  if (dir[fileName] && typeof dir[fileName] === "string") {
    print(dir[fileName]);
  } else {
    print(`Fichier introuvable: ${fileName}`);
  }
}

function print(text) {
  output.innerHTML += text + "\n";
}
