import { SvelteKitAuth } from "@auth/sveltekit"
// import GitHub from "@auth/core/providers/github"
import GitHub from "@auth/sveltekit/providers/github"

// import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

// const githubConfig = { clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }
 
// export const handle = SvelteKitAuth({
//   providers: [GitHub(githubConfig)],
// })


let githubConfig
const devGithubConfig = { clientId: process.env.GITHUB_DEV_ID, clientSecret: process.env.GITHUB_DEV_SECRET}
const prodGithubConfig = { clientId: process.env.GITHUB_PROD_ID, clientSecret: process.env.GITHUB_PROD_SECRET}
process.env.NODE_ENV === 'development' ? githubConfig = devGithubConfig : githubConfig = prodGithubConfig


export const handle = SvelteKitAuth({
  providers: [ 
    GitHub(githubConfig)
  ],
})