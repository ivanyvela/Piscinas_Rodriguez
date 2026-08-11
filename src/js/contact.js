/**
 * Contact form and WhatsApp integration module
 */

const WHATSAPP_NUMBER = '34672847363';

/**
 * Initializes the contact form handling.
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Elements
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const messageInput = form.querySelector('[name="message"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Values
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Basic Validation
    if (!name || !email || !message) {
      alert('Por favor, rellena todos los campos obligatorios (Nombre, Email, Mensaje).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, introduce un email válido.');
      return;
    }

    // Construct WhatsApp message
    const waMessage = `Hola, soy ${name}. ${message}. Mi email: ${email}. Mi teléfono: ${phone || 'no proporcionado'}`;
    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Show success state on button temporarily
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '¡Enviado!';
    submitBtn.style.backgroundColor = '#25D366'; // WhatsApp green
    submitBtn.disabled = true;

    // Reset form and button after 3 seconds
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.style.backgroundColor = '';
      submitBtn.disabled = false;
    }, 3000);
  });
}

/**
 * Initializes the WhatsApp floating button tooltip animation.
 */
function initWhatsAppTooltip() {
  const waBtn = document.querySelector('.whatsapp-btn'); // ensure this class exists on the a href="wa.me..."
  if (!waBtn) return;

  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'whatsapp-tooltip';
  
  // The i18n module can translate this if we add a data attribute,
  // but we can also set the text content directly since it's injected.
  tooltip.textContent = 'Escríbenos por WhatsApp';
  tooltip.setAttribute('data-i18n', 'whatsapp.tooltip');

  // Styling the tooltip directly, or ideally in CSS. Assuming basic inline styles for the requirement
  Object.assign(tooltip.style, {
    position: 'absolute',
    right: '110%', // appear to the left of the button
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    opacity: '0',
    transition: 'opacity 0.3s ease-in-out',
    pointerEvents: 'none'
  });

  // Make sure the button is positioned relative so tooltip positions correctly
  if (getComputedStyle(waBtn).position === 'static') {
    waBtn.style.position = 'relative';
  }

  waBtn.appendChild(tooltip);

  // Show tooltip after 5 seconds
  setTimeout(() => {
    tooltip.style.opacity = '1';
    
    // Hide it after 4 seconds of being visible
    setTimeout(() => {
      tooltip.style.opacity = '0';
      // Optionally remove it after fading out
      setTimeout(() => tooltip.remove(), 300);
    }, 4000);
  }, 5000);
}

/**
 * Exported initialization function
 */
export function initContact() {
  initContactForm();
  initWhatsAppTooltip();
}
