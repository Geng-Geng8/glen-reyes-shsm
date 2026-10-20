/* Glen Reyes SHSM: no framework, build step, tracking, or browser storage. */
(() => {
  'use strict';
  const config = window.SHSM_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const form = $('#inquiry-form');
  const sectorSelect = $('#sector');
  const experienceSelect = $('#experience');
  const status = $('#form-status');
  const submit = $('#submit-inquiry');
  const bundleTopics = $$('.topic-choice');
  const checkboxes = $$('input[name="certifications"]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeSector = 'nonprofit';
  let draftText = '';

  document.body.classList.add('js-enabled');
  $('#year').textContent = String(new Date().getFullYear());

  // The menu stays usable without JavaScript; enhancement only collapses it.
  const menuButton = $('.menu-toggle');
  const navigation = $('#main-nav');
  menuButton.hidden = false;
  const closeMenu = (returnFocus = false) => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'Open navigation';
    if (returnFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    menuButton.querySelector('.sr-only').textContent = expanded ? 'Close navigation' : 'Open navigation';
    navigation.classList.toggle('is-open', expanded);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());

  // Reveal each section once. Reading never depends on an animation finishing.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 });
    $$('.reveal').forEach((element) => observer.observe(element));
  }

  const showStatus = (message, state = 'info') => {
    status.textContent = message;
    status.dataset.state = state;
  };
  const syncBundle = () => {
    const selected = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    bundleTopics.forEach((button) => {
      const pressed = selected.includes(button.dataset.topic);
      button.setAttribute('aria-pressed', String(pressed));
      button.querySelector('span').textContent = pressed ? '✓' : '+';
    });
    $('#bundle-status').textContent = selected.length
      ? `${selected.length} topic${selected.length === 1 ? '' : 's'} selected — included in your inquiry below.`
      : 'Choose individual training or a 2–3 certification bundle.';
    $('#bundle-size').value = selected.length <= 3 && selected.length > 0 ? String(selected.length) : '';
    refreshDraft();
  };
  bundleTopics.forEach((button) => button.addEventListener('click', () => {
    const checkbox = checkboxes.find((item) => item.value === button.dataset.topic);
    if (!checkbox.checked && checkboxes.filter((item) => item.checked).length >= 3) {
      $('#bundle-status').textContent = 'You have 3 topics selected. Remove one to try another combination.';
      return;
    }
    checkbox.checked = !checkbox.checked;
    experienceSelect.value = 'certifications';
    if (checkbox.checked) $('.form-options').open = true;
    syncBundle();
  }));
  checkboxes.forEach((checkbox) => checkbox.addEventListener('change', syncBundle));
  $$('[data-experience]').forEach((link) => link.addEventListener('click', () => {
    experienceSelect.value = link.dataset.experience;
    if (link.dataset.certification) {
      checkboxes.find((item) => item.value === link.dataset.certification).checked = true;
      $('.form-options').open = true;
      syncBundle();
    }
    refreshDraft();
  }));
  $$('[data-detail]').forEach((link) => link.addEventListener('click', () => {
    $(`#${link.dataset.detail}-details`).open = true;
    experienceSelect.value = link.dataset.detail === 'ice' ? 'ice' : 'coding';
    refreshDraft();
  }));

  const sectors = {
    nonprofit: {
      kicker: 'GLEN’S STRONGEST SECTOR', symbol: '↗', title: 'Big ideas.\nCommunity impact.',
      description: 'Connect youth leadership and mentorship with the practical work of running community programs, coordinating volunteers, fundraising, and creating positive change.',
      example: 'Design a youth mentorship program: define its purpose, coordinate volunteers, plan a launch event, and explain how you’ll measure community impact.',
      recommendations: ['Project Management: YOU', 'Leadership Skills', 'Event Coordination', 'ICE'],
      photo: { name: 'outdoor-teamwork', height: 675, kind: 'wide', alt: 'Participants follow one another in a line during an outdoor trust activity', caption: 'An outdoor trust walk: moving together as a team.' }
    },
    sports: {
      kicker: 'CONNECTING SPORT WITH REAL OPERATIONS', symbol: '◎', title: 'More than a game.\nMake the event happen.',
      description: 'Draw on practical experience with Breaking Canada to explore sport event coordination, leadership, team operations, risk management, program design, and the participant experience.',
      example: 'Plan a school sport event: assign team roles, map the participant journey, identify safety and scheduling risks, and build a contingency plan.',
      recommendations: ['Event Coordination', 'Project Management: YOU', 'Leadership Skills', 'Customer Service'],
      photo: { name: 'youth-breaking', height: 927, kind: 'sport', alt: 'A young breaker balances close to the floor while peers watch', caption: 'A young breaker demonstrating a floor move as peers watch.' }
    },
    arts: {
      kicker: 'CREATIVE WORK. PRACTICAL SKILLS.', symbol: '✳', title: 'Your creativity.\nOut in the world.',
      description: 'Connect dance education and H4 programming experience with creative entrepreneurship, arts events, community projects, portfolio development, and the practical work behind a creative idea.',
      example: 'Develop a community arts showcase: pitch the concept, plan the production, and document your role in a portfolio case study.',
      recommendations: ['Portfolio Development', 'Event Coordination', 'Leadership Skills', 'ICE'],
      photo: { name: 'cultural-performance', height: 2131, kind: 'portrait', alt: 'A singer performing with a microphone and an expressive raised hand', caption: 'Live music at Filipino Central.' }
    },
    business: {
      kicker: 'FROM AN IDEA TO A CUSTOMER EXPERIENCE', symbol: '↔', title: 'Think like a founder.\nWork like a team.',
      description: 'Bring customer service, project management, entrepreneurship, communication, personality inventory, and leadership into practical business challenges. Explore where AI-assisted tools can help.',
      example: 'Design a student pop-up business: understand a customer need, map the service experience, test your pitch, and create a realistic launch plan.',
      recommendations: ['Customer Service', 'Project Management: YOU', 'Personality Inventory', 'ICE / Vibe Coding'],
      photo: { name: 'event-production', height: 800, kind: 'wide', alt: 'An outdoor event with a performance area, audience seating and production tents', caption: 'The performance area, audience and production setup at an outdoor event.' }
    },
    ict: {
      kicker: 'HUMAN IDEAS. DIGITAL POSSIBILITIES.', symbol: '</>', title: 'See a problem?\nPrototype a solution.',
      description: 'Explore AI-assisted software prototyping, programming concepts, software testing, design thinking, innovation, and project management through a practical digital challenge.',
      example: 'Prototype a volunteer task tracker: describe requirements, build with AI assistance, inspect the code, test key flows, debug issues, and demonstrate your learning.',
      recommendations: ['Vibe Coding', 'Project Management: YOU', 'Portfolio Development', 'ICE (distinct focus)']
    }
  };
  const setSector = (key, updateForm = true) => {
    if (!sectors[key]) return;
    activeSector = key;
    const data = sectors[key];
    $$('[data-sector]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.sector === key)));
    $('#sector-kicker').textContent = data.kicker;
    $('#sector-symbol').textContent = data.symbol;
    $('#sector-title').replaceChildren(...data.title.split('\n').flatMap((line, index) => index ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
    $('#sector-description').textContent = data.description;
    const sectorPhoto = $('#sector-photo');
    sectorPhoto.hidden = !data.photo;
    $('#sector-tool-note').hidden = !!data.photo;
    if (data.photo) {
      const image = sectorPhoto.querySelector('img');
      sectorPhoto.dataset.kind = data.photo.kind;
      image.alt = data.photo.alt;
      image.width = 1200;
      image.height = data.photo.height;
      image.srcset = [480, 800, 1200].map((width) => `./assets/photos/${data.photo.name}-${width}.webp ${width}w`).join(', ');
      image.src = `./assets/photos/${data.photo.name}-800.webp`;
      sectorPhoto.querySelector('figcaption').textContent = data.photo.caption;
    }
    $('#sector-example').textContent = data.example;
    $('#sector-recommendations').replaceChildren(...data.recommendations.map((text) => {
      const tag = document.createElement('span');
      tag.textContent = text;
      return tag;
    }));
    if (updateForm) sectorSelect.value = key;
    refreshDraft();
  };
  $$('[data-sector]').forEach((button) => button.addEventListener('click', () => setSector(button.dataset.sector)));
  $('[data-inquire-sector]').addEventListener('click', () => { sectorSelect.value = activeSector; refreshDraft(); });
  sectorSelect.addEventListener('change', () => setSector(sectorSelect.value, false));

  const journey = {
    idea: { label: '01 / START WITH A WHY', title: '“Let’s bring our\ncommunity together.”', description: 'A student turns an interest in the arts into a meaningful goal: create a community showcase that gives young artists a place to share their work.', art: '<span class="mini-label">THE STARTING POINT</span><div class="idea-spark" aria-hidden="true">✳</div><strong>One idea.<br>Something worth doing.</strong><span class="small-copy">Goal: launch a community arts showcase</span>' },
    plan: { label: '02 / GIVE THE GOAL A GAME PLAN', title: 'Turn “what if”\ninto “here’s how.”', description: 'Define success, compare options, assign team roles, and map milestones. Identify risks and write a contingency plan before the event begins.', art: '<span class="mini-label">PROJECT PLAN / COMMUNITY SHOWCASE</span><div class="journey-checks"><span>✓ Purpose &amp; audience defined</span><span>✓ Roles &amp; milestones mapped</span><span>✓ Budget &amp; risk plan drafted</span></div><strong>A goal.<br>A plan. A next step.</strong>' },
    action: { label: '03 / PUT THE SKILLS TO WORK', title: 'Make progress.\nMake adjustments.', description: 'Build a proposal or prototype, test assumptions, get feedback, and track milestones. When something changes, adapt the plan and explain your decisions.', art: '<span class="mini-label">SAMPLE PROJECT PROGRESS</span><div class="journey-checks"><span>✓ Develop the proposal</span><span>✓ Test the idea with peers</span><span>↗ Refine the delivery plan</span></div><div class="journey-progress"><i></i></div><strong>Action beats<br>a blank page.</strong>' },
    proof: { label: '04 / MAKE THE LEARNING VISIBLE', title: '“Here’s what I did.\nHere’s what I learned.”', description: 'Present the project and document the process in a portfolio case study: the challenge, your role, your decisions, evidence of progress, and an honest reflection.', art: '<span class="mini-label">PORTFOLIO CASE STUDY / 001</span><div class="journey-checks"><span>↗ Project plan &amp; risk assessment</span><span>↗ Proposal or prototype</span><span>↗ Presentation &amp; self-assessment</span></div><strong>Something real.<br>Something to show.</strong>' }
  };
  const setJourney = (key) => {
    const data = journey[key];
    $$('[data-stage]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.stage === key)));
    $('#journey-label').textContent = data.label;
    $('#journey-title').textContent = data.title;
    $('#journey-title').style.whiteSpace = 'pre-line';
    $('#journey-description').textContent = data.description;
    $('#journey-art').className = `journey-art ${key}-art`;
    // The HTML below comes only from the fixed local journey definitions.
    $('#journey-art').innerHTML = data.art;
  };
  // Playback is optional and can be paused; the story never changes while being read.
  let journeyTimer = null;
  const playButton = $('#journey-play');
  const pauseJourney = () => {
    window.clearInterval(journeyTimer);
    journeyTimer = null;
    playButton.setAttribute('aria-pressed', 'false');
    playButton.innerHTML = 'Play the journey <span aria-hidden="true">▷</span>';
  };
  $$('[data-stage]').forEach((button) => button.addEventListener('click', () => { pauseJourney(); setJourney(button.dataset.stage); }));
  playButton.addEventListener('click', () => {
    if (journeyTimer) { pauseJourney(); return; }
    setJourney('idea');
    let index = 0;
    playButton.setAttribute('aria-pressed', 'true');
    playButton.innerHTML = 'Pause the journey <span aria-hidden="true">Ⅱ</span>';
    journeyTimer = window.setInterval(() => {
      setJourney(['plan', 'action', 'proof'][index++]);
      if (index === 3) pauseJourney();
    }, 2600);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseJourney(); });

  const screens = {
    selection: ['01 / CHOOSE YOUR DIRECTION', 'Every big goal\nstarts somewhere.', 'Goal selection'],
    creation: ['02 / MAKE IT MEANINGFUL', 'Your goal.\nYour next move.', 'Goal creation'],
    tracking: ['03 / BUILD MOMENTUM', 'Small actions.\nSteady progress.', 'Daily / weekly action tracking'],
    companions: ['04 / GROW AS YOU GO', 'Progress has\na little personality.', 'Companion gallery'],
    coaching: ['05 / REFLECT & RESET', 'A prompt for\nyour next step.', 'AI coaching prompts']
  };
  const safeUrl = (value, externalOnly = false) => {
    if (!value || typeof value !== 'string') return null;
    try {
      const url = new URL(value, document.baseURI);
      if (url.protocol === 'https:' || (!externalOnly && url.origin === location.origin && ['http:', 'file:'].includes(url.protocol))) return url.href;
    } catch { /* Invalid configuration uses the visible fallback. */ }
    return null;
  };
  const setScreen = (key) => {
    const [label, headline, title] = screens[key];
    $$('[data-screen]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.screen === key)));
    const screen = $('#quest-screen');
    const placeholder = document.createElement('div');
    placeholder.className = 'screen-placeholder';
    const symbol = document.createElement('span'); symbol.className = 'placeholder-orbit'; symbol.setAttribute('aria-hidden', 'true'); symbol.textContent = '✦';
    const eyebrow = document.createElement('span'); eyebrow.className = 'mini-label'; eyebrow.textContent = label;
    const heading = document.createElement('h3'); heading.textContent = headline; heading.style.whiteSpace = 'pre-line';
    const description = document.createElement('p'); description.textContent = `${title} screenshot to be added.`;
    const disclaimer = document.createElement('span'); disclaimer.className = 'placeholder-label'; disclaimer.textContent = 'ASSET PLACEHOLDER · NOT THE APP UI';
    placeholder.append(symbol, eyebrow, heading, description, disclaimer);
    const path = safeUrl(config.goalQuestScreenshots?.[key]);
    if (path) {
      const img = document.createElement('img');
      img.alt = `H4 Goal Quest — ${title}`;
      img.width = 960; img.height = 720;
      img.addEventListener('error', () => {
        screen.replaceChildren(placeholder);
        $('#quest-screen-caption').textContent = `${title} — screenshot unavailable.`;
      }, { once: true });
      img.src = path;
      screen.replaceChildren(img);
      $('#quest-screen-caption').textContent = title;
    } else {
      screen.replaceChildren(placeholder);
      $('#quest-screen-caption').textContent = `${title} — actual app screenshot pending.`;
    }
  };
  $$('[data-screen]').forEach((button) => button.addEventListener('click', () => setScreen(button.dataset.screen)));
  setScreen('selection');
  const questUrl = safeUrl(config.goalQuestUrl, true);
  if (questUrl) {
    $('#quest-cta').href = questUrl;
    $('#quest-cta').target = '_blank';
    $('#quest-cta').rel = 'noopener noreferrer';
    $('#quest-cta').setAttribute('aria-label', 'Explore H4 Goal Quest (opens in a new tab)');
    $('#quest-link-note').textContent = 'Free student resource. Opens in a new tab.';
  }

  const endpoint = safeUrl(config.formEndpoint, true);
  const contact = config.contactEmail || 'glen@h4ml.com';
  if (endpoint) {
    form.action = endpoint;
    form.enctype = 'application/x-www-form-urlencoded';
    submit.firstChild.textContent = 'Request my custom SHSM quote ';
    $('#form-mode').textContent = 'Your inquiry is sent through our form service. Glen will use your school email to respond.';
  }
  const draftFromForm = () => {
    const value = (selector) => $(selector).value.trim();
    const selectedLabel = (select) => select.selectedOptions[0]?.textContent || 'Not specified';
    const topics = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    return [
      'Hi Glen,', '', 'I’d like workshop options and a custom SHSM quote.', '',
      `Teacher: ${value('#teacher-name')}`, `School / board: ${value('#school')}`, `School email: ${value('#email')}`,
      `Sector: ${selectedLabel(sectorSelect)}`, `Experience: ${selectedLabel(experienceSelect)}`,
      `Certifications: ${topics.join(', ') || 'Help me choose'}`,
      `Bundle: ${$('#bundle-size').value ? selectedLabel($('#bundle-size')) : 'Help me choose'}`,
      `Students: ${value('#students') || 'To be confirmed'}`, `Preferred dates: ${value('#dates') || 'Flexible / to be confirmed'}`,
      '', `Questions / requirements: ${value('#questions') || 'Please recommend suitable options.'}`, '', 'Thank you!'
    ].join('\n');
  };
  const prepareDraft = () => {
    draftText = draftFromForm();
    $('#email-draft').value = draftText;
    $('#open-email').href = `mailto:${encodeURIComponent(contact)}?subject=${encodeURIComponent('SHSM workshop options & custom quote')}&body=${encodeURIComponent(draftText)}`;
    $('#email-fallback').hidden = false;
  };
  function refreshDraft() {
    if (!$('#email-fallback').hidden) prepareDraft();
  }
  const validateText = (input) => {
    input.setCustomValidity(input.value.trim() ? '' : 'Please enter this information.');
  };
  ['#teacher-name', '#school'].forEach((selector) => {
    $(selector).addEventListener('input', () => validateText($(selector)));
  });
  form.addEventListener('input', () => {
    if (!$('#email-fallback').hidden) prepareDraft();
    if (status.dataset.state === 'success') showStatus('Details changed. Submit again only if you want to send a new inquiry.');
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    ['#teacher-name', '#school'].forEach((selector) => validateText($(selector)));
    if (!form.reportValidity() || $('#website').value) return;
    if (!endpoint) {
      prepareDraft();
      showStatus('Your email draft is ready below. Nothing has been sent. Open the draft or copy it, then send it to Glen.');
      status.focus();
      return;
    }
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    showStatus('Sending your inquiry…');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      const data = await response.json().catch(() => null);
      // Formspree-style JSON acknowledgement: HTML or an opaque response is not confirmation.
      if (!response.ok || !data || data.ok !== true) throw new Error('Submission not confirmed');
      showStatus('Your inquiry was received by the form service. Glen will reply to your school email with workshop options and pricing.', 'success');
      $('#email-fallback').hidden = true;
    } catch {
      prepareDraft();
      showStatus('We couldn’t confirm delivery. Your details are still here. To avoid an uncertain retry, email the draft below to Glen instead.', 'error');
    } finally {
      window.clearTimeout(timeout);
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
  $('#copy-inquiry').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(draftText);
      showStatus('Inquiry copied. Paste it into an email to Glen and send it. Nothing has been sent from this page.');
    } catch {
      $('#email-draft').focus();
      $('#email-draft').select();
      showStatus('Select and copy the draft below, then paste it into your email app.');
    }
  });
})();
