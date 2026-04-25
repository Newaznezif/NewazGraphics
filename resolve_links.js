const fs = require('fs');
const path = require('path');

async function resolveLinks() {
  const jsonPath = path.join(__dirname, 'src', 'data', 'portfolio.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log('Resolving Canva links...');

  for (let project of data.projects) {
    if (project.canva_link && project.canva_link.includes('canva.link')) {
      try {
        console.log(`Resolving: ${project.canva_link}`);
        const response = await fetch(project.canva_link, {
          method: 'HEAD',
          redirect: 'follow'
        });
        const finalUrl = response.url;
        console.log(`Resolved to: ${finalUrl}`);
        project.canva_link = finalUrl;
      } catch (error) {
        console.error(`Error resolving ${project.canva_link}:`, error.message);
      }
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log('Updated portfolio.json with resolved links.');
}

resolveLinks();
