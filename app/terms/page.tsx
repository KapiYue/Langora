import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Langora",
  description:
    "The terms and conditions that govern your use of Langora.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="June 26, 2026">
      <div className="legal-content">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to
          and use of Langora (&quot;Langora,&quot; &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), available at{" "}
          <a href="https://getlangora.vercel.app">getlangora.vercel.app</a>{" "}
          (the &quot;Service&quot;). By creating an account or using the
          Service, you agree to be bound by these Terms. If you do not
          agree, do not use the Service.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You must be at least 13 years old (or the minimum age of digital
          consent in your country) to create an account. If you are under
          18, you confirm that a parent or legal guardian has reviewed and
          agreed to these Terms on your behalf.
        </p>

        <h2>2. Your Account</h2>
        <ul>
          <li>
            You are responsible for maintaining the confidentiality of
            your login credentials and for all activity that occurs under
            your account.
          </li>
          <li>
            You agree to provide accurate information when registering and
            to keep it up to date.
          </li>
          <li>
            You must notify us immediately at{" "}
            <a href="mailto:ellnazhang520@gmail.com">ellnazhang520@gmail.com</a>{" "}
            if you suspect unauthorized use of your account.
          </li>
        </ul>

        <h2>3. Plans, Payments &amp; Billing</h2>
        <p>Langora offers the following access tiers:</p>
        <ul>
          <li>
            <strong>Free:</strong> limited access to introductory lessons
            at no cost.
          </li>
          <li>
            <strong>Monthly Pro (subscription):</strong> recurring monthly
            billing that grants full access to all lessons and features for
            as long as the subscription remains active.
          </li>
          <li>
            <strong>Lifetime Access:</strong> a one-time payment that
            grants permanent access to all current and future course
            content, as described on the Service at the time of purchase.
          </li>
          <li>
            <strong>Single-lesson purchases:</strong> a one-time payment
            granting permanent access to one specific lesson.
          </li>
        </ul>
        <p>
          All payments are processed securely by our third-party payment
          processor, Creem. By purchasing a plan, you authorize Creem to
          charge the payment method you provide.
        </p>

        <h3>3.1 Subscription Renewal &amp; Cancellation</h3>
        <p>
          Monthly Pro subscriptions renew automatically each billing cycle
          until canceled. You may cancel anytime from your account
          dashboard; cancellation stops future renewals, and you will
          retain access to Pro features until the end of the current
          billing period. We do not provide prorated refunds for partial
          billing periods unless required by law or stated otherwise in
          Section 3.2.
        </p>

        <h3>3.2 Refunds</h3>
        <p>
          We offer a 30-day money-back guarantee on new purchases (Monthly
          Pro, Lifetime Access, and single-lesson purchases). If you are
          not satisfied, contact us within 30 days of your purchase at{" "}
          <a href="mailto:ellnazhang520@gmail.com">ellnazhang520@gmail.com</a> to
          request a refund. Refunds are issued at our discretion outside
          of this window, except where required by applicable consumer
          protection law.
        </p>

        <h3>3.3 Price Changes</h3>
        <p>
          We may change our prices at any time. Price changes will not
          affect an active billing cycle you have already paid for, and we
          will provide reasonable notice before any price increase takes
          effect on your next renewal.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Share your account credentials or resell access to the
            Service;
          </li>
          <li>
            Copy, scrape, redistribute, or create derivative works from
            our lesson content, audio, or course materials without our
            written permission;
          </li>
          <li>
            Use automated tools (bots, scripts) to interact with the
            Service in a way that disrupts its normal operation;
          </li>
          <li>
            Attempt to gain unauthorized access to our systems, other
            users&apos; accounts, or non-public areas of the Service;
          </li>
          <li>
            Use the Service for any unlawful purpose or in violation of
            any applicable law.
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that
          violate this section.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All lesson content, audio recordings, typing exercises, course
          structure, software, and branding on the Service are owned by
          Langora or its licensors and are protected by copyright,
          trademark, and other intellectual property laws. Purchasing
          access to a lesson or plan grants you a limited, non-transferable,
          non-exclusive license to use that content for your personal,
          non-commercial learning purposes — it does not transfer
          ownership of any content to you.
        </p>

        <h2>6. User Content</h2>
        <p>
          If the Service allows you to submit content (such as a profile
          name or community posts), you retain ownership of that content,
          but you grant Langora a worldwide, royalty-free license to host,
          display, and use it as necessary to operate and improve the
          Service. You are solely responsible for content you submit.
        </p>

        <h2>7. Third-Party Services</h2>
        <p>
          The Service relies on third-party providers, including Supabase
          (authentication and data storage), Creem (payments), and Vercel
          (hosting). Your use of the Service is also subject to the
          applicable terms of these providers where relevant. We are not
          responsible for outages or issues caused by these third-party
          providers.
        </p>

        <h2>8. Disclaimers</h2>
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. We do not guarantee that the Service will
          be uninterrupted, error-free, or that it will result in any
          specific learning outcome (such as passing an exam or reaching a
          particular proficiency level). Language learning results vary by
          individual.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Langora and its
          operators will not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of
          data, revenue, or goodwill, arising from your use of or
          inability to use the Service. Our total liability for any claim
          relating to the Service will not exceed the amount you paid us
          in the 12 months preceding the claim.
        </p>

        <h2>10. Termination</h2>
        <p>
          You may stop using the Service and delete your account at any
          time. We may suspend or terminate your access to the Service if
          you violate these Terms, with or without notice, particularly in
          cases of fraud, abuse, or repeated violations of Section 4.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Fujian Province, China,
          without regard to its conflict-of-law principles. Any disputes
          arising from these Terms will be resolved in the competent
          courts of Fujian Province, China, unless otherwise required by
          applicable local consumer protection law in your country of
          residence.
        </p>

        <h2>12. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. If we make material
          changes, we will notify you by posting a notice on the Service
          or emailing the address associated with your account. Continued
          use of the Service after changes take effect constitutes
          acceptance of the revised Terms.
        </p>

        <h2>13. Contact Us</h2>
        <p>If you have questions about these Terms, please contact us at:</p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:ellnazhang520@gmail.com">ellnazhang520@gmail.com</a>
          </li>
          <li>Operator: JanaZhang (an individual)</li>
          <li>Address: Jiaocheng District, Ningde City, Fujian Province, China</li>
        </ul>
      </div>
    </LegalPageLayout>
  );
}
