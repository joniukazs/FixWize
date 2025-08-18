const fs = require('fs');
const path = require('path');

// Deployment configuration
const DEPLOYMENT_CONFIG = {
  // Jūsų serverio informacija
  server: {
    host: 'fixwize.com', // Jūsų domenas
    path: '/public_html', // Kelias iki svetainės failų
    // Galite naudoti FTP, SSH arba Git
    method: 'ftp' // 'ftp', 'ssh', 'git'
  },
  
  // Failai, kuriuos reikia atnaujinti
  filesToUpdate: [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/**/*.css',
    'public/**/*',
    'package.json',
    'vite.config.ts'
  ],
  
  // Failai, kurių nereikia atnaujinti (saugumo sumetimais)
  excludeFiles: [
    '.env',
    '.env.local',
    'node_modules/**/*',
    '.git/**/*'
  ]
};

// Funkcija sukurti atnaujinimo paketą
function createUpdatePackage() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const updateDir = `updates/update-${timestamp}`;
  
  if (!fs.existsSync('updates')) {
    fs.mkdirSync('updates');
  }
  
  fs.mkdirSync(updateDir, { recursive: true });
  
  // Nukopijuoti reikalingus failus
  DEPLOYMENT_CONFIG.filesToUpdate.forEach(pattern => {
    // Čia būtų logika kopijuoti failus pagal pattern
    console.log(`Copying files matching: ${pattern}`);
  });
  
  // Sukurti atnaujinimo instrukciją
  const updateInstructions = {
    version: timestamp,
    description: "Sistema atnaujinta su naujomis funkcijomis",
    files: DEPLOYMENT_CONFIG.filesToUpdate,
    instructions: [
      "1. Sustabdyti esamą aplikaciją",
      "2. Nukopijuoti naujus failus",
      "3. Paleisti 'npm install' jei reikia",
      "4. Paleisti 'npm run build'",
      "5. Paleisti aplikaciją iš naujo"
    ]
  };
  
  fs.writeFileSync(
    path.join(updateDir, 'update-info.json'), 
    JSON.stringify(updateInstructions, null, 2)
  );
  
  console.log(`Atnaujinimo paketas sukurtas: ${updateDir}`);
  return updateDir;
}

// Eksportuoti funkcijas
module.exports = {
  createUpdatePackage,
  DEPLOYMENT_CONFIG
};

// Jei paleidžiama tiesiogiai
if (require.main === module) {
  createUpdatePackage();
}