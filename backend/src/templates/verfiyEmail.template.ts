export const verifyEmailTemplate = (name: string, link: string) => `
  <!-- Outer wrapper with warm paper-toned background -->
  <div style="
    background-color: #F5F2ED;
    padding: 48px 20px;
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
  ">

    <div style="
      max-width: 580px;
      margin: 0 auto;
      background: #FDFCFA;
      border: 1px solid #E8E2D9;
      border-radius: 4px;
      box-shadow:
        0 2px 8px rgba(60, 45, 20, 0.06),
        0 24px 64px rgba(60, 45, 20, 0.08);
      overflow: hidden;
    ">

      <!-- Gold top rule -->
      <div style="
        height: 3px;
        background: linear-gradient(90deg, #C9A84C 0%, #E8C97A 40%, #C9A84C 100%);
      "></div>

      <!-- Header -->
      <div style="
        padding: 40px 52px 32px;
        border-bottom: 1px solid #EDE8E0;
        text-align: center;
      ">

        <!-- Wordmark -->
        <div style="margin-bottom: 6px;">
          <span style="
            font-family: 'Palatino Linotype', Palatino, Georgia, serif;
            font-size: 30px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #1A1612;
          ">Do</span><span style="
            font-family: 'Palatino Linotype', Palatino, Georgia, serif;
            font-size: 30px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #C9A84C;
          ">Nxt</span>
        </div>

        <!-- Thin decorative rule under logo -->
        <div style="
          width: 40px;
          height: 1px;
          background: #C9A84C;
          margin: 12px auto 0;
          opacity: 0.6;
        "></div>

      </div>

      <!-- Body -->
      <div style="padding: 48px 52px 40px;">

        <!-- Small caps label -->
        <p style="
          font-family: 'Courier New', Courier, monospace;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9A84C;
          margin: 0 0 28px;
        ">Email Verification</p>

        <!-- Headline -->
        <h1 style="
          font-family: 'Palatino Linotype', Palatino, Georgia, serif;
          font-size: 26px;
          font-weight: normal;
          font-style: italic;
          color: #1A1612;
          margin: 0 0 28px;
          line-height: 1.4;
        ">
          Welcome, ${name}.
        </h1>

        <!-- Body copy -->
        <p style="
          font-size: 15px;
          color: #5C5347;
          line-height: 1.85;
          margin: 0 0 18px;
        ">
          Thank you for joining <strong style="color: #1A1612; font-weight: 600;">DoNxt</strong> —
          a refined space built for people who value focused, intentional work.
        </p>

        <p style="
          font-size: 15px;
          color: #5C5347;
          line-height: 1.85;
          margin: 0 0 40px;
        ">
          To complete your registration and access your workspace,
          please verify your email address using the button below.
        </p>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
          <tr>
            <td align="center">
              <a href="${link}" style="
                display: inline-block;
                background: #1A1612;
                color: #F5F2ED;
                text-decoration: none;
                font-family: 'Courier New', Courier, monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 3px;
                text-transform: uppercase;
                padding: 17px 44px;
                border-radius: 2px;
                border-bottom: 2px solid #C9A84C;
              ">
                Verify My Email
              </a>
            </td>
          </tr>
        </table>

        <!-- Expiry note with left border accent -->
        <div style="
          border-left: 2px solid #C9A84C;
          padding: 12px 18px;
          background: #FAF7F2;
          border-radius: 0 2px 2px 0;
          margin-bottom: 40px;
        ">
          <p style="
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            color: #8A7F72;
            margin: 0;
            letter-spacing: 0.3px;
          ">
            This link expires in <strong style="color: #5C5347;">24 hours</strong>.
            If it lapses, you may request a new one from the login page.
          </p>
        </div>

        <!-- Ornamental divider -->
        <div style="
          text-align: center;
          margin-bottom: 32px;
          color: #C9A84C;
          font-size: 16px;
          letter-spacing: 12px;
          opacity: 0.5;
        ">&#10022; &#10022; &#10022;</div>

        <!-- Security note -->
        <p style="
          font-size: 13px;
          color: #AAA09A;
          line-height: 1.75;
          margin: 0;
          font-style: italic;
        ">
          If you did not create a DoNxt account, please disregard this message.
          No further action is required on your part.
        </p>

      </div>

      <!-- Footer -->
      <div style="
        background: #F5F2ED;
        border-top: 1px solid #EDE8E0;
        padding: 24px 52px;
      ">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="
                font-family: 'Courier New', Courier, monospace;
                font-size: 10px;
                letter-spacing: 1.5px;
                color: #C0B8B0;
                text-transform: uppercase;
              ">&#169; ${new Date().getFullYear()} DoNxt</span>
            </td>
            <td align="right">
              <span style="
                font-family: 'Palatino Linotype', Palatino, Georgia, serif;
                font-size: 11px;
                color: #C9A84C;
                font-style: italic;
                opacity: 0.8;
              ">Do more. Do better.</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Gold bottom rule -->
      <div style="
        height: 3px;
        background: linear-gradient(90deg, #C9A84C 0%, #E8C97A 40%, #C9A84C 100%);
      "></div>

    </div>
  </div>
`;