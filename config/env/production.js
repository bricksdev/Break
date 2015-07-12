
/**
 * Expose
 */

module.exports = {
  db: process.env.MONGOHQ_URL,
  // 定义图片上传类型
  imageType:process.env.IMAGE_TYPE,
  imageLocalPath:process.env.IMAGE_LOCAL_PATH,
  facebook: {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://break.szldkj.net/auth/facebook/callback"
  },
  twitter: {
    clientID: process.env.TWITTER_CLIENTID,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL: "http://break.szldkj.net/auth/twitter/callback"
  },
  github: {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: 'http://break.szldkj.net/auth/github/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENTID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: 'http://break.szldkj.net/auth/linkedin/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://break.szldkj.net/auth/google/callback"
  }
};
