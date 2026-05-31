exports.handler = async (event) => {
  // Common styling for Event Macha emails
  const primaryColor = '#FF3366';
  const secondaryColor = '#6A0572';
  
  const baseHtml = (title, message, code) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .header {
          background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          letter-spacing: 1px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .content h2 {
          color: #2d3748;
          font-size: 22px;
          margin-top: 0;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          color: #4a5568;
          margin-bottom: 30px;
        }
        .code-box {
          background-color: #f1f5f9;
          border: 2px dashed ${primaryColor};
          border-radius: 8px;
          padding: 15px;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 4px;
          color: ${primaryColor};
          display: inline-block;
          margin-bottom: 20px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #a0aec0;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Event Macha</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          <p>${message}</p>
          <div class="code-box">${code}</div>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Event Macha. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  if (event.triggerSource === "CustomMessage_SignUp") {
    const code = event.request.codeParameter;
    event.response.emailSubject = "Welcome to Event Macha! Verify your email";
    event.response.emailMessage = baseHtml(
      "Verify Your Email Address",
      "We're excited to have you! Please use the verification code below to complete your sign-up process.",
      code
    );
  } else if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const code = event.request.codeParameter;
    event.response.emailSubject = "Event Macha - Password Reset Request";
    event.response.emailMessage = baseHtml(
      "Reset Your Password",
      "We received a request to reset your password. Use the code below to set up a new password.",
      code
    );
  }

  return event;
};
