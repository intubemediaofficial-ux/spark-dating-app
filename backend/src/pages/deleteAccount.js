module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delete Account - MatchKar</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #333; background: #f8f9fa; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { color: #FF4458; font-size: 2em; }
    .header p { color: #666; margin-top: 8px; }
    h2 { color: #FF4458; margin: 30px 0 15px; font-size: 1.3em; }
    p, li { margin-bottom: 12px; color: #555; }
    ul { padding-left: 20px; }
    .card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .footer { text-align: center; margin-top: 40px; color: #999; font-size: 0.9em; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .steps { background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .steps ol { padding-left: 20px; }
    .steps li { margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Delete Your MatchKar Account</h1>
      <p>We're sorry to see you go</p>
    </div>
    <div class="card">
      <h2>How to Delete Your Account</h2>
      
      <div class="steps">
        <p><strong>Option 1: From the App</strong></p>
        <ol>
          <li>Open MatchKar app</li>
          <li>Go to <strong>Settings</strong> (gear icon)</li>
          <li>Scroll down to <strong>"Delete Account"</strong></li>
          <li>Confirm deletion</li>
        </ol>
      </div>

      <div class="steps">
        <p><strong>Option 2: Via Email</strong></p>
        <ol>
          <li>Send an email to <strong>privacy@matchkar.com</strong></li>
          <li>Subject: "Account Deletion Request"</li>
          <li>Include your registered phone number or email</li>
          <li>We will process your request within 48 hours</li>
        </ol>
      </div>

      <h2>What Happens When You Delete Your Account</h2>
      <div class="warning">
        <p><strong>Warning:</strong> Account deletion is permanent and cannot be undone.</p>
      </div>
      <ul>
        <li>Your profile will be immediately hidden from other users</li>
        <li>All your matches and conversations will be permanently deleted</li>
        <li>Your photos will be removed from our servers</li>
        <li>Your personal data will be permanently erased within 30 days</li>
        <li>Any active subscription will be cancelled (no refund for remaining period)</li>
        <li>You will not be able to recover any data after deletion</li>
      </ul>

      <h2>Data We Delete</h2>
      <ul>
        <li>Profile information (name, bio, photos, preferences)</li>
        <li>Location history</li>
        <li>Match history and conversations</li>
        <li>Swipe history</li>
        <li>Payment information (processed by Razorpay, removed from our records)</li>
      </ul>

      <h2>Data We May Retain</h2>
      <p>We may retain limited data as required by law:</p>
      <ul>
        <li>Transaction records (for tax/legal compliance, up to 7 years)</li>
        <li>Reports filed against your account (for safety purposes)</li>
      </ul>

      <h2>Contact Us</h2>
      <p>If you have questions about data deletion:</p>
      <p><strong>Email:</strong> privacy@matchkar.com</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 MatchKar. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
