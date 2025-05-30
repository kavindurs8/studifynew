{{-- filepath: e:\pil55\STUDIFY\resources\views\emails\teacher-otp.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Teacher Account</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            background: #f8f9fa;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            letter-spacing: 5px;
        }
        .footer { margin-top: 30px; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to STUDIFY</h1>
            <h2>Verify Your Teacher Account</h2>
        </div>

        <p>Dear {{ $teacher->name }},</p>

        <p>Thank you for registering as a teacher on STUDIFY. To complete your registration, please verify your email address using the OTP code below:</p>

        <div class="otp-code">{{ $otp }}</div>

        <p>This OTP is valid for 10 minutes. If you didn't request this verification, please ignore this email.</p>

        <p>After email verification, your account will be pending admin approval. You will receive another email once your account is approved.</p>

        <div class="footer">
            <p>Best regards,<br>The STUDIFY Team</p>
        </div>
    </div>
</body>
</html>
