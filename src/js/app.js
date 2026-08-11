"use strict";

import { initParticles } from './particles.js';
import { initParallax } from './parallax.js';
import { initNav } from './nav.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Piscinas Rodríguez — La piscina de tus sueños 🏊');

    try {
        initParticles();
    } catch (e) {
        console.error('Error initializing particles:', e);
    }

    try {
        initParallax();
    } catch (e) {
        console.error('Error initializing parallax:', e);
    }

    try {
        initNav();
    } catch (e) {
        console.error('Error initializing nav:', e);
    }

    try {
        const i18nModule = await import('./i18n.js');
        if (i18nModule && i18nModule.initI18n) {
            i18nModule.initI18n();
        }
    } catch (e) {
        // Module might not exist yet, ignoring
    }

    try {
        const contactModule = await import('./contact.js');
        if (contactModule && contactModule.initContact) {
            contactModule.initContact();
        }
    } catch (e) {
        // Module might not exist yet, ignoring
    }
});
