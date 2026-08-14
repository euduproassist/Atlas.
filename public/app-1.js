document.addEventListener('DOMContentLoaded', () => {
    // Page Elements Mapping
    const pages = {
        'home': document.getElementById('page-home'),
        'status': document.getElementById('page-status'),
        'apply-options': document.getElementById('page-apply-options'),
        'create-profile': document.getElementById('page-create-profile'),
        'login': document.getElementById('page-login')
    };

    const pageTitles = {
        'home': 'Atlas University - Portal',
        'status': 'Check Application Status',
        'apply-options': 'Application Options',
        'create-profile': 'Create Your Profile',
        'login': 'Applicant Login'
    };

    let isRecaptchaVerified = true;

    // Router function handling browser history and UI switching
    function navigateTo(pageTarget, pushState = true) {
        Object.values(pages).forEach(page => page && page.classList.add('hidden'));

        if (pages[pageTarget]) {
            pages[pageTarget].classList.remove('hidden');
            if (pushState) {
                history.pushState({ page: pageTarget }, pageTitles[pageTarget], `#${pageTarget}`);
            }
        } else {
            pages['home'].classList.remove('hidden');
            if (pushState) {
                history.pushState({ page: 'home' }, pageTitles['home'], '#home');
            }
        }
        window.scrollTo(0, 0);
    }

    // Native Hardware & Browser Back/Forward Button Listener
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            navigateTo(e.state.page, false);
        } else {
            const hash = window.location.hash.replace('#', '');
            navigateTo(hash || 'home', false);
        }
    });

    // Navigation Event Bindings
    const navHomeLogos = ['brand-logo-home', 'brand-logo-status', 'brand-logo-options', 'brand-logo-profile', 'brand-logo-login'];
    navHomeLogos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => navigateTo('home'));
    });

    document.getElementById('btn-check-status')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('status');
    });

    document.getElementById('btn-apply-now')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('apply-options');
    });

    document.getElementById('btn-create-profile')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('create-profile');
    });

    document.getElementById('btn-login-continue')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('login');
    });

    document.getElementById('link-start-new')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('create-profile');
    });

    // Initial Route Resolution on Load
    const initialHash = window.location.hash.replace('#', '');
    if (pages[initialHash]) {
        history.replaceState({ page: initialHash }, pageTitles[initialHash], `#${initialHash}`);
        navigateTo(initialHash, false);
    } else {
        history.replaceState({ page: 'home' }, pageTitles['home'], '#home');
        navigateTo('home', false);
    }

    // Password Toggle Helper
    function setupPasswordToggle(toggleId, inputId) {
        const toggleEl = document.getElementById(toggleId);
        const inputEl = document.getElementById(inputId);
        if (toggleEl && inputEl) {
            toggleEl.addEventListener('click', () => {
                const type = inputEl.getAttribute('type') === 'password' ? 'text' : 'password';
                inputEl.setAttribute('type', type);
                toggleEl.classList.toggle('fa-eye');
                toggleEl.classList.toggle('fa-eye-slash');
            });
        }
    }

    setupPasswordToggle('toggle-status-password', 'status-pin');
    setupPasswordToggle('toggle-login-password', 'login-pin');

    // Field Mask Toggle Helper for Profile Form Buttons
    function setupFieldMaskToggle(btnId, fieldId) {
        const btnEl = document.getElementById(btnId);
        const input = document.getElementById(fieldId);
        if (btnEl && input) {
            btnEl.addEventListener('click', () => {
                const icon = btnEl.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    if (icon) icon.className = 'far fa-eye-slash';
                } else {
                    input.type = 'password';
                    if (icon) icon.className = 'far fa-eye';
                }
            });
        }
    }

    setupFieldMaskToggle('toggle-choose-pin', 'choose-pin');
    setupFieldMaskToggle('toggle-confirm-pin', 'confirm-pin');

    // reCAPTCHA Box Toggle
    const recaptchaBox = document.getElementById('recaptchaBox');
    if (recaptchaBox) {
        recaptchaBox.classList.add('checked');
        recaptchaBox.addEventListener('click', () => {
            isRecaptchaVerified = !isRecaptchaVerified;
            if (isRecaptchaVerified) {
                recaptchaBox.classList.add('checked');
            } else {
                recaptchaBox.classList.remove('checked');
            }
        });
    }

    // Toggle label based on Passport / SA ID radio choice
    const idTypeRadios = document.querySelectorAll('input[name="id-type"]');
    const idLabel = document.getElementById('id-label');
    idTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (idLabel) {
                if (e.target.value === 'passport') {
                    idLabel.textContent = 'Passport number';
                } else {
                    idLabel.textContent = 'South African ID number';
                }
            }
        });
    });

    // Auto Parse South African Identity Number
    const identityInput = document.getElementById('identity-number');
    if (identityInput) {
        identityInput.addEventListener('input', (e) => {
            const isSaId = document.querySelector('input[name="id-type"]:checked')?.value === 'sa-id';
            const cleanVal = e.target.value.trim();
            
            if (isSaId && cleanVal.length === 13 && /^\d+$/.test(cleanVal)) {
                const yearPrefix = parseInt(cleanVal.substring(0, 2), 10) > 26 ? '19' : '20';
                const year = yearPrefix + cleanVal.substring(0, 2);
                const month = cleanVal.substring(2, 4);
                const day = cleanVal.substring(4, 6);
                
                const dobInput = document.getElementById('dob');
                if (dobInput) {
                    dobInput.type = 'date';
                    dobInput.value = `${year}-${month}-${day}`;
                }

                const genderDigits = parseInt(cleanVal.substring(6, 10), 10);
                const genderSelect = document.getElementById('gender');
                if (genderSelect) {
                    genderSelect.value = genderDigits < 5000 ? 'Female' : 'Male';
                }
            }
        });
    }

    // Profile Form Submission Logic
    const profileForm = document.getElementById('applicantProfileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const confirmEmail = document.getElementById('confirm-email').value;
            if (email !== confirmEmail) {
                alert('Email addresses do not match. Please ensure both Email Address and Re-enter Email Address match.');
                return;
            }

            const pin = document.getElementById('choose-pin').value;
            const confirmPin = document.getElementById('confirm-pin').value;
            if (pin !== confirmPin) {
                alert('PINs do not match. Please ensure both Security PIN and Confirm Security PIN match.');
                return;
            }

            if (!isRecaptchaVerified) {
                alert('Please complete the reCAPTCHA verification before proceeding.');
                return;
            }

            const firstName = document.getElementById('first-names').value;
            alert(`Profile for ${firstName} created successfully! Proceeding to the next step of your application.`);
        });
    }

    // Cancel Button Handler
    document.getElementById('btn-cancel-profile')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            profileForm.reset();
            navigateTo('apply-options');
        }
    });

    // Form Submissions Mocking
    document.getElementById('statusForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Checking status...');
    });

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Logging in...');
    });
});
