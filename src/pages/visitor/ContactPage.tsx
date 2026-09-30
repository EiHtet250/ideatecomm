import type { FormEvent } from 'react';
import { ContactMint } from '../../components/help/ContactMint';
import { getHelpStrings } from '../../components/help/helpStrings';
import { MINT_CONTACT } from '../../components/help/mintContact';
import './contact.css';

export function ContactPage() {
  const strings = getHelpStrings();

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(String(data.get('subject')));
    const body = encodeURIComponent(`${data.get('message')}\n\nFrom: ${data.get('name')}\nEmail: ${data.get('email')}`);
    window.location.href = `${MINT_CONTACT.emailHref}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="contact-page">
      <header className="contact-hero">
        <p className="contact-eyebrow">MINT MUSEUM OF TOYS</p>
        <h1>Contact MINT</h1>
        <p>Every great adventure starts with a hello.</p>
      </header>

      <div className="contact-panels">
        <section className="contact-message" aria-labelledby="message-heading">
          <span className="contact-eyebrow">LET&#39;S TALK</span>
          <h2 id="message-heading">Drop us a message</h2>
          <p>Have a question about your visit? We&#39;d love to hear from you.</p>
          <form className="contact-form" onSubmit={prepareEmail}>
            <label htmlFor="contact-name">Your name
              <input id="contact-name" name="name" autoComplete="name" placeholder="How should we address you?" required maxLength={120} />
            </label>
            <label htmlFor="contact-email">Email address
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} />
            </label>
            <label htmlFor="contact-subject">Subject
              <input id="contact-subject" name="subject" placeholder="What would you like to know?" required maxLength={180} />
            </label>
            <label htmlFor="contact-message">Your message
              <textarea id="contact-message" name="message" placeholder="Tell us how we can help..." rows={5} required maxLength={2000} />
            </label>
            <button type="submit" aria-describedby="contact-email-note">Open email draft <span aria-hidden="true">&#8599;</span></button>
            <p id="contact-email-note" className="contact-form-note">Opens your email app with your message ready to send.</p>
          </form>
        </section>

        <section className="contact-info" aria-labelledby="contact-info-heading">
          <p className="contact-info-badge">COME SAY HELLO</p>
          <div className="contact-pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
          </div>
          <h2 id="contact-info-heading">A little wonder,<br />right on Seah Street.</h2>
          <p className="contact-info-intro">Find us in the heart of Singapore. Plan your visit or get in touch below.</p>
          <ContactMint strings={strings.contact} />
          <a className="contact-directions" href="https://www.google.com/maps/search/?api=1&query=26+Seah+Street+Singapore+188382" target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">&#8599;</span><span className="help-visually-hidden"> (opens in a new tab)</span></a>
        </section>
      </div>
      <footer className="contact-footer"><span aria-hidden="true">&#10022;</span> A world of toys. A lifetime of memories.</footer>
    </div>
  );
}
