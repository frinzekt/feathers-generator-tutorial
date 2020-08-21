const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const {
  expressOauth,
  OAuthStrategy,
} = require("@feathersjs/authentication-oauth");

class GitHubStrategy extends OAuthStrategy {
  // EXTENDS FUNCTIONALITY OF THE GET ENTITY
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);

    // INCULDE BOTH THE EMAIL, AND THE BASEDATA
    return { ...baseData, email: profile.email };
  }
}

module.exports = (app) => {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new LocalStrategy());
  authentication.register("github", new GitHubStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
