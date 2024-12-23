import fs from 'node:fs'
import path from 'node:path'

export default {
  // Monitora todos os arquivos JSON no diretório 'data/people'
  watch: ['../contribuidores/*.json'],
  load(watchedFiles) {
    // Lê e processa cada arquivo JSON
    const people = watchedFiles.map((file) => {
      const content = fs.readFileSync(file, 'utf-8')
      return JSON.parse(content)
    })

    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

    function isValidGithubUsername(username: string): boolean {
      return githubUsernameRegex.test(username);
    }

    const members = people
      .map((person) => {
        if (!person.github || !isValidGithubUsername(person.github)) {
          throw new Error(`Invalid GitHub URL: ${person.github}`);
        }

        const username = person.github.split('/').pop();
        return {
          avatar: `https://github.com/${username}.png`,
          name: person.name?.trim() || username,
          links: [
            { icon: 'github', link: person.github },
          ],
        };
      });

    return { members }
  },
}
