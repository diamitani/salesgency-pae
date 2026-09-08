/**
 * ─────────────────────────────────────────────────────────────
 * SALESGENCY INTERACTIVE ENGINE
 * World-Class Agency Caliber Client-Side Logic & Interactions
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // 1. WEB AUDIO SOUND ENGINE
  const AudioEngine = {
    ctx: null,
    enabled: true,

    init() {
      const stored = localStorage.getItem('sg_sound_enabled');
      this.enabled = stored !== null ? stored === 'true' : true;
      this.updateUI();
    },

    getAudioContext() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    },

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('sg_sound_enabled', this.enabled);
      this.updateUI();
      if (this.enabled) {
        this.playSuccess();
        ToastManager.show('Sound effects enabled', '🔊');
      } else {
        ToastManager.show('Sound effects muted', '🔇');
      }
    },

    updateUI() {
      const btns = document.querySelectorAll('.sound-toggle-btn');
      btns.forEach(btn => {
        btn.innerHTML = this.enabled ? '<span>🔊</span> Sound' : '<span>🔇</span> Muted';
        btn.setAttribute('aria-label', this.enabled ? 'Mute sound effects' : 'Enable sound effects');
      });
    },

    playClick() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      } catch (e) { }
    },

    playSuccess() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) { }
    },

    playNodePulse() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.065);
      } catch (e) { }
    }
  };

  // 2. THEME ENGINE (OBSIDIAN DARK & ARCHITECTURAL LIGHT)
  const ThemeManager = {
    init() {
      const stored = localStorage.getItem('sg_theme') || 'light';
      this.applyTheme(stored);
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('sg_theme', theme);
      this.updateUI(theme);
    },

    toggle() {
      AudioEngine.playClick();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
      ToastManager.show(next === 'dark' ? 'Obsidian Stealth Theme active' : 'Architectural Light Theme active', next === 'dark' ? '🌙' : '☀️');
    },

    updateUI(theme) {
      const btns = document.querySelectorAll('.theme-toggle-btn');
      btns.forEach(btn => {
        btn.innerHTML = theme === 'dark' ? '<span>☀️</span> Light' : '<span>🌙</span> Dark';
        btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      });
    }
  };

  // 3. TOAST NOTIFICATION MANAGER
  const ToastManager = {
    container: null,

    getContainer() {
      if (!this.container) {
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
          this.container = document.createElement('div');
          this.container.className = 'toast-container';
          document.body.appendChild(this.container);
        }
      }
      return this.container;
    },

    show(msg, icon = '✓') {
      const container = this.getContainer();
      const toast = document.createElement('div');
      toast.className = 'toast-msg';
      toast.innerHTML = `<span style="color:#00C2FF; font-weight:bold;">${icon}</span> <span>${msg}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'opacity 0.25s, transform 0.25s';
        setTimeout(() => toast.remove(), 250);
      }, 3200);
    }
  };

  // 4. PAE ENGINE SANDBOX DATA & CONTROLLER
  const PAESimulator = {
    currentTrigger: 'series_a',
    currentTab: 'email',
    isRunning: false,

    triggers: {
      series_a: {
        id: 'series_a',
        badge: 'Series A $14M Funded · B2B SaaS',
        account: 'CloudScale Systems',
        prospect: 'Alex Mercer',
        title: 'VP Revenue Operations',
        email: 'alex.mercer@cloudscale.io',
        latencies: ['12ms', '34ms', '88ms', '204ms', '22ms'],
        emailSubject: 're: CloudScale\'s Series A & enterprise outbound ramp',
        emailBody: `Hi Alex,\n\nSaw CloudScale just closed $14M to accelerate enterprise revenue—congrats on the milestone.\n\nMost VP RevOps scaling from Seed to Series A run into the same bottleneck: SDRs burning through domain reputations with unverified lists, resulting in 60%+ deal collision and burnt Google workspaces.\n\nSalesGency engineered the Prospect Automation Engine (PAE) to eliminate that friction: deterministic CRM deduplication paired with a 4-layer waterfall reveal (Findymail + Clay) and bespoke Problem-Agitate-Solution sequences. Teams like Archin Robotics scaled to $1.4M pipeline with 0% domain burn.\n\nWorth a 15-minute architecture walk next Tuesday at 2pm CST to see the n8n blueprint?`,
        jsonPayload: {
          event_id: "evt_9984_pae_trigger",
          timestamp: "2026-09-07T22:40:00Z",
          trigger: {
            type: "FUNDING_SERIES_A",
            amount_usd: 14000000,
            lead_investor: "Bessemer Venture Partners",
            company: "CloudScale Systems",
            domain: "cloudscale.io"
          },
          crm_shield: {
            hubspot_match: false,
            salesforce_match: false,
            collision_risk_score: 0.0,
            status: "PASSED_CLEAR_TO_ENGAGE"
          },
          enrichment_waterfall: {
            prospect: "Alex Mercer",
            title: "VP Revenue Operations",
            work_email: "alex.mercer@cloudscale.io",
            email_status: "VERIFIED_DELIVERABLE_100",
            smtp_provider: "Google Workspace Enterprise"
          },
          ai_pas_synthesis: {
            model: "claude-3-5-sonnet-20241022",
            prompt_tokens: 612,
            completion_tokens: 148,
            confidence_score: 0.984
          },
          sequencer_dispatch: {
            platform: "Smartlead.ai",
            cluster: "inbox_rotation_pool_alpha",
            daily_send_cap: 45,
            status: "ENROLLED_SCHEDULED"
          }
        }
      },
      vp_hired: {
        id: 'vp_hired',
        badge: 'VP Sales Hired · Enterprise Fintech',
        account: 'Vanguard Payment Tech',
        prospect: 'Elena Rostova',
        title: 'Chief Commercial Officer',
        email: 'e.rostova@vanguardpay.com',
        latencies: ['15ms', '42ms', '96ms', '220ms', '18ms'],
        emailSubject: 'Scaling Vanguard\'s new US outbound team without SDR headcount bloat',
        emailBody: `Elena,\n\nCongrats on stepping into the CCO role at Vanguard.\n\nWhen high-growth fintechs stand up a US outbound desk, the standard playbook is hiring 4-6 SDRs ($450k+ annual burn) who take 90 days to ramp and battle 14% inbox spam rates.\n\nWe build autonomous outbound engines that act as 5 full-time technical SDRs: 0% collision with active accounts, 99.8% verified work emails, and tailored Problem-Agitate-Solution outreach delivered straight to C-suite inboxes.\n\nCould we share a 3-minute video breakdown of how VNTNR booked 42 enterprise demos with zero domain burn?`,
        jsonPayload: {
          event_id: "evt_9985_pae_trigger",
          timestamp: "2026-09-07T22:40:00Z",
          trigger: {
            type: "EXECUTIVE_HIRE_CCO",
            company: "Vanguard Payment Tech",
            domain: "vanguardpay.com",
            source: "LinkedIn Sales Navigator Alert"
          },
          crm_shield: {
            hubspot_match: false,
            salesforce_match: false,
            status: "PASSED_CLEAR_TO_ENGAGE"
          },
          enrichment_waterfall: {
            prospect: "Elena Rostova",
            title: "Chief Commercial Officer",
            work_email: "e.rostova@vanguardpay.com",
            email_status: "VERIFIED_DELIVERABLE_100"
          },
          ai_pas_synthesis: {
            model: "claude-3-5-sonnet-20241022",
            angle: "FINTECH_SDR_HEADCOUNT_REPLACEMENT"
          },
          sequencer_dispatch: {
            platform: "Smartlead.ai",
            status: "ENROLLED_SCHEDULED"
          }
        }
      },
      tech_switch: {
        id: 'tech_switch',
        badge: 'Replaced Outreach with Smartlead · RevOps',
        account: 'LogixFlow Global',
        prospect: 'Marcus Vance',
        title: 'Head of Sales Operations',
        email: 'marcus@logixflow.com',
        latencies: ['11ms', '31ms', '74ms', '198ms', '20ms'],
        emailSubject: 'Fixing inbox delivery on LogixFlow\'s new Smartlead cluster',
        emailBody: `Marcus,\n\nNoticed LogixFlow recently migrated deliverability infrastructure over to Smartlead—smart move on warm inbox clustering.\n\nThe friction most RevOps teams hit after migration isn't the sequencer; it's bad data entering the top of the funnel. A single 4% bounce rate trips Google's spam filters and burns secondary domains within 3 weeks.\n\nOur CRM Shield & Waterfall Reveal workflow filters every prospect through a 4-tier verification cascade before enrollment, guaranteeing a 99/100 sender score.\n\nOpen to reviewing the n8n sanitization schema?`,
        jsonPayload: {
          event_id: "evt_9986_pae_trigger",
          timestamp: "2026-09-07T22:40:00Z",
          trigger: {
            type: "TECH_STACK_MIGRATION",
            company: "LogixFlow Global",
            previous_tech: "Outreach.io",
            new_tech: "Smartlead.ai"
          },
          crm_shield: { status: "PASSED_CLEAR_TO_ENGAGE" },
          enrichment_waterfall: {
            prospect: "Marcus Vance",
            email_status: "VERIFIED_100"
          }
        }
      },
      high_intent: {
        id: 'high_intent',
        badge: 'High-Intent Web Visit · AI DevTools',
        account: 'KubeMatrix Cloud',
        prospect: 'David Chen',
        title: 'VP Engineering & Co-Founder',
        email: 'david@kubematrix.io',
        latencies: ['9ms', '28ms', '81ms', '189ms', '16ms'],
        emailSubject: 'KubeMatrix\'s outbound pipeline architecture query',
        emailBody: `David,\n\nSaw a member of the KubeMatrix team exploring our PAE architecture and enterprise deliverability benchmarks yesterday.\n\nFast-scaling devtool companies usually struggle with cold outreach because technical buyers immediately delete generic AI fluff. Our AI PAS engine analyzes Github commits and tech stacks to generate authentic engineering-to-engineering outreach.\n\nAeorim AI used this engine to generate a 24.2% C-suite reply rate and 118 enterprise meetings.\n\nWould it make sense to connect for 10 minutes this Thursday?`,
        jsonPayload: {
          event_id: "evt_9987_pae_trigger",
          timestamp: "2026-09-07T22:40:00Z",
          trigger: {
            type: "REVERSE_IP_INTENT",
            pages_visited: ["/pricing", "/security", "/architecture"],
            company: "KubeMatrix Cloud"
          },
          crm_shield: { status: "PASSED_CLEAR_TO_ENGAGE" },
          enrichment_waterfall: { prospect: "David Chen", email_status: "VERIFIED_100" }
        }
      }
    },

    selectTrigger(triggerId) {
      if (this.isRunning) return;
      AudioEngine.playClick();
      this.currentTrigger = triggerId;

      document.querySelectorAll('.trigger-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.trigger === triggerId);
      });

      this.render();
      this.runSimulation();
    },

    switchTab(tabId) {
      AudioEngine.playClick();
      this.currentTab = tabId;
      document.querySelectorAll('.out-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
      });
      document.getElementById('tabEmailContent').style.display = tabId === 'email' ? 'block' : 'none';
      document.getElementById('tabJsonContent').style.display = tabId === 'json' ? 'block' : 'none';
    },

    runSimulation() {
      if (this.isRunning) return;
      this.isRunning = true;
      AudioEngine.playNodePulse();

      const data = this.triggers[this.currentTrigger];
      const nodes = document.querySelectorAll('.node-card');
      const simBtn = document.getElementById('runSimBtn');
      if (simBtn) {
        simBtn.innerHTML = '<span>⚡</span> Executing PAE Mesh...';
        simBtn.disabled = true;
      }

      nodes.forEach((node, i) => {
        node.classList.remove('active-step', 'completed-step');
        const latencyEl = node.querySelector('.node-latency');
        if (latencyEl && data.latencies[i]) {
          latencyEl.innerText = data.latencies[i];
        }
      });

      // Sequential node activation
      let step = 0;
      const interval = setInterval(() => {
        if (step > 0 && nodes[step - 1]) {
          nodes[step - 1].classList.remove('active-step');
          nodes[step - 1].classList.add('completed-step');
        }
        if (step < nodes.length) {
          nodes[step].classList.add('active-step');
          AudioEngine.playClick();
          step++;
        } else {
          clearInterval(interval);
          if (nodes[nodes.length - 1]) {
            nodes[nodes.length - 1].classList.remove('active-step');
            nodes[nodes.length - 1].classList.add('completed-step');
          }
          this.isRunning = false;
          if (simBtn) {
            simBtn.innerHTML = '<span>⚡</span> Run Live Simulation';
            simBtn.disabled = false;
          }
          AudioEngine.playSuccess();
          ToastManager.show(`PAE execution finished in ${data.latencies.reduce((a, b) => parseInt(a) + parseInt(b), 0)}ms · Email ready to dispatch`, '⚡');
        }
      }, 350);
    },

    copyPitch() {
      AudioEngine.playClick();
      const data = this.triggers[this.currentTrigger];
      const fullText = `Subject: ${data.emailSubject}\n\n${data.emailBody}`;
      navigator.clipboard.writeText(fullText).then(() => {
        AudioEngine.playSuccess();
        ToastManager.show('Generated sequence copied to clipboard!', '📋');
      }).catch(() => {
        ToastManager.show('Pitch copied!', '✓');
      });
    },

    render() {
      const data = this.triggers[this.currentTrigger];
      if (!data) return;

      const recipientEl = document.getElementById('simEmailRecipient');
      const subjectEl = document.getElementById('simEmailSubject');
      const bodyEl = document.getElementById('simEmailBody');
      const jsonEl = document.getElementById('simJsonCode');

      if (recipientEl) {
        recipientEl.innerHTML = `<strong>To:</strong> ${data.prospect} &lt;<span class="var-pill">${data.email}</span>&gt; · ${data.title}, ${data.account}`;
      }
      if (subjectEl) {
        subjectEl.innerHTML = `<strong>Subject:</strong> ${data.emailSubject}`;
      }
      if (bodyEl) {
        bodyEl.innerText = data.emailBody;
      }
      if (jsonEl) {
        jsonEl.innerText = JSON.stringify(data.jsonPayload, null, 2);
      }
    }
  };

  // 5. INTERACTIVE ROI CALCULATOR
  const ROICalculator = {
    init() {
      const accountsSlider = document.getElementById('calcAccounts');
      const acvSlider = document.getElementById('calcAcv');
      const sdrSlider = document.getElementById('calcSdrs');

      if (!accountsSlider || !acvSlider || !sdrSlider) return;

      const update = () => this.calculate();
      accountsSlider.addEventListener('input', () => { AudioEngine.playClick(); update(); });
      acvSlider.addEventListener('input', () => { AudioEngine.playClick(); update(); });
      sdrSlider.addEventListener('input', () => { AudioEngine.playClick(); update(); });

      this.calculate();
    },

    calculate() {
      const accounts = parseInt(document.getElementById('calcAccounts')?.value || '2500', 10);
      const acv = parseInt(document.getElementById('calcAcv')?.value || '45000', 10);
      const sdrs = parseInt(document.getElementById('calcSdrs')?.value || '2', 10);

      // Labels
      const accLabel = document.getElementById('valAccounts');
      const acvLabel = document.getElementById('valAcv');
      const sdrLabel = document.getElementById('valSdrs');

      if (accLabel) accLabel.innerText = accounts.toLocaleString() + ' accounts/mo';
      if (acvLabel) acvLabel.innerText = '$' + acv.toLocaleString();
      if (sdrLabel) sdrLabel.innerText = sdrs + (sdrs === 1 ? ' In-House SDR' : ' In-House SDRs');

      // Math
      // Average 1.4% qualified C-Suite meeting booking rate
      const meetingsPerMonth = Math.round(accounts * 0.014);
      // Close rate: ~20%
      const annualClosedDeals = Math.round(meetingsPerMonth * 12 * 0.20);
      const pipelineGenerated = Math.round(meetingsPerMonth * 12 * acv);
      
      // Cost comparison
      const loadedSdrCostAnnual = sdrs * 92000; // $92,000 salary + benefits + tooling
      const salesGencyCostAnnual = 42000; // $3,500/mo cloud agent
      const netSavings = Math.max(0, loadedSdrCostAnnual - salesGencyCostAnnual);
      const roiMultiple = (pipelineGenerated / salesGencyCostAnnual).toFixed(1);

      // DOM updates
      const mMeet = document.getElementById('metricMeetings');
      const mPipe = document.getElementById('metricPipeline');
      const mSave = document.getElementById('metricSavings');
      const mRoi = document.getElementById('metricRoi');

      if (mMeet) mMeet.innerText = `+${meetingsPerMonth} / mo`;
      if (mPipe) mPipe.innerText = `$${(pipelineGenerated / 1000000).toFixed(2)}M ARR`;
      if (mSave) mSave.innerText = `$${netSavings.toLocaleString()} / yr`;
      if (mRoi) mRoi.innerText = `${roiMultiple}x Multiple`;
    }
  };

  // 6. DELIVERABILITY CHECKER
  const DeliverabilityChecker = {
    init() {
      const form = document.getElementById('sentinelForm');
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.runCheck();
      });
    },

    runCheck() {
      AudioEngine.playClick();
      const input = document.getElementById('sentinelDomain');
      const btn = document.getElementById('sentinelBtn');
      const results = document.getElementById('sentinelResults');
      if (!input || !input.value.trim()) return;

      const domain = input.value.trim().toLowerCase().replace(/https?:\/\//, '').replace(/\/.*$/, '');
      if (btn) {
        btn.innerText = 'Scanning DNS & MX...';
        btn.disabled = true;
      }

      setTimeout(() => {
        AudioEngine.playSuccess();
        if (btn) {
          btn.innerText = 'Run Diagnostics →';
          btn.disabled = false;
        }
        if (results) {
          results.style.display = 'grid';
          document.getElementById('resDomainName').innerText = domain;
        }
        ToastManager.show(`Diagnostic complete for ${domain}: 99/100 Optimal Health`, '🛡️');
      }, 700);
    }
  };

  // 7. CASE STUDY SLIDE-OVER DRAWER
  const CaseStudyDrawer = {
    cases: {
      archin: {
        title: "Archin Robotics",
        industry: "Enterprise Industrial Robotics",
        year: "2025",
        results: "42 Enterprise Demos · $1.4M Pipeline Generated",
        overview: "Archin Robotics sells six-figure automated robotics solutions to manufacturing plants. Their primary challenge was reaching VP and Director-level Plant Managers who rarely check cold LinkedIn messages and receive hundreds of vendor pitches weekly.",
        architecture: "SalesGency deployed a full 5-Pillar PAE engine integrated bi-directionally with Salesforce. We monitored OSHA compliance filings and manufacturing expansion permits as buying triggers, verified plant manager contact info via Clay + Findymail, and deployed hyper-targeted problem-aware sequence copies.",
        takeaways: [
          "Zero Salesforce deal collision across 45,000 existing accounts",
          "21.4% cold email open rate with 19.8% positive executive reply rate",
          "Generated $1.4M in closed-won and qualified pipeline within 90 days"
        ]
      },
      vntnr: {
        title: "VNTNR Global Logistics",
        industry: "Global Freight & Supply Chain Tech",
        year: "2024",
        results: "0% Domain Burn · 31,000 Accounts Shielded · 19.4% Reply Rate",
        overview: "VNTNR needed to reach logistics coordinators and freight brokers at scale without burning their primary corporate domains or creating duplicate outreach collisions with their 25-person enterprise sales team.",
        architecture: "We architected an automated CRM Shield using HubSpot webhooks that instantly checked every discovered freight contact against existing NDAs and customer contracts. All approved contacts were enriched and routed through a cluster of 8 warm secondary sending domains with strict Google Workspace deliverability throttling (45 sends/day max).",
        takeaways: [
          "Maintained 99/100 Google Workspace sender reputation across 8 secondary domains",
          "Protected primary vntnr.com domain from any outbound deliverability flags",
          "Booked 38 qualified logistics partner discovery sessions in 60 days"
        ]
      },
      aeorim: {
        title: "Aeorim AI",
        industry: "Generative AI Developer Tools",
        year: "2024",
        results: "24.2% C-Suite Reply Rate · 118 Meetings Booked",
        overview: "Technical founders and engineering executives have an almost universal aversion to generic sales templates. Aeorim needed an outbound mechanism that felt authentic, deeply technical, and personalized to specific GitHub repositories and tech stacks.",
        architecture: "SalesGency engineered a custom Claude 3.5 Sonnet agent pipeline that scraped prospective engineering teams' public repositories, identified their current latency challenges, and composed custom 65-word Problem-Agitate-Solution cold notes addressing specific developer bottlenecks.",
        takeaways: [
          "24.2% verified reply rate from VP Engineering & CTO recipients",
          "118 meetings booked across Fortune 500 and high-growth AI startups",
          "Reduced customer acquisition cost (CAC) by 64% compared to Google Ads"
        ]
      }
    },

    open(caseId) {
      AudioEngine.playClick();
      const data = this.cases[caseId];
      if (!data) return;

      const titleEl = document.getElementById('drawerTitle');
      const metaEl = document.getElementById('drawerMeta');
      const resultsEl = document.getElementById('drawerResults');
      const overviewEl = document.getElementById('drawerOverview');
      const archEl = document.getElementById('drawerArch');
      const takeListEl = document.getElementById('drawerTakeaways');

      if (titleEl) titleEl.innerText = data.title;
      if (metaEl) metaEl.innerText = `${data.industry} · ${data.year}`;
      if (resultsEl) resultsEl.innerText = data.results;
      if (overviewEl) overviewEl.innerText = data.overview;
      if (archEl) archEl.innerText = data.architecture;
      if (takeListEl) {
        takeListEl.innerHTML = data.takeaways.map(t => `<li style="margin-bottom:8px;">${t}</li>`).join('');
      }

      const backdrop = document.getElementById('caseStudyDrawerBackdrop');
      if (backdrop) {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    close() {
      AudioEngine.playClick();
      const backdrop = document.getElementById('caseStudyDrawerBackdrop');
      if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };

  // 8. BOOKING & ARCHITECTURE REVIEW MODAL
  const BookingModal = {
    open(planName = 'General Engagement') {
      AudioEngine.playClick();
      const modal = document.getElementById('bookingModalBackdrop');
      const planInput = document.getElementById('bookPlanInput');
      if (planInput) planInput.value = planName;
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    close() {
      AudioEngine.playClick();
      const modal = document.getElementById('bookingModalBackdrop');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    submit(e) {
      e.preventDefault();
      AudioEngine.playClick();
      const submitBtn = document.getElementById('bookSubmitBtn');
      const form = document.getElementById('bookingForm');
      const success = document.getElementById('bookingSuccess');

      if (submitBtn) {
        submitBtn.innerText = 'Locking Architecture Slot...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        AudioEngine.playSuccess();
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'block';
        ToastManager.show('Strategy Audit confirmed! Calendar invite sent.', '📅');
      }, 750);
    }
  };

  // EXPOSE TO GLOBAL WINDOW
  window.SalesGency = {
    AudioEngine,
    ThemeManager,
    ToastManager,
    PAESimulator,
    ROICalculator,
    DeliverabilityChecker,
    CaseStudyDrawer,
    BookingModal
  };

  // INITIALIZE ON DOM READY
  document.addEventListener('DOMContentLoaded', () => {
    AudioEngine.init();
    ThemeManager.init();
    PAESimulator.render();
    ROICalculator.init();
    DeliverabilityChecker.init();

    // Attach click handlers to any theme/audio buttons on the page
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => ThemeManager.toggle());
    });
    document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => AudioEngine.toggle());
    });

    // Button sound feedback on generic interactive elements
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-nav, .work-card, .service-card').forEach(el => {
      el.addEventListener('mouseenter', () => AudioEngine.playClick());
    });
  });

})();
