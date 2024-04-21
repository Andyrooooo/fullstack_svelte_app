import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "$lib/mongodb/mongodb.client"

if (!clientPromise) {
  throw new Error("Client promise is undefined")
}


// import GitHub from "@auth/core/providers/github"
// import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"
// const githubConfig = { clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }
// export const handle = SvelteKitAuth({
//   providers: [GitHub(githubConfig)],
// })


let githubConfig
const devGithubConfig = { 
  clientId: process.env.GITHUB_DEV_ID, 
  clientSecret: process.env.GITHUB_DEV_SECRET,
  allowDangerousEmailAccountLinking: true
}
const prodGithubConfig = { 
  clientId: process.env.GITHUB_PROD_ID, 
  clientSecret: process.env.GITHUB_PROD_SECRET,
  allowDangerousEmailAccountLinking: true
}
process.env.NODE_ENV === 'development' ? githubConfig = devGithubConfig : githubConfig = prodGithubConfig


export const {handle} = SvelteKitAuth({
  providers: [ 
    GitHub(githubConfig),
  ],
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "DWDD3780"}),
})

export async function getSession(request) {
  const user = request.locals.user; // get user from request locals
  return {
      user: user ? { name: user.name, email: user.email } : null
  };
}