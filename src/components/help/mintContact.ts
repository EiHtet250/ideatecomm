// Source: emint.com/contact-us. Team to reconfirm with MINT before final demo.
// Change contact details ONLY here. The Contact page, Help requests, and chatbot fallback read from this object.
export const MINT_CONTACT = {
  name: 'MINT Museum of Toys',
  address: '26 Seah Street, Singapore 188382',
  phoneDisplay: '+65 8339 8966',
  phoneHref: 'tel:+6583398966',
  email: 'info@emint.com',
  emailHref: 'mailto:info@emint.com',
  openingHours: 'Tuesday to Sunday, 9:30 am to 6:30 pm',
  lastAdmission: 'Last admission 5:30 pm',
} as const;

/** Singapore emergency numbers. */
export const EMERGENCY_NUMBERS = {
  ambulanceFire: { display: '995', href: 'tel:995' },
  police: { display: '999', href: 'tel:999' },
} as const;
