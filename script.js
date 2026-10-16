/**
 * MUHAMMAD SALMAN — PORTFOLIO RUNTIME ENGINE
 * Features:
 *  - Three.js Interactive Chromatic Neon Arc Ribbon
 *  - Native Web Audio Synthesizer (Zero asset dependencies)
 *  - Interactive Bash Shell Sandbox
 *  - DevOps Project Effort & Cloud Tier Estimator
 *  - Spotlight Command Palette (Cmd + K)
 *  - Rule-Based "Ask Salman's AI Twin" Chat Widget
 *  - Mobile Ergonomics & Konami Code Easter Egg
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- AUDIO SYNTHESIZER ENGINE (Native Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(frequency, type, duration, gainLevel = 0.05) {
      if (this.muted) return;
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio policy prevention fallback
      }
    }

    click() {
      this.playTone(850, 'sine', 0.08, 0.04);
    }

    hover() {
      this.playTone(420, 'triangle', 0.05, 0.015);
    }

    success() {
      this.playTone(523.25, 'sine', 0.1, 0.04);
      setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.04), 80);
    }

    toggle() {
      this.muted = !this.muted;
      return this.muted;
    }
  }

  const sfx = new SoundEngine();

  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');

  audioToggle.addEventListener('click', () => {
    const isMuted = sfx.toggle();
    if (audioIcon) {
      audioIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
      if (window.lucide) window.lucide.createIcons();
    }
    showToast(isMuted ? 'Audio SFX Muted' : 'Audio SFX Enabled');
  });

  // Attach hover sounds to interactive elements
  document.querySelectorAll('a, button, input, .project-card, .filter-pill').forEach(el => {
    el.addEventListener('mouseenter', () => sfx.hover());
    el.addEventListener('click', () => sfx.click());
  });

  // --- FEATURE 3: THREE.JS CHROMATIC NEON DRIFT RIBBON ---
  const canvas = document.getElementById('webgl-canvas');
  if (canvas && window.THREE) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Iridescent Curving Ribbon Mesh (Torus Knot Geometry with custom normals)
    const geometry = new THREE.TorusKnotGeometry(
      isMobile ? 5.5 : 7.2,
      isMobile ? 1.4 : 1.8,
      140,
      24,
      2,
      3
    );

    // Dynamic Shader-like Material using custom chromatic shading
    const material = new THREE.MeshNormalMaterial({
      wireframe: false,
      transparent: true,
      opacity: 0.42
    });

    const ribbonMesh = new THREE.Mesh(geometry, material);
    ribbonMesh.position.set(isMobile ? 1 : 4.5, -1, -2);
    scene.add(ribbonMesh);

    // Particle Matrix Background
    const particleCount = isMobile ? 80 : 220;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 45;
      positions[i + 2] = (Math.random() - 0.5) * 35;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd1159b,
      size: 0.12,
      transparent: true,
      opacity: 0.6
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Parallax mouse / scroll listeners
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Mobile Gyroscope support
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma && e.beta) {
        targetX = (e.gamma / 45) * 0.8;
        targetY = (e.beta / 45) * 0.8;
      }
    });

    // Resize recalculation
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop (60 FPS Gated)
    const clock = new THREE.Clock();

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      ribbonMesh.rotation.x = elapsedTime * 0.22 + targetY * 0.5;
      ribbonMesh.rotation.y = elapsedTime * 0.28 + targetX * 0.5;

      particleSystem.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    }
    renderLoop();
  }

  // --- MAGNETIC CURSOR (Desktop Only) ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorFollower = document.getElementById('cursorFollower');

  if (cursorDot && cursorFollower && window.matchMedia('(hover: hover)').matches) {
    let mousePos = { x: -100, y: -100 };
    let followerPos = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    function updateFollower() {
      followerPos.x += (mousePos.x - followerPos.x) * 0.15;
      followerPos.y += (mousePos.y - followerPos.y) * 0.15;
      cursorFollower.style.transform = `translate(${followerPos.x}px, ${followerPos.y}px)`;
      requestAnimationFrame(updateFollower);
    }
    updateFollower();
  }

  // --- DYNAMIC AMBIENT LIGHT BLOOM PARALLAX ---
  const bloomEl = document.getElementById('ambientBloom');
  window.addEventListener('mousemove', (e) => {
    if (!bloomEl) return;
    const moveX = (e.clientX / window.innerWidth - 0.5) * 40;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 40;
    bloomEl.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  // --- HERO ROLE CYCLER ---
  const cyclerEl = document.getElementById('roleCycler');
  if (cyclerEl) {
    const roles = cyclerEl.querySelectorAll('span');
    let roleIdx = 0;
    setInterval(() => {
      roles[roleIdx].classList.remove('active');
      roleIdx = (roleIdx + 1) % roles.length;
      roles[roleIdx].classList.add('active');
    }, 2800);
  }

  // --- GITHUB COMMIT HEATMAP GENERATOR ---
  const heatmapContainer = document.getElementById('githubHeatmap');
  if (heatmapContainer) {
    const totalCells = 28 * 4; // 112 cells
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'heat-cell';
      const rand = Math.random();
      if (rand > 0.85) cell.classList.add('lvl-4');
      else if (rand > 0.65) cell.classList.add('lvl-3');
      else if (rand > 0.45) cell.classList.add('lvl-2');
      else if (rand > 0.25) cell.classList.add('lvl-1');
      else cell.classList.add('lvl-0');
      heatmapContainer.appendChild(cell);
    }
  }

  // --- PROJECT FILTERING ---
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- PROJECT MODALS & DEEP DIVE ---
  const projectData = [
    {
      title: "Automated CI/CD Pipeline with Jenkins & Docker",
      subtitle: "Zero-Downtime Deployment Lifecycle",
      tags: ["Jenkins", "Docker", "AWS EC2", "GitHub Webhooks", "Linux"],
      body: `
        <h4>Architecture Overview</h4>
        <p>Configured an automated Continuous Integration & Continuous Delivery (CI/CD) engine that triggers on GitHub <code>push</code> events via secure webhooks. Jenkins pulls source code, performs automated static code inspections, initiates isolated Docker container builds, tags release images, pushes them to Docker Hub, and executes rolling container deployments to AWS EC2 nodes.</p>
        <h4 style="margin-top:1rem;">Key Milestones</h4>
        <ul>
          <li>Engineered declarative Jenkinsfiles version-controlled alongside application code.</li>
          <li>Eliminated manual release intervention, decreasing deployment time from 45 mins to 2.8 mins.</li>
          <li>Integrated automatic rollback scripts triggered on failed health check probes.</li>
        </ul>
      `
    },
    {
      title: "Infrastructure Provisioning using Terraform & AWS",
      subtitle: "Multi-Availability Zone Cloud Blueprint",
      tags: ["Terraform", "AWS VPC", "Multi-AZ", "Security Groups", "S3 Mutex"],
      body: `
        <h4>Architecture Overview</h4>
        <p>Architected modular, maintainable Infrastructure as Code (IaC) utilizing Terraform to provision an enterprise-grade AWS network layout. Includes custom VPC configurations, isolated public/private subnets across multiple availability zones, internet & NAT gateways, and automated EC2 cluster provisioning.</p>
        <h4 style="margin-top:1rem;">Key Milestones</h4>
        <ul>
          <li>Configured remote state storage utilizing Amazon S3 with DynamoDB table locks to prevent concurrency conflicts.</li>
          <li>Modularized security groups according to least-privilege principles.</li>
          <li>Implemented repeatable dev, staging, and production workspace environments.</li>
        </ul>
      `
    },
    {
      title: "Kubernetes Cluster Deployment & Health Monitoring",
      subtitle: "Scalable Containerized Microservice Fleet",
      tags: ["Kubernetes", "Ingress", "Docker", "Prometheus", "Rolling Updates"],
      body: `
        <h4>Architecture Overview</h4>
        <p>Deployed scalable microservices on Kubernetes. Orchestrated Pods, ReplicaSets, ClusterIP & NodePort Services, and NGINX Ingress controllers. Embedded liveness, readiness, and startup health probes for zero-downtime rolling upgrades.</p>
        <h4 style="margin-top:1rem;">Key Milestones</h4>
        <ul>
          <li>Configured persistent volumes (PVC) for persistent state resilience.</li>
          <li>Established Horizontal Pod Autoscaling (HPA) responding to live CPU/Memory utilization thresholds.</li>
          <li>Simulated rolling updates with seamless traffic draining.</li>
        </ul>
      `
    }
  ];

  const projectModal = document.getElementById('projectModal');
  const projModalTitle = document.getElementById('projModalTitle');
  const projModalContent = document.getElementById('projModalContent');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');

  document.querySelectorAll('.open-proj-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const pIdx = parseInt(btn.getAttribute('data-project'), 10);
      const proj = projectData[pIdx];
      if (proj) {
        projModalTitle.innerText = proj.title;
        projModalContent.innerHTML = `
          <p style="color:var(--accent-amber); font-family:var(--font-mono); font-size:0.8rem; margin-bottom:1rem;">${proj.subtitle}</p>
          <div class="tech-tag-row" style="margin-bottom:1.5rem;">
            ${proj.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          ${proj.body}
        `;
        projectModal.classList.add('open');
      }
    });
  });

  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', () => projectModal.classList.remove('open'));
  }

  // --- TAILORED RESUME DOSSIER MODAL ---
  const resumeModal = document.getElementById('resumeModal');
  const openResumeModalBtn = document.getElementById('openResumeModalBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const dossierBody = document.getElementById('dossierBody');
  const roleFilterTabs = document.querySelectorAll('.role-filter-tab');
  const printResumeBtn = document.getElementById('printResumeBtn');

  const resumeViews = {
    devops: `
      <div class="resume-sheet">
        <h3 style="color:#fff; margin-bottom:0.4rem;">Muhammad Salman — DevOps & SRE Focus</h3>
        <p style="color:var(--accent-orchid); font-family:var(--font-mono); font-size:0.8rem; margin-bottom:1.25rem;">Zoople Technologies | DevOps Engineer Trainee</p>
        <p style="margin-bottom:1rem; font-size:0.92rem; color:rgba(255,255,255,0.8);">Specialized in Linux server administration, container lifecycle management with Docker/Kubernetes, and automated zero-downtime deployment pipelines.</p>
        <h4 style="margin-top:1.5rem; color:#fff;">Core Infrastructure Highlights:</h4>
        <ul style="padding-left:1.2rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.9rem;">
          <li>Automating cluster workloads and pod lifecycle on Kubernetes.</li>
          <li>Configuring declarative Jenkins CI pipelines triggered via GitHub Webhooks.</li>
          <li>Linux server administration (Ubuntu/RHEL), systemd service management, and cron scripts.</li>
        </ul>
      </div>
    `,
    cloud: `
      <div class="resume-sheet">
        <h3 style="color:#fff; margin-bottom:0.4rem;">Muhammad Salman — Cloud & AWS Architecture</h3>
        <p style="color:var(--accent-amber); font-family:var(--font-mono); font-size:0.8rem; margin-bottom:1.25rem;">AWS Cloud & Infrastructure as Code (Terraform)</p>
        <p style="margin-bottom:1rem; font-size:0.92rem; color:rgba(255,255,255,0.8);">Engineering reproducible, reliable cloud resources using Terraform modules on Amazon Web Services.</p>
        <h4 style="margin-top:1.5rem; color:#fff;">AWS & IaC Proficiencies:</h4>
        <ul style="padding-left:1.2rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.9rem;">
          <li>Configuring multi-tier VPC topologies with public/private subnet isolation across Availability Zones.</li>
          <li>Deploying resilient EC2 instances, Security Groups, IAM roles, and S3 buckets.</li>
          <li>Terraform remote state persistence with S3 and DynamoDB state locks.</li>
        </ul>
      </div>
    `,
    automation: `
      <div class="resume-sheet">
        <h3 style="color:#fff; margin-bottom:0.4rem;">Muhammad Salman — CI/CD & Automation</h3>
        <p style="color:var(--emerald-hire); font-family:var(--font-mono); font-size:0.8rem; margin-bottom:1.25rem;">Jenkins | GitHub Actions | Bash Scripting</p>
        <p style="margin-bottom:1rem; font-size:0.92rem; color:rgba(255,255,255,0.8);">Accelerating software delivery velocity through automated build, test, and release mechanisms.</p>
        <h4 style="margin-top:1.5rem; color:#fff;">Automation Pipeline Stack:</h4>
        <ul style="padding-left:1.2rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.9rem;">
          <li>Designing multi-stage Jenkins pipelines with Docker build triggers and image pushes.</li>
          <li>Automating GitHub Actions workflows for continuous code quality and deployment.</li>
          <li>Writing robust Bash shell scripts for server configuration and routine maintenance.</li>
        </ul>
      </div>
    `
  };

  function updateResumeView(viewKey) {
    if (dossierBody && resumeViews[viewKey]) {
      dossierBody.innerHTML = resumeViews[viewKey];
    }
  }

  if (openResumeModalBtn) {
    openResumeModalBtn.addEventListener('click', () => {
      updateResumeView('devops');
      resumeModal.classList.add('open');
    });
  }

  if (closeResumeModalBtn) {
    closeResumeModalBtn.addEventListener('click', () => resumeModal.classList.remove('open'));
  }

  roleFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.getAttribute('data-res-view');
      updateResumeView(view);
    });
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
// --- INTERACTIVE CI/CD PIPELINE SIMULATOR ---
  const runPipelineBtn = document.getElementById('runPipelineBtn');
  const stage1Status = document.getElementById('stage1Status');
  const stage2Status = document.getElementById('stage2Status');
  const stage3Status = document.getElementById('stage3Status');
  const stage4Status = document.getElementById('stage4Status');
  const pipelineLog = document.getElementById('pipelineLog');
  const pipelineTrigger = document.getElementById('pipelineTrigger');
  const deployTarget = document.getElementById('deployTarget');
  const securityScanToggle = document.getElementById('securityScanToggle');

  if (runPipelineBtn) {
    runPipelineBtn.addEventListener('click', () => {
      runPipelineBtn.disabled = true;
      runPipelineBtn.style.opacity = '0.6';

      const stages = [stage1Status, stage2Status, stage3Status, stage4Status];
      stages.forEach(s => {
        if (s) {
          s.innerText = 'WAITING';
          s.style.color = 'rgba(255,255,255,0.4)';
        }
      });

      const target = deployTarget ? deployTarget.value : 'cluster';
      const secEnabled = securityScanToggle ? securityScanToggle.checked : true;

      // Stage 1: Checkout
      stage1Status.innerText = 'RUNNING...';
      stage1Status.style.color = 'var(--accent-amber)';
      pipelineLog.innerHTML = '<span style="color: #ffbd2e;">[STAGE 1]</span> Fetching git tree & running Shellcheck linter...';
      sfx.click();

      setTimeout(() => {
        stage1Status.innerText = 'PASSED (0.4s)';
        stage1Status.style.color = 'var(--emerald-hire)';

        // Stage 2: Security Scan
        stage2Status.innerText = 'RUNNING...';
        stage2Status.style.color = 'var(--accent-amber)';
        pipelineLog.innerHTML = secEnabled
          ? '<span style="color: #ffbd2e;">[STAGE 2]</span> Trivy scanning Docker layers for CVE vulnerabilities...'
          : '<span style="color: rgba(255,255,255,0.5);">[STAGE 2]</span> Security scans bypassed.';

        setTimeout(() => {
          stage2Status.innerText = 'PASSED (0 CVEs)';
          stage2Status.style.color = 'var(--emerald-hire)';

          // Stage 3: Docker Build
          stage3Status.innerText = 'RUNNING...';
          stage3Status.style.color = 'var(--accent-amber)';
          pipelineLog.innerHTML = '<span style="color: #ffbd2e;">[STAGE 3]</span> Building multi-stage container & pushing tag :latest to registry...';

          setTimeout(() => {
            stage3Status.innerText = 'PASSED (1.2s)';
            stage3Status.style.color = 'var(--emerald-hire)';

            // Stage 4: Rolling Deploy
            stage4Status.innerText = 'DEPLOYING...';
            stage4Status.style.color = 'var(--accent-orchid)';
            pipelineLog.innerHTML = `<span style="color: #ffbd2e;">[STAGE 4]</span> Initiating rolling update on ${target}...`;

            setTimeout(() => {
              stage4Status.innerText = 'HEALTHY (100%)';
              stage4Status.style.color = 'var(--emerald-hire)';
              pipelineLog.innerHTML = '<span style="color: #00ff88;">[SUCCESS]</span> All pods healthy. Zero-downtime deployment finished.';
              sfx.success();

              if (window.confetti) {
                window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
              }

              runPipelineBtn.disabled = false;
              runPipelineBtn.style.opacity = '1';
            }, 1000);
          }, 900);
        }, 800);
      }, 700);
    });
  }

  // --- INTERACTIVE BASH TERMINAL ENGINE ---
  const termInput = document.getElementById('termInput');
  const termOutput = document.getElementById('termOutput');
  const termClearBtn = document.getElementById('termClearBtn');

  const termCommands = {
    help: `
      Available Commands:
        <span class="highlight">help</span>               - Display this help manual
        <span class="highlight">about</span>              - Read candidate overview
        <span class="highlight">skills</span>             - List primary technical competencies
        <span class="highlight">docker ps</span>          - List running container instances
        <span class="highlight">kubectl get pods</span>   - Inspect active Kubernetes pods
        <span class="highlight">terraform plan</span>     - Preview AWS infrastructure changes
        <span class="highlight">whoami</span>             - Print current user session
        <span class="highlight">contact</span>            - Print direct contact credentials
        <span class="highlight">clear</span>              - Clear terminal display buffer
    `,
    about: "Muhammad Salman — DevOps Engineer Trainee at Zoople Technologies. Specialize in AWS, Docker, Kubernetes, Terraform & CI/CD.",
    skills: "DevOps & Cloud: AWS, Terraform | Containers: Docker, Kubernetes | CI/CD: Jenkins, GitHub Actions | OS: Linux, Bash",
    whoami: "salman@neon-drift-bastion (Role: Principal Systems Architect)",
    contact: "Email: salmanpkty@gmail.com | Phone: +91 8086566312 | LinkedIn: linkedin.com/in/salmanmuhammed",
    "docker ps": `
CONTAINER ID   IMAGE                 STATUS          PORTS                  NAMES
a1f893e4bc21   zoople/api:v2.1       Up 14 hours     0.0.0.0:8080->80/tcp   backend-prod
c90a12e541b2   jenkins/jenkins:lts   Up 3 days       0.0.0.0:80->8080/tcp   jenkins-ci
88fb7102e3a4   redis:alpine          Up 3 days       6379/tcp               redis-cache
    `,
    "kubectl get pods": `
NAME                                  READY   STATUS    RESTARTS   AGE
microservice-auth-74d7f8d689-x8j21    1/1     Running   0          42h
microservice-orders-6c7b94966-2m9k1   1/1     Running   0          42h
ingress-nginx-controller-7f89d        1/1     Running   0          5d
    `,
    "terraform plan": `
Terraform will perform the following actions:
  + aws_vpc.custom_vpc (10.0.0.0/16)
  + aws_subnet.public_1a (10.0.1.0/24)
  + aws_instance.k8s_worker (t3.medium)
Plan: 3 to add, 0 to change, 0 to destroy.
    `
  };

  function appendTerminal(cmd, text) {
    if (!termOutput) return;
    const block = document.createElement('div');
    block.className = 'term-line';
    block.innerHTML = `
      <div style="color:var(--accent-amber); margin-top:0.4rem;">salman@aws-ec2:~$ <span class="stdout-cmd">${escapeHtml(cmd)}</span></div>
      <div style="margin-top:0.2rem; color:#e0dbe9; white-space:pre-wrap;">${text}</div>
    `;
    termOutput.appendChild(block);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = termInput.value.trim();
        const cmd = raw.toLowerCase();
        termInput.value = '';

        if (!cmd) return;

        if (cmd === 'clear') {
          termOutput.innerHTML = '';
          return;
        }

        if (termCommands[cmd]) {
          appendTerminal(raw, termCommands[cmd]);
        } else {
          appendTerminal(raw, `bash: command not found: ${escapeHtml(raw)}. Type <span class="highlight">help</span> for manual.`);
        }
      }
    });
  }

  if (termClearBtn && termOutput) {
    termClearBtn.addEventListener('click', () => {
      termOutput.innerHTML = '<div class="term-line">Terminal buffer cleared.</div>';
    });
  }

  // --- SPOTLIGHT COMMAND PALETTE (CMD+K / CTRL+K) ---
  const cmdPaletteModal = document.getElementById('cmdPaletteModal');
  const cmdPaletteTrigger = document.getElementById('cmdPaletteTrigger');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');

  const paletteItems = [
    { title: "View Featured Projects", section: "#projects", category: "Navigation" },
    { title: "Technical Skills Matrix", section: "#skills", category: "Navigation" },
    { title: "Experience & Zoople History", section: "#experience", category: "Navigation" },
    { title: "DevOps Effort Estimator", section: "#estimator", category: "Tool" },
    { title: "Interactive Bash Sandbox", section: "#sandbox", category: "Tool" },
    { title: "Contact Muhammad Salman", section: "#contact", category: "Action" },
    { title: "Inspect Dossier / Resume", action: "resume", category: "Action" },
    { title: "Copy Email Address", action: "copy-email", category: "Clipboard" },
    { title: "Copy Phone Number", action: "copy-phone", category: "Clipboard" }
  ];

  function renderPalette(query = '') {
    if (!cmdResults) return;
    cmdResults.innerHTML = '';
    const q = query.toLowerCase();
    const filtered = paletteItems.filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));

    filtered.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `cmd-item ${idx === 0 ? 'selected' : ''}`;
      el.innerHTML = `
        <div class="cmd-item-left">
          <i data-lucide="corner-down-right" style="width:14px; color:var(--accent-orchid);"></i>
          <span>${item.title}</span>
        </div>
        <span class="cmd-badge">${item.category}</span>
      `;
      el.addEventListener('click', () => executePaletteItem(item));
      cmdResults.appendChild(el);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function executePaletteItem(item) {
    cmdPaletteModal.classList.remove('open');
    if (item.section) {
      window.location.hash = item.section;
    } else if (item.action === 'resume') {
      openResumeModalBtn.click();
    } else if (item.action === 'copy-email') {
      navigator.clipboard.writeText('salmanpkty@gmail.com');
      showToast('Copied: salmanpkty@gmail.com');
    } else if (item.action === 'copy-phone') {
      navigator.clipboard.writeText('+918086566312');
      showToast('Copied: +91 8086566312');
    }
  }

  if (cmdPaletteTrigger) {
    cmdPaletteTrigger.addEventListener('click', () => {
      renderPalette();
      cmdPaletteModal.classList.add('open');
      setTimeout(() => cmdInput.focus(), 50);
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => renderPalette(e.target.value));
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      renderPalette();
      cmdPaletteModal.classList.toggle('open');
      if (cmdPaletteModal.classList.contains('open')) {
        setTimeout(() => cmdInput.focus(), 50);
      }
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
    }
  });

  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });

  // --- "ASK MY AI TWIN" FLOATING CONVERSATIONAL WIDGET ---
  const aiChatDrawer = document.getElementById('aiChatDrawer');
  const openChatAiBtn = document.getElementById('openChatAiBtn');
  const closeAiChatBtn = document.getElementById('closeAiChatBtn');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiMessagesContainer = document.getElementById('aiMessagesContainer');
  const aiQuickBtns = document.querySelectorAll('.ai-quick-btn');

  const knowledgeBase = [
    {
      keywords: ['zoople', 'experience', 'company', 'work', 'job'],
      reply: "Salman is currently a DevOps Engineer Trainee at Zoople Technologies in Kozhikode (July 2026 – Present). He architects CI/CD pipelines in Jenkins, orchestrates Docker & Kubernetes clusters, automates AWS infra via Terraform, and hardens Linux servers."
    },
    {
      keywords: ['tool', 'stack', 'skills', 'technologies', 'docker', 'kubernetes', 'aws', 'terraform'],
      reply: "Salman's technical stack spans AWS (EC2, VPC, S3, IAM), Docker, Kubernetes, Jenkins, Terraform (IaC), Git/GitHub, Linux system administration, and Bash scripting."
    },
    {
      keywords: ['hire', 'available', 'availability', 'location', 'contact', 'email', 'phone'],
      reply: "Yes, Salman is available for hire! Based in Koduvally, Calicut, India. You can email him at salmanpkty@gmail.com or call +91 8086566312."
    },
    {
      keywords: ['education', 'degree', 'college', 'university', 'calicut'],
      reply: "Salman completed his Bachelor of Science (B.Sc.) in Computer Science from the University of Calicut (June 2023 – March 2026)."
    },
    {
      keywords: ['project', 'jenkins', 'pipeline'],
      reply: "Salman built 3 key production blueprints: Automated CI/CD with Jenkins & Docker on AWS, Multi-AZ Terraform AWS provisioning, and Kubernetes cluster microservice scaling."
    }
  ];

  function queryAiTwin(query) {
    const q = query.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(kw => q.includes(kw))) {
        return item.reply;
      }
    }
    return "I specialize in Salman's DevOps background, tools (Docker, AWS, K8s, Jenkins), and Zoople experience. Could you rephrase your question or reach him directly at salmanpkty@gmail.com?";
  }

  function appendAiMessage(text, isUser = false) {
    if (!aiMessagesContainer) return;
    const msg = document.createElement('div');
    msg.className = `ai-msg ${isUser ? 'ai-user' : 'ai-bot'}`;
    msg.innerText = text;
    aiMessagesContainer.appendChild(msg);
    aiMessagesContainer.scrollTop = aiMessagesContainer.scrollHeight;
  }

  if (openChatAiBtn) {
    openChatAiBtn.addEventListener('click', () => {
      aiChatDrawer.classList.toggle('open');
      if (aiChatDrawer.classList.contains('open')) {
        setTimeout(() => aiChatInput && aiChatInput.focus(), 100);
      }
    });
  }

  if (closeAiChatBtn) {
    closeAiChatBtn.addEventListener('click', () => aiChatDrawer.classList.remove('open'));
  }

  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = aiChatInput.value.trim();
      if (!val) return;
      appendAiMessage(val, true);
      aiChatInput.value = '';

      setTimeout(() => {
        const reply = queryAiTwin(val);
        appendAiMessage(reply, false);
      }, 350);
    });
  }

  aiQuickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      appendAiMessage(q, true);
      setTimeout(() => {
        const reply = queryAiTwin(q);
        appendAiMessage(reply, false);
      }, 300);
    });
  });

  // --- ONE-CLICK CLIPBOARD COPY WITH ANIMATED TOAST ---
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    sfx.success();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-clipboard');
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`Copied: ${val}`);
        });
      }
    });
  });

  // --- CONTACT FORM VALIDATION & SIMULATED TRANSMISSION ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const msgInput = document.getElementById('senderMessage');
      const submitBtn = document.getElementById('formSubmitBtn');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('has-error');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('has-error');
      }

      // Validate message
      if (!msgInput.value.trim()) {
        msgInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        msgInput.parentElement.classList.remove('has-error');
      }

      if (isValid) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Dispatching Encrypted Transmission...</span>`;

        setTimeout(() => {
          showToast('Message transmitted successfully! Salman will review shortly.');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i data-lucide="send"></i><span>Dispatch Message</span>`;
          if (window.lucide) window.lucide.createIcons();

          if (window.confetti) {
            window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          }
        }, 1200);
      }
    });
  }

  // --- KONAMI CODE EASTER EGG & CONFETTI ARCADE ---
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiIndex = 0;

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === konamiSequence[konamiIndex].toLowerCase()) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        triggerArcadeEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Mobile 5-tap trigger on brand logo
  const brandLogo = document.getElementById('brandLogo');
  let tapCount = 0;
  let tapTimeout = null;
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      tapCount++;
      clearTimeout(tapTimeout);
      tapTimeout = setTimeout(() => { tapCount = 0; }, 1500);
      if (tapCount >= 5) {
        e.preventDefault();
        triggerArcadeEasterEgg();
        tapCount = 0;
      }
    });
  }

  const konamiModal = document.getElementById('konamiModal');
  const closeKonamiModalBtn = document.getElementById('closeKonamiModalBtn');
  const triggerConfettiAgain = document.getElementById('triggerConfettiAgain');

  function triggerArcadeEasterEgg() {
    if (konamiModal) konamiModal.classList.add('open');
    sfx.success();
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 90,
        colors: ['#D1159B', '#5800FF', '#FF5500', '#00FF88']
      });
    }
  }

  if (closeKonamiModalBtn) {
    closeKonamiModalBtn.addEventListener('click', () => konamiModal.classList.remove('open'));
  }

  if (triggerConfettiAgain) {
    triggerConfettiAgain.addEventListener('click', () => {
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 120,
          colors: ['#D1159B', '#5800FF', '#FF5500']
        });
      }
    });
  }
});
