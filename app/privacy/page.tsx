import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Langora",
  description:
    "Learn how Langora collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 26, 2026">
      <div className="legal-content">
        <p>
          Langora (&quot;Langora,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) operates the website{" "}
          <a href="https://langora.joy-codex.com">https://langora.joy-codex.com</a>{" "}
          and the Langora learning platform (together, the
          &quot;Service&quot;). This Privacy Policy explains what
          information we collect, how we use it, and what rights you have
          regarding your personal data.
        </p>
        <p>
          By creating an account or otherwise using the Service, you agree
          to the collection and use of information in accordance with this
          policy. If you do not agree, please do not use the Service.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Information you provide directly</h3>
        <ul>
          <li>
            <strong>Account information:</strong> email address and password
            (encrypted) when you register, via our authentication provider
            Supabase.
          </li>
          <li>
            <strong>Profile information:</strong> display name and any other
            details you choose to add to your profile or account settings.
          </li>
          <li>
            <strong>Payment information:</strong> when you purchase a
            subscription, lifetime plan, or single lesson, payment is
            processed by our third-party payment processor, Creem. We do
            not collect or store your full card number; Creem provides us
            with limited information such as transaction status, plan
            type, and billing email.
          </li>
          <li>
            <strong>Communications:</strong> any information you provide
            when you contact us for support (e.g. via email at{" "}
            <a href="mailto:support@joy-codex.com">support@joy-codex.com</a>
            ).
          </li>
        </ul>

        <h3>1.2 Information collected automatically</h3>
        <ul>
          <li>
            <strong>Learning activity data:</strong> lesson progress,
            typing accuracy, completed exercises, streaks, and other
            usage statistics needed to power your dashboard and
            certificates.
          </li>
          <li>
            <strong>Session and authentication data:</strong> cookies used
            by Supabase to keep you securely signed in across page loads.
          </li>
          <li>
            <strong>Device and log information:</strong> IP address,
            browser type, device type, and general usage logs, collected
            automatically by our hosting provider (Vercel) for security
            and performance purposes.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Create and maintain your account;</li>
          <li>
            Provide, operate, and personalize the Service, including
            tracking your lesson progress and generating certificates;
          </li>
          <li>
            Process payments, manage subscriptions, and send related
            billing notifications;
          </li>
          <li>
            Respond to your support requests and communicate important
            updates about the Service;
          </li>
          <li>
            Monitor, maintain, and improve the security, stability, and
            performance of the Service;
          </li>
          <li>Comply with our legal obligations.</li>
        </ul>
        <p>
          We do not sell your personal information, and we do not use your
          learning data to train third-party advertising profiles.
        </p>

        <h2>3. How We Share Your Information</h2>
        <p>
          We only share personal information with the following categories
          of third parties, and only as needed to operate the Service:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication and database hosting
            (stores your account credentials and learning data securely).
          </li>
          <li>
            <strong>Creem</strong> — payment processing for subscriptions,
            lifetime plans, and single-lesson purchases.
          </li>
          <li>
            <strong>Vercel</strong> — application hosting and infrastructure
            logging.
          </li>
          <li>
            <strong>Legal compliance</strong> — if required to do so by law,
            or in good faith belief that such action is necessary to
            comply with a legal obligation or protect the rights and
            safety of Langora or its users.
          </li>
        </ul>
        <p>
          We do not share your personal data with third parties for their
          own marketing purposes.
        </p>

        <h2>4. International Data Transfers</h2>
        <p>
          Langora is built for learners around the world. Because our
          infrastructure providers (Supabase, Vercel, Creem) operate data
          centers internationally, your information may be processed in
          countries other than your country of residence, including{" "}
          the United States. We take steps
          to ensure such transfers comply with applicable data protection
          laws.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain your account and learning data for as long as your
          account is active, or as needed to provide the Service. If you
          delete your account, we will delete or anonymize your personal
          information within a reasonable period, except where we are
          required to retain certain records (e.g. transaction records)
          for legal, accounting, or fraud-prevention purposes.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          Depending on where you live, you may have some or all of the
          following rights regarding your personal data:
        </p>
        <ul>
          <li>The right to access the personal data we hold about you;</li>
          <li>The right to correct inaccurate or incomplete data;</li>
          <li>The right to request deletion of your data;</li>
          <li>
            The right to object to or restrict certain processing of your
            data;
          </li>
          <li>The right to data portability;</li>
          <li>
            The right to withdraw consent at any time, where processing is
            based on consent.
          </li>
        </ul>
        <p>
          EU/UK users have these rights under the GDPR; California
          residents have similar rights under the CCPA/CPRA. To exercise
          any of these rights, contact us at{" "}
          <a href="mailto:support@joy-codex.com">support@joy-codex.com</a>.
          We will respond within the timeframe required by applicable law.
        </p>

        <h2>7. Cookies</h2>
        <p>
          We use essential cookies to keep you signed in and to remember
          your theme preference (light/dark mode). We do not currently use
          third-party advertising or tracking cookies. If this changes, we
          will update this policy and, where required, ask for your
          consent.
        </p>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          The Service is not directed to children under 13 (or under 16 in
          the European Economic Area), and we do not knowingly collect
          personal information from children in that age range. If you
          believe a child has provided us with personal information,
          please contact us so we can delete it.
        </p>

        <h2>9. Data Security</h2>
        <p>
          We use industry-standard safeguards — including encrypted
          password storage, HTTPS encryption in transit, and access
          controls — to protect your information. However, no method of
          transmission or storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make
          material changes, we will notify you by posting a notice on the
          Service or by emailing the address associated with your account.
          The &quot;Last updated&quot; date at the top of this page
          indicates when this policy was last revised.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how we
          handle your personal data, please contact us at:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:support@joy-codex.com">support@joy-codex.com</a>
          </li>
          <li>Operator: JanaZhang (an individual)</li>
          <li>Address: Jiaocheng District, Ningde City, Fujian Province, China</li>
        </ul>
      </div>
    </LegalPageLayout>
  );
}
