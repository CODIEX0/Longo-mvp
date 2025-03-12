const adminConfig = {
  emailSettings: {
    defaultSenderEmail: process.env.DEFAULT_SENDER_EMAIL,
    smtpServer: process.env.SMTP_SERVER,
    smtpPort: process.env.SMTP_PORT
  },
  googleCloud: {
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  },
  notifications: {
    enabled: true,
    defaultMessage: ''
  }
};

export default adminConfig; 