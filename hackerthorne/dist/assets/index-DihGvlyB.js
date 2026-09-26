(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&t(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();const ae=[{id:"user-1",name:"Alex Chen",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",university:"UC Berkeley",major:"Computer Science & AI",year:"Junior (3rd Year)",bio:"Passionate AI engineer building multimodal vision & voice models. Leading the Smart Campus Assistant project.",experience:"Advanced",availability:"25 hrs/week",availabilityType:"Hackathon Sprints & Weekends",workingStyle:"Collaborative & Sprint-Focused",primaryRole:"AI / ML Developer",secondaryRoles:["Backend Developer"],skills:["Python","PyTorch","OpenCV","FastAPI","Docker","Machine Learning","LangChain"],interests:["Campus AI","Education Tech","Computer Vision","Assistants"],hackathonHistory:[{event:"CalHacks 10.0",achievement:"1st Place - AI Track"},{event:"TreeHacks 2025",achievement:"Top 10 Finalist"}],github:"github.com/alexchen-ai",portfolio:"alexchen.dev",linkedin:"linkedin.com/in/alexchen-ai",discord:"alexchen#8821",bookmarked:!1},{id:"user-2",name:"Maya Patel",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",university:"Stanford University",major:"Product Design & HCI",year:"Senior (4th Year)",bio:"Product designer passionate about intuitive student experiences, design systems, and rapid prototyping in Figma.",experience:"Advanced",availability:"20 hrs/week",availabilityType:"Evenings & Full Hackathon",workingStyle:"User-Centered & Iterative Prototyper",primaryRole:"UI/UX Designer",secondaryRoles:["Frontend Developer","Pitch / Presenter"],skills:["Figma","UI Design","User Research","TailwindCSS","Wireframing","React","Design Systems"],interests:["Campus Apps","Accessibility","Design Systems","HCI"],hackathonHistory:[{event:"TreeHacks 2025",achievement:"Best UI/UX Design Winner"},{event:"HackDavis 2024",achievement:"2nd Place Overall"}],github:"github.com/mayapatel-ux",portfolio:"mayapatel.design",linkedin:"linkedin.com/in/mayapatel-design",discord:"maya_ux#4412",bookmarked:!0},{id:"user-3",name:"Marcus Vance",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",university:"Carnegie Mellon",major:"Software Engineering",year:"Junior (3rd Year)",bio:"Frontend craftsman specializing in ultra-fast React, Next.js, interactive visual animations, and real-time dashboard data.",experience:"Intermediate",availability:"20 hrs/week",availabilityType:"Weekends & Hackathon Sprint",workingStyle:"Fast Coder & Pair Programmer",primaryRole:"Frontend Developer",secondaryRoles:["Fullstack Developer"],skills:["React","Next.js","TypeScript","TailwindCSS","WebSockets","JavaScript","Zustand"],interests:["Student Portals","Data Visualization","Developer Tools","Gamification"],hackathonHistory:[{event:"TartHacks 2025",achievement:"Best Web App Award"}],github:"github.com/marcus-vance",portfolio:"marcusvance.io",linkedin:"linkedin.com/in/marcusvance",discord:"marcus_v#1190",bookmarked:!0},{id:"user-4",name:"Sarah Lin",avatar:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",university:"MIT Sloan / EECS",major:"Business Analytics & CS",year:"Senior (4th Year)",bio:"Storyteller, product strategist, and seasoned pitch presenter. Won 3 hackathon pitch awards with compelling demo narratives.",experience:"Advanced",availability:"15 hrs/week",availabilityType:"Hackathon Sprint & Demo Day Prep",workingStyle:"Storytelling & High-Energy Presenter",primaryRole:"Pitch / Presenter",secondaryRoles:["Product Manager","UI/UX Designer"],skills:["Pitch Deck Creation","Storytelling","Public Speaking","Market Research","Product Strategy","Figma","Canva"],interests:["Social Impact","EdTech","Venture Capital","Student Tools"],hackathonHistory:[{event:"MIT 100K",achievement:"Best Pitch Presenter"},{event:"HackMIT 2024",achievement:"Best Business Value"}],github:"github.com/sarahlin",portfolio:"sarahlin.me",linkedin:"linkedin.com/in/sarah-lin-mit",discord:"sarahlin#9021",bookmarked:!1},{id:"user-5",name:"Devon Miller",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",university:"University of Washington",major:"Computer Systems",year:"Sophomore (2nd Year)",bio:"Backend developer and cloud enthusiast. Love building robust REST/GraphQL APIs, database architecture, and microservices.",experience:"Intermediate",availability:"18 hrs/week",availabilityType:"Flexible Weekdays & Weekends",workingStyle:"System Architecture & Async Focused",primaryRole:"Backend Developer",secondaryRoles:["Cloud / DevOps"],skills:["Python","FastAPI","Node.js","PostgreSQL","MongoDB","Docker","Redis","GraphQL"],interests:["Cloud Infrastructure","API Architecture","Security","Distributed Systems"],hackathonHistory:[{event:"DubHacks 2024",achievement:"Honorable Mention"}],github:"github.com/devonmiller-dev",portfolio:"devonmiller.net",linkedin:"linkedin.com/in/devonmiller",discord:"devon_m#3345",bookmarked:!1},{id:"user-6",name:"Rahul Sharma",avatar:"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",university:"Georgia Tech",major:"Machine Learning & CS",year:"Junior (3rd Year)",bio:"Machine learning enthusiast specializing in NLP, semantic embeddings, and conversational assistants.",experience:"Intermediate",availability:"20 hrs/week",availabilityType:"Hackathon Sprints",workingStyle:"Experimenter & Fast Prototyper",primaryRole:"AI / ML Developer",secondaryRoles:["Backend Developer"],skills:["Python","Machine Learning","HuggingFace","FastAPI","PyTorch","Milvus","Vector DBs"],interests:["NLP","Campus Assistants","Chatbots","AI Agents"],hackathonHistory:[{event:"HackGT 2024",achievement:"AI Track Finalist"}],github:"github.com/rahulsharma-ai",portfolio:"rahulsharma.dev",linkedin:"linkedin.com/in/rahulsharma",discord:"rahul_ml#7718",bookmarked:!1},{id:"user-7",name:"Elena Rostova",avatar:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",university:"UT Austin",major:"Informatics & Design",year:"Junior (3rd Year)",bio:"Mobile app developer and interaction designer. Love building silky smooth cross-platform experiences in Flutter and React Native.",experience:"Intermediate",availability:"15 hrs/week",availabilityType:"Evenings & Weekends",workingStyle:"Collaborative & Polish-Driven",primaryRole:"Mobile App Developer",secondaryRoles:["UI/UX Designer"],skills:["Flutter","Dart","React Native","Firebase","Figma","Swift","iOS Animation"],interests:["Mobile UX","Student Life","Social Apps","Micro-interactions"],hackathonHistory:[{event:"HackUTD 2024",achievement:"Best Mobile Hack"}],github:"github.com/elena-rostova",portfolio:"elenarostova.dev",linkedin:"linkedin.com/in/elenarostova",discord:"elena_r#5501",bookmarked:!1},{id:"user-8",name:"Rohan Verma",avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",university:"Cornell Tech",major:"Computer Science",year:"Graduate (1st Year)",bio:"DevOps & Cloud Architect. Specializing in Kubernetes, CI/CD pipelines, Terraform, and scalable backend infrastructure.",experience:"Advanced",availability:"20 hrs/week",availabilityType:"All Week Hackathons",workingStyle:"Infrastructure & DevOps Specialist",primaryRole:"Cloud / DevOps",secondaryRoles:["Backend Developer"],skills:["Docker","Kubernetes","AWS","GCP","CI/CD","Go","Terraform","Solidity"],interests:["Cloud Native","Site Reliability","Edge Computing","Decentralized Systems"],hackathonHistory:[{event:"PennApps XXIV",achievement:"1st Place - Cloud Innovation"}],github:"github.com/rohanverma-ops",portfolio:"rohanverma.cloud",linkedin:"linkedin.com/in/rohanverma",discord:"rohan_cloud#1943",bookmarked:!1}],ne=[{id:"proj-1",title:"Smart Campus Assistant",tagline:"AI voice and multimodal assistant guiding students across university resources and schedules",description:"We are developing an intelligent student assistant that integrates campus maps, dining menus, course schedules, and library study room bookings. We already have the core AI inference and backend API built. We urgently need a Frontend Developer to build the web dashboard, a UI/UX Designer to craft clean mobile wireframes, and a Presenter for our final demo.",hackathon:"HackMIT 2026",track:"Education & Campus Life",timeCommitment:"20 hrs/week",deadline:"Oct 18, 2026",status:"Recruiting Missing Roles",creatorId:"user-1",githubUrl:"https://github.com/alexchen-ai/smart-campus-assistant",demoUrl:"https://smart-campus.demo.hackmit.org",requiredSquadRoles:["AI / ML Developer","Backend Developer","Frontend Developer","UI/UX Designer","Pitch / Presenter"],requiredSkills:["Python","FastAPI","React","Figma","TailwindCSS","Pitch Deck Creation"],members:[{userId:"user-1",name:"Alex Chen",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",assignedRole:"AI / ML Developer",isLeader:!0},{userId:"user-5",name:"Devon Miller",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",assignedRole:"Backend Developer",isLeader:!1}],tasks:[{id:"task-1",title:"Build Campus FAQ semantic search with LangChain & vector indexing",status:"done",assignee:"Alex Chen",priority:"high",role:"AI / ML Developer"},{id:"task-2",title:"Implement FastAPI backend endpoints with PostgreSQL & Docker",status:"done",assignee:"Devon Miller",priority:"high",role:"Backend Developer"},{id:"task-3",title:"Design High-Fidelity Student Mobile Interface in Figma",status:"in_progress",assignee:"Unassigned (Needed: UI/UX)",priority:"urgent",role:"UI/UX Designer"},{id:"task-4",title:"Build Interactive Student Dashboard in React & TailwindCSS",status:"backlog",assignee:"Unassigned (Needed: Frontend)",priority:"urgent",role:"Frontend Developer"},{id:"task-5",title:"Draft 3-minute Hackathon Pitch Deck & Video Demo Script",status:"backlog",assignee:"Unassigned (Needed: Presenter)",priority:"medium",role:"Pitch / Presenter"}],devpostDraft:{inspiration:"Collegiate campuses are notoriously fragmented. Dining halls, bus routes, study spaces, and office hours live across 8 disparate apps. We built a unified multimodal assistant so no student ever gets lost or misses an opportunity.",whatItDoes:"Smart Campus Assistant acts as an omnipresent conversational copilot. Students can speak or type natural questions like 'Find me a quiet study room near Stata Center with outlets' or 'What is open for late dinner after 9 PM?'.",howWeBuiltIt:"Built using FastAPI, LangChain, OpenAI/Gemini embeddings, and PostgreSQL pgvector backend, wrapped in a high-speed React web interface with TailwindCSS.",challenges:"Normalizing heterogeneous university schedule feeds into real-time vector embeddings with sub-100ms retrieval latency.",accomplishments:"Achieved 96% intent accuracy across 200+ mock student inquiries and under 150ms roundtrip response time on demo queries."}},{id:"proj-2",title:"DecentralVault - Verifiable Credentials",tagline:"Verifiable student credentials & transcript proofs without revealing PII",description:"Building zero-knowledge credential verification for universities and employers at ETHGlobal. Smart contracts and ZK circuits are prototyped. We need a talented Frontend Developer to build the student wallet portal and a UI/UX Designer to simplify cryptographic keys for non-crypto students.",hackathon:"ETHGlobal San Francisco",track:"DeFi & Digital Identity",timeCommitment:"20 hrs/week",deadline:"Nov 3, 2026",status:"Recruiting Missing Roles",creatorId:"user-8",githubUrl:"https://github.com/rohanverma-ops/decentral-vault-zk",demoUrl:"https://decentralvault.eth.limo",requiredSquadRoles:["Cloud / DevOps","Frontend Developer","UI/UX Designer","Pitch / Presenter"],requiredSkills:["Solidity","React","Next.js","Figma","Ethers.js","ZK-SNARKs"],members:[{userId:"user-8",name:"Rohan Verma",avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",assignedRole:"Cloud / DevOps",isLeader:!0}],tasks:[{id:"dv-1",title:"Write Noir ZK-SNARK circuit for GPA threshold proof",status:"done",assignee:"Rohan Verma",priority:"urgent",role:"Cloud / DevOps"},{id:"dv-2",title:"Design Student Verifier Portal Wireframes in Figma",status:"in_progress",assignee:"Unassigned",priority:"high",role:"UI/UX Designer"},{id:"dv-3",title:"Connect Web3 wallet with Wagmi/Viem frontend hooks",status:"backlog",assignee:"Unassigned",priority:"urgent",role:"Frontend Developer"}],devpostDraft:{inspiration:"Traditional degree and GPA verification takes weeks and exposes full transcripts with sensitive student PII. Zero-knowledge proofs can prove eligibility instantly without disclosing private data.",whatItDoes:"DecentralVault allows students to generate cryptographic proofs (e.g. 'I am an enrolled student with GPA > 3.5') and share verifiable QR codes with employers.",howWeBuiltIt:"Noir ZK circuits compiled to Barretenberg backend, Solidity smart contracts on Arbitrum Sepolia, and Next.js frontend with RainbowKit.",challenges:"Optimizing browser-based client-side proof generation times to finish in under 3 seconds on standard laptops.",accomplishments:"First functional prototype proving GPA thresholds without disclosing actual grades or student IDs."}},{id:"proj-3",title:"EcoRoute - Green Transit Navigator",tagline:"Gamified urban transit mapping optimizing for lowest carbon footprint",description:"Stanford TreeHacks project calculating carbon footprints of commute alternatives and rewarding students with transit credits. We have the data ingestion and routing algorithms ready, but we are looking for a Mobile App Developer (Flutter/React Native) and a UI/UX Designer to build an addictive gamified UI.",hackathon:"Stanford TreeHacks 2026",track:"Sustainability & Climate",timeCommitment:"15-20 hrs/week",deadline:"Oct 28, 2026",status:"Recruiting Missing Roles",creatorId:"user-7",githubUrl:"https://github.com/elena-rostova/ecoroute-treehacks",demoUrl:"https://ecoroute.app",requiredSquadRoles:["Mobile App Developer","Backend Developer","UI/UX Designer","Pitch / Presenter"],requiredSkills:["Flutter","Go","Docker","Figma","PostgreSQL","Firebase"],members:[{userId:"user-7",name:"Elena Rostova",avatar:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",assignedRole:"Mobile App Developer",isLeader:!0}],tasks:[{id:"er-1",title:"Set up transit GTFS data pipeline in Docker with Go",status:"done",assignee:"Elena Rostova",priority:"high",role:"Mobile App Developer"},{id:"er-2",title:"Design gamified carbon badges & interactive routing maps",status:"in_progress",assignee:"Unassigned",priority:"urgent",role:"UI/UX Designer"},{id:"er-3",title:"Build transit reward token ledger & redemption backend",status:"backlog",assignee:"Unassigned",priority:"medium",role:"Backend Developer"}],devpostDraft:{inspiration:"Campus shuttle buses run half empty while hundreds of solo rideshare trips clog university avenues. We wanted to gamify green mobility.",whatItDoes:"Calculates real-time CO2 savings for cycling, walking, and electric shuttles, giving students campus store credits for sustainable travel.",howWeBuiltIt:"Flutter mobile frontend, Go GTFS transit ingestion microservice, and PostgreSQL database deployed on GCP.",challenges:"Accurate real-time multi-modal transit graph routing with dynamic bike and bus connection penalties.",accomplishments:"Working real-time route comparison engine benchmarking 4 commute choices with live carbon emission calculations."}}],ie=[{id:"req-1",projectId:"proj-1",projectTitle:"Smart Campus Assistant",senderId:"user-2",senderName:"Maya Patel",senderAvatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",senderRole:"UI/UX Designer",targetRole:"UI/UX Designer",recipientId:"user-1",type:"application",status:"pending",note:"Hey Alex! I saw your Smart Campus Assistant project for HackMIT. I won Best UI/UX at TreeHacks and designed a student portal last year. I would love to fill your missing UI/UX Designer role and craft the demo deck!",matchScore:94,timestamp:"2 hours ago"},{id:"req-2",projectId:"proj-1",projectTitle:"Smart Campus Assistant",senderId:"user-3",senderName:"Marcus Vance",senderAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",senderRole:"Frontend Developer",targetRole:"Frontend Developer",recipientId:"user-1",type:"application",status:"pending",note:"Hi Alex! I specialize in React + Tailwind high-performance dashboards and interactive campus maps. I have 20 hrs/wk available for HackMIT.",matchScore:91,timestamp:"5 hours ago"},{id:"req-3",projectId:"proj-1",projectTitle:"Smart Campus Assistant",senderId:"user-1",senderName:"Alex Chen (Smart Campus Assistant)",senderAvatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",senderRole:"Team Lead",targetRole:"Pitch / Presenter",recipientId:"user-4",type:"invitation",status:"pending",note:"Hi Sarah! TeamSync recommended you as the ideal Presenter to complete our Smart Campus Assistant squad. Your MIT Sloan background and pitch victories would make our demo stand out to judges!",matchScore:94,timestamp:"1 day ago"}],se=[{id:"chat-proj-1",type:"team",targetId:"proj-1",title:"Smart Campus Assistant Hub",avatar:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",channel:"#general",messages:[{id:"m-1",senderId:"user-1",senderName:"Alex Chen",senderAvatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",text:"Welcome to Smart Campus Assistant! Devon and I got the backend API and LangChain semantic search working.",timestamp:"Yesterday, 3:15 PM"},{id:"m-2",senderId:"user-5",senderName:"Devon Miller",senderAvatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",text:"Awesome! Now we just need to review the applicants for UI/UX and Frontend to complete our squad!",timestamp:"Yesterday, 3:42 PM"}]},{id:"chat-dm-user-2",type:"dm",targetId:"user-2",title:"Maya Patel (UI/UX Designer)",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",messages:[{id:"dm-1",senderId:"user-2",senderName:"Maya Patel",senderAvatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",text:"Hey Alex! Just sent over an application for Smart Campus Assistant. I have some existing Figma design components for student portals that we could customize in under 2 hours.",timestamp:"Today, 11:30 AM"}]}],re=[{id:"bp-ai-1",title:"OmniStudy: Real-Time Multimodal Lecture Tutor",track:"AI & Education",hackathon:"HackMIT 2026",tagline:"Live audio-visual AI lecture companion generating synchronized interactive flashcards and 3D visual concept maps",problem:"Students experience cognitive overload during fast-paced STEM lectures and struggle to convert raw audio recordings into active study aids.",solution:"A desktop and tablet companion that listens in real-time, extracts key equations and definitions, and generates interactive quizzes during natural lecture pauses.",techStack:["Python","FastAPI","Gemini 2.5 Flash","Whisper","React","Three.js","WebSockets"],squadRoles:["AI / ML Developer","Frontend Developer","Backend Developer","UI/UX Designer","Pitch / Presenter"],demoScript:"1. Show live audio stream of an MIT Physics lecture. 2. Real-time extraction of quantum harmonic oscillator formula into LaTeX. 3. Auto-generated 3D interactive wave function in Three.js. 4. Judge takes 30-sec comprehension quiz generated on the fly.",winningEdge:"Transforms passive listening into active recall without requiring professor integration."},{id:"bp-health-1",title:"PulseGuard: Computer-Vision ER Triage Assistant",track:"HealthTech & Social Impact",hackathon:"Stanford TreeHacks 2026",tagline:"Non-invasive optical vital sign detection and automated patient acuity scoring in hospital waiting rooms",problem:"Understaffed ERs face deadly delays when waiting patients deteriorate without staff noticing.",solution:"Monitors resting patients via rPPG (remote photoplethysmography) computer vision through standard waiting room webcams, alerting triage nurses to sudden cardiac drops.",techStack:["Python","OpenCV","MediaPipe","PyTorch","Next.js","TailwindCSS","FastAPI"],squadRoles:["AI / ML Developer","Backend Developer","Frontend Developer","UI/UX Designer","Pitch / Presenter"],demoScript:"1. Demo volunteer sits in front of standard webcam. 2. Real-time pulse waveform and respiratory rate calculated via facial micro-blushes. 3. Simulated stress trigger spikes heart rate — live ER dashboard triggers nurse notification.",winningEdge:"Zero contact, works with existing low-cost hardware, massive immediate social impact."},{id:"bp-web3-1",title:"ZK-Scholar: Anonymous Peer Review & Grant Protocol",track:"Web3 & Digital Identity",hackathon:"ETHGlobal San Francisco",tagline:"Blind peer review and quadratic research grant funding on Ethereum using zero-knowledge credentials",problem:"Academic publishing and grant allocation suffer from institutional bias, nepotism, and retaliatory reviews.",solution:"Researchers prove citations and academic affiliation with ZK-SNARKs without revealing identity, enabling tamper-proof quadratic funding.",techStack:["Solidity","Noir ZK","Arbitrum","Wagmi","React","Next.js","IPFS"],squadRoles:["Cloud / DevOps","Frontend Developer","UI/UX Designer","Backend Developer","Pitch / Presenter"],demoScript:"1. Researcher verifies university email via TLSNotary ZK proof. 2. Submits blinded peer review. 3. Smart contract disburses quadratic match grant to top verified paper.",winningEdge:"True censorship-resistance solving a multi-billion-dollar academic bottleneck."},{id:"bp-climate-1",title:"TerraMesh: Community Microgrid Energy Trading",track:"Sustainability & Climate",hackathon:"CalHacks 11.0",tagline:"Peer-to-peer solar energy balancing across university dorms and student housing",problem:"Rooftop solar produces excess power during mid-day when dorm rooms are empty, leading to energy waste.",solution:"IoT smart plugs communicate across a campus mesh network to automatically route excess solar power to charging stations and shared laundries.",techStack:["Go","MQTT","React","PostgreSQL","Docker","TailwindCSS","Chart.js"],squadRoles:["Backend Developer","Frontend Developer","Mobile App Developer","UI/UX Designer","Pitch / Presenter"],demoScript:"1. Simulated solar spike in Dorm A. 2. Microgrid auto-triggers laundry cycle in Dorm B. 3. Live savings dashboard showing kWh conserved and carbon offset.",winningEdge:"Tangible physical computing demo with quantifiable cost and carbon savings."}],S={STUDENTS:"hackerthorne_students_v2",PROJECTS:"hackerthorne_projects_v2",REQUESTS:"hackerthorne_requests_v2",CHATS:"hackerthorne_chats_v2",CURRENT_USER:"hackerthorne_current_user_v2",SOUND_ENABLED:"hackerthorne_sound_v2",THEME_ACCENT:"hackerthorne_accent_v2"};class pe{constructor(){this.ctx=null,this.enabled=localStorage.getItem(S.SOUND_ENABLED)!=="false"}init(){if(!this.ctx&&typeof window<"u"){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}play(e="click"){if(this.enabled)try{if(this.init(),!this.ctx)return;const a=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.connect(i),i.connect(this.ctx.destination),e==="click"?(t.type="sine",t.frequency.setValueAtTime(600,a),t.frequency.exponentialRampToValueAtTime(300,a+.05),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.05),t.start(a),t.stop(a+.05)):e==="success"?(t.type="triangle",t.frequency.setValueAtTime(523.25,a),t.frequency.setValueAtTime(659.25,a+.08),t.frequency.setValueAtTime(783.99,a+.16),i.gain.setValueAtTime(.12,a),i.gain.exponentialRampToValueAtTime(.001,a+.28),t.start(a),t.stop(a+.28)):e==="pop"?(t.type="sine",t.frequency.setValueAtTime(400,a),t.frequency.exponentialRampToValueAtTime(800,a+.08),i.gain.setValueAtTime(.1,a),i.gain.exponentialRampToValueAtTime(.001,a+.08),t.start(a),t.stop(a+.08)):e==="task"&&(t.type="sine",t.frequency.setValueAtTime(660,a),t.frequency.exponentialRampToValueAtTime(880,a+.1),i.gain.setValueAtTime(.09,a),i.gain.exponentialRampToValueAtTime(.001,a+.1),t.start(a),t.stop(a+.1))}catch(a){console.debug("Audio play skipped",a)}}toggle(){return this.enabled=!this.enabled,localStorage.setItem(S.SOUND_ENABLED,this.enabled),this.enabled}}const f=new pe;class ue{constructor(){this.students=this.loadData(S.STUDENTS,ae),this.projects=this.loadData(S.PROJECTS,ne),this.requests=this.loadData(S.REQUESTS,ie),this.chats=this.loadData(S.CHATS,se),this.currentUserId=localStorage.getItem(S.CURRENT_USER)||"user-1",this.activeView="projects",this.activeChatId="chat-proj-1",this.inboxSubtab="incoming",this.projectFilter="all",this.studentFilter="all",this.hubActiveTab="roster",this.themeAccent=localStorage.getItem(S.THEME_ACCENT)||"indigo"}loadData(e,a){try{const t=localStorage.getItem(e);return JSON.parse(t||JSON.stringify(a))}catch(t){return console.error(`Error loading ${e}`,t),JSON.parse(JSON.stringify(a))}}save(){localStorage.setItem(S.STUDENTS,JSON.stringify(this.students)),localStorage.setItem(S.PROJECTS,JSON.stringify(this.projects)),localStorage.setItem(S.REQUESTS,JSON.stringify(this.requests)),localStorage.setItem(S.CHATS,JSON.stringify(this.chats)),localStorage.setItem(S.CURRENT_USER,this.currentUserId),localStorage.setItem(S.THEME_ACCENT,this.themeAccent)}reset(){this.students=JSON.parse(JSON.stringify(ae)),this.projects=JSON.parse(JSON.stringify(ne)),this.requests=JSON.parse(JSON.stringify(ie)),this.chats=JSON.parse(JSON.stringify(se)),this.currentUserId="user-1",this.save()}getCurrentUser(){return this.students.find(e=>e.id===this.currentUserId)||this.students[0]}getStudentById(e){return this.students.find(a=>a.id===e)}getProjectById(e){return this.projects.find(a=>a.id===e)}}const s=new ue;function m(n){return n?String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function oe(n,e=150){let a=null;return(...t)=>{clearTimeout(a),a=setTimeout(()=>n(...t),e)}}function k(n,e="success"){const a=document.getElementById("toast-container");if(!a)return;const t=document.createElement("div");t.className=`toast toast-${e}`;const i=e==="success"?"✓":e==="info"?"ℹ":"★";t.innerHTML=`<span style="font-weight:bold; font-size:16px;">${i}</span> <span>${m(n)}</span>`,a.appendChild(t),f.play(e==="success"?"success":"click"),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateY(10px)",setTimeout(()=>t.remove(),300)},3200)}function R(n,e){if(!n||!e)return 80;let a=70;e.requiredSquadRoles.some(o=>o===n.primaryRole||n.secondaryRoles&&n.secondaryRoles.includes(o))&&(a+=15);const i=(n.skills||[]).filter(o=>(e.requiredSkills||[]).some(c=>c.toLowerCase()===o.toLowerCase()));return a+=Math.min(i.length*4,12),n.experience==="Advanced"&&(a+=5),Math.min(a,98)}function me(n){if(!n)return{overall:75,technical:75,design:75,pitch:75,squad:60,advice:[]};const e=n.tasks||[],a=e.length,t=e.filter(u=>u.status==="done"||u.status==="completed").length;e.filter(u=>u.status==="in_progress").length,n.members.map(u=>u.assignedRole);const i=n.requiredSquadRoles||[],o=Math.round(Math.min(n.members.length,i.length)/Math.max(i.length,1)*100);let c=65;n.githubUrl&&(c+=10),t>0&&(c+=Math.round(t/Math.max(a,1)*20)),n.members.some(u=>u.assignedRole.includes("Backend")||u.assignedRole.includes("Cloud"))&&(c+=5),c=Math.min(c,98);let p=60;n.members.some(u=>u.assignedRole.includes("UI/UX"))&&(p+=25),e.some(u=>u.role&&u.role.includes("UI/UX")&&(u.status==="done"||u.status==="in_progress"))&&(p+=10),p=Math.min(p,96);let d=60;n.members.some(u=>u.assignedRole.includes("Pitch")||u.assignedRole.includes("Presenter"))&&(d+=25),e.some(u=>u.role&&u.role.includes("Presenter")&&(u.status==="done"||u.status==="in_progress"))&&(d+=10),d=Math.min(d,95);const l=Math.round(c*.3+p*.25+d*.25+o*.2),r=[];return n.members.some(u=>u.assignedRole.includes("Pitch")||u.assignedRole.includes("Presenter"))||r.push("🎤 Missing a Pitch Presenter! Hackathon judges weigh demo storytelling at 30%+ of scoring. Recruit Sarah Lin or an experienced speaker."),n.members.some(u=>u.assignedRole.includes("UI/UX"))||r.push("🎨 Missing dedicated UI/UX Designer. Polished wireframes and micro-interactions in Figma drastically boost judging visual appeal."),t<2&&r.push("🔨 Complete at least 2 core sprint tasks on your Kanban board before code freeze to prove functional prototype viability."),r.length===0&&r.push("✨ Stellar progress! All 5 roles and milestones are on track for high judge placement."),{overall:l,technical:c,design:p,pitch:d,squad:o,advice:r}}let M=null;function ge(){le(s.themeAccent),de(),_(),ve(),fe(),he(),B(),O()}function le(n){s.themeAccent=n,document.body.setAttribute("data-theme-accent",n),document.querySelectorAll(".accent-dot").forEach(e=>{e.getAttribute("data-accent")===n?e.classList.add("active"):e.classList.remove("active")}),s.save()}function he(){function n(){const e=new Date("2026-10-18T23:59:59").getTime(),a=new Date().getTime(),t=Math.max(0,e-a),i=Math.floor(t/(1e3*60*60*24)),o=Math.floor(t%(1e3*60*60*24)/(1e3*60*60)),c=Math.floor(t%(1e3*60*60)/(1e3*60)),p=Math.floor(t%(1e3*60)/1e3),d=document.getElementById("cd-days"),l=document.getElementById("cd-hours"),r=document.getElementById("cd-mins"),u=document.getElementById("cd-secs");d&&(d.textContent=String(i).padStart(2,"0")),l&&(l.textContent=String(o).padStart(2,"0")),r&&(r.textContent=String(c).padStart(2,"0")),u&&(u.textContent=String(p).padStart(2,"0"))}n(),setInterval(n,1e3)}function _(){const n=document.getElementById("active-user-select"),e=document.getElementById("current-user-avatar");if(!n||!e)return;n.innerHTML="",s.students.forEach(t=>{const i=document.createElement("option");i.value=t.id,i.textContent=`${t.name} (${t.primaryRole.split(" ")[0]})`,t.id===s.currentUserId&&(i.selected=!0),n.appendChild(i)});const a=s.getCurrentUser();e.src=a.avatar,e.title=`${a.name} - ${a.primaryRole}`}function ve(){document.querySelectorAll(".nav-tab").forEach(a=>{a.addEventListener("click",()=>{const t=a.getAttribute("data-view");$(t),f.play("click")})});const e=document.getElementById("brand-home");e&&e.addEventListener("click",()=>$("projects"))}function $(n){s.activeView=n,document.querySelectorAll(".nav-tab").forEach(e=>{e.getAttribute("data-view")===n?e.classList.add("active"):e.classList.remove("active")}),document.querySelectorAll(".view-panel").forEach(e=>{e.id===`view-${n}`?e.classList.add("active"):e.classList.remove("active")}),n==="projects"&&E(),n==="students"&&C(),n==="matchmaker"&&ce(),n==="copilot"&&L(),n==="applications"&&j(),n==="chat"&&D()}function de(){const n=document.getElementById("icon-sound-on"),e=document.getElementById("icon-sound-off");!n||!e||(f.enabled?(n.style.display="block",e.style.display="none"):(n.style.display="none",e.style.display="block"))}function fe(){const n=document.getElementById("active-user-select");n&&n.addEventListener("change",h=>{s.currentUserId=h.target.value,s.save(),_(),k(`Switched perspective to ${s.getCurrentUser().name}`),B(),O()});const e=document.getElementById("btn-reset-data");e&&e.addEventListener("click",()=>{confirm("Reset HackerThorne to default mock data?")&&(s.reset(),_(),B(),O(),k("All demo data restored to initial state"))});const a=document.getElementById("btn-toggle-sound");a&&a.addEventListener("click",()=>{const h=f.toggle();de(),k(h?"Sound FX Enabled":"Sound FX Muted","info")});const t=document.getElementById("btn-keyboard-help"),i=document.getElementById("keyboard-modal"),o=document.getElementById("btn-close-keyboard-modal");t&&i&&(t.addEventListener("click",()=>i.style.display="flex"),o&&o.addEventListener("click",()=>i.style.display="none")),document.querySelectorAll(".accent-dot").forEach(h=>{h.addEventListener("click",()=>{const y=h.getAttribute("data-accent");le(y),f.play("click")})}),window.addEventListener("keydown",h=>{if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){h.key==="Escape"&&document.activeElement.blur();return}if(h.key==="1")$("projects");else if(h.key==="2")$("students");else if(h.key==="3")$("matchmaker");else if(h.key==="4")$("copilot");else if(h.key==="5")$("applications");else if(h.key==="6")$("chat");else if(h.key==="/"){h.preventDefault();const y=s.activeView==="students"?document.getElementById("student-search-input"):document.getElementById("project-search-input");y&&(y.focus(),y.select())}else h.key==="?"?i&&(i.style.display="flex"):h.key==="Escape"&&ye()});const c=document.getElementById("project-search-input"),p=document.getElementById("btn-clear-project-search");c&&c.addEventListener("input",oe(()=>{p&&(p.style.display=c.value?"block":"none"),E()},150)),p&&p.addEventListener("click",()=>{c.value="",p.style.display="none",E(),c.focus()});const d=document.getElementById("project-hackathon-filter"),l=document.getElementById("project-role-filter");d&&d.addEventListener("change",E),l&&l.addEventListener("change",E),document.querySelectorAll("[data-project-filter]").forEach(h=>{h.addEventListener("click",()=>{document.querySelectorAll("[data-project-filter]").forEach(y=>y.classList.remove("active")),h.classList.add("active"),s.projectFilter=h.getAttribute("data-project-filter"),f.play("click"),E()})}),document.querySelectorAll(".ticker-card[data-filter-hackathon]").forEach(h=>{h.addEventListener("click",()=>{const y=h.getAttribute("data-filter-hackathon");d&&(d.value=y,$("projects"),E(),k(`Filtered projects for ${y}`))})});const r=document.getElementById("student-search-input"),u=document.getElementById("btn-clear-student-search");r&&r.addEventListener("input",oe(()=>{u&&(u.style.display=r.value?"block":"none"),C()},150)),u&&u.addEventListener("click",()=>{r.value="",u.style.display="none",C(),r.focus()});const g=document.getElementById("student-role-filter"),v=document.getElementById("student-exp-filter");g&&g.addEventListener("change",C),v&&v.addEventListener("change",C),document.querySelectorAll("[data-student-filter]").forEach(h=>{h.addEventListener("click",()=>{document.querySelectorAll("[data-student-filter]").forEach(y=>y.classList.remove("active")),h.classList.add("active"),s.studentFilter=h.getAttribute("data-student-filter"),f.play("click"),C()})});const I=document.getElementById("btn-open-create-project"),b=document.getElementById("create-project-modal"),w=document.getElementById("btn-close-create-modal"),T=document.getElementById("btn-cancel-create"),q=document.getElementById("create-project-form");I&&b&&(I.addEventListener("click",()=>b.style.display="flex"),w&&w.addEventListener("click",()=>b.style.display="none"),T&&T.addEventListener("click",()=>b.style.display="none"),q&&q.addEventListener("submit",we));const U=document.getElementById("btn-close-project-modal"),x=document.getElementById("project-detail-modal");U&&x&&U.addEventListener("click",()=>x.style.display="none");const A=document.getElementById("candidate-modal"),H=document.getElementById("btn-close-candidate-modal");H&&A&&H.addEventListener("click",()=>A.style.display="none");const W=document.getElementById("apply-modal"),J=document.getElementById("btn-close-apply-modal"),X=document.getElementById("btn-cancel-apply"),K=document.getElementById("apply-form");W&&(J&&J.addEventListener("click",()=>W.style.display="none"),X&&X.addEventListener("click",()=>W.style.display="none"),K&&K.addEventListener("submit",xe)),document.querySelectorAll(".hub-tab-btn").forEach(h=>{h.addEventListener("click",()=>{const y=h.getAttribute("data-hub-tab");s.hubActiveTab=y,document.querySelectorAll(".hub-tab-btn").forEach(P=>P.classList.remove("active")),h.classList.add("active"),f.play("click"),M&&V(M)})});const Q=document.getElementById("btn-run-matchmaker"),Y=document.getElementById("matchmaker-project-select");Q&&Q.addEventListener("click",G),Y&&Y.addEventListener("change",G);const N=document.getElementById("copilot-track-select"),Z=document.getElementById("btn-generate-custom-idea");N&&N.addEventListener("change",L),Z&&Z.addEventListener("click",()=>{f.play("pop");const h=["AI & Education","HealthTech & Social Impact","Web3 & Digital Identity","Sustainability & Climate"],y=h[Math.floor(Math.random()*h.length)];N&&(N.value=y),L(),k(`Generated concept for track: ${y}`)});const F=document.getElementById("subtab-incoming"),z=document.getElementById("subtab-outgoing");F&&z&&(F.addEventListener("click",()=>{s.inboxSubtab="incoming",F.classList.add("active"),z.classList.remove("active"),f.play("click"),j()}),z.addEventListener("click",()=>{s.inboxSubtab="outgoing",z.classList.add("active"),F.classList.remove("active"),f.play("click"),j()}));const ee=document.getElementById("chat-form");ee&&ee.addEventListener("submit",be),document.querySelectorAll(".slash-chip").forEach(h=>{h.addEventListener("click",()=>{const y=h.getAttribute("data-cmd"),P=document.getElementById("chat-input");P&&(P.value=y,P.focus())})});const te=document.getElementById("btn-quick-standup");te&&te.addEventListener("click",()=>{const h=document.getElementById("chat-input");h&&(h.value="/standup",h.focus())}),document.querySelectorAll(".modal-backdrop").forEach(h=>{h.addEventListener("click",y=>{y.target===h&&(h.style.display="none")})})}function ye(){document.querySelectorAll(".modal-backdrop").forEach(n=>n.style.display="none")}function B(){const n=s.getCurrentUser(),a=s.projects.filter(r=>r.creatorId===n.id).map(r=>r.id),t=s.requests.filter(r=>(r.recipientId===n.id||a.includes(r.projectId))&&r.status==="pending"&&r.senderId!==n.id),i=s.requests.filter(r=>r.senderId===n.id&&r.status==="pending"),o=s.students.filter(r=>r.bookmarked),c=document.getElementById("incoming-count"),p=document.getElementById("outgoing-count"),d=document.getElementById("inbox-badge-count"),l=document.getElementById("bookmark-count-badge");c&&(c.textContent=t.length),p&&(p.textContent=i.length),l&&(l.textContent=o.length),d&&(d.textContent=t.length,d.style.display=t.length>0?"inline-block":"none")}function O(){E(),C(),ce(),L(),j(),D()}function E(){const n=document.getElementById("projects-container");if(!n)return;const e=document.getElementById("project-search-input"),a=document.getElementById("project-hackathon-filter"),t=document.getElementById("project-role-filter"),i=(e?e.value:"").toLowerCase().trim(),o=a?a.value:"all",c=t?t.value:"all",p=s.getCurrentUser(),d=s.projects.filter(l=>{if(o!=="all"&&l.hackathon!==o)return!1;const r=l.members.map(g=>g.assignedRole),u=l.requiredSquadRoles.filter(g=>!r.includes(g));if(c!=="all"&&!u.includes(c))return!1;if(s.projectFilter==="my-squads"){if(!(l.creatorId===p.id||l.members.some(v=>v.userId===p.id)))return!1}else if(s.projectFilter==="needs-roles"){if(u.length===0)return!1}else if(s.projectFilter==="high-match"&&R(p,l)<85)return!1;if(i){const g=l.title.toLowerCase().includes(i),v=l.description.toLowerCase().includes(i),I=(l.requiredSkills||[]).some(b=>b.toLowerCase().includes(i));if(!g&&!v&&!I)return!1}return!0});if(n.innerHTML="",d.length===0){n.innerHTML=`
            <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: rgba(0,0,0,0.25); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <span style="font-size:36px;">🔍</span>
                <p style="font-size: 16px; color: var(--text-muted); margin-top: 10px;">No projects found matching the selected criteria.</p>
                <button class="btn btn-secondary" style="margin-top: 14px;" id="btn-reset-proj-filters">Reset All Filters</button>
            </div>
        `;const l=document.getElementById("btn-reset-proj-filters");l&&l.addEventListener("click",()=>{e&&(e.value=""),a&&(a.value="all"),t&&(t.value="all"),s.projectFilter="all",document.querySelectorAll("[data-project-filter]").forEach(u=>u.classList.remove("active"));const r=document.querySelector('[data-project-filter="all"]');r&&r.classList.add("active"),E()});return}d.forEach(l=>{const r=document.createElement("div");r.className="project-card";const u=l.members.map(x=>x.assignedRole),g=l.requiredSquadRoles.filter(x=>!u.includes(x)),v=l.members.some(x=>x.userId===p.id),I=R(p,l),b=l.tasks?l.tasks.length:0,w=l.tasks?l.tasks.filter(x=>x.status==="done"||x.status==="completed").length:0,T=b>0?Math.round(w/b*100):0;let q="";l.requiredSquadRoles.forEach(x=>{const A=l.members.find(H=>H.assignedRole===x);A?q+=`
                    <div class="squad-slot" title="${m(A.name)} (${m(A.assignedRole)})">
                        <img class="slot-avatar" src="${A.avatar}" alt="${m(A.name)}">
                        <span class="slot-role-lbl">${m(A.assignedRole.split(" ")[0])}</span>
                    </div>
                `:q+=`
                    <div class="squad-slot slot-clickable" title="Needed: ${m(x)}" data-action="open-hub" data-id="${l.id}">
                        <div class="slot-empty">+</div>
                        <span class="slot-role-lbl slot-empty-lbl">${m(x.split(" ")[0])}</span>
                    </div>
                `});const U=(l.requiredSkills||[]).slice(0,4).map(x=>`<span class="skill-tag">${m(x)}</span>`).join("");r.innerHTML=`
            <div>
                <div class="project-card-header">
                    <div>
                        <div class="project-meta-badges">
                            <span class="badge badge-purple">${m(l.hackathon)}</span>
                            <span class="badge badge-cyan">${m(l.track)}</span>
                            <span class="badge badge-emerald">${m(l.timeCommitment)}</span>
                        </div>
                        <h3 class="project-title">${m(l.title)}</h3>
                        <p class="project-tagline">${m(l.tagline)}</p>
                    </div>
                </div>

                <div class="squad-visualizer" style="margin-top: 14px;">
                    <div class="squad-vis-title">
                        <span>Squad Formation (${l.members.length}/${l.requiredSquadRoles.length})</span>
                        <span style="color: ${g.length>0?"#06b6d4":"#10b981"}; font-weight: 700;">
                            ${g.length>0?`${g.length} Open Role${g.length>1?"s":""}`:"Squad Full"}
                        </span>
                    </div>
                    <div class="squad-slots-row">
                        ${q}
                    </div>
                </div>

                <div style="margin-top: 14px;">
                    <div class="skills-tags">
                        ${U}
                    </div>
                </div>
            </div>

            <div class="project-card-footer">
                <div class="progress-mini">
                    <span class="progress-text">Sprint Velocity: ${w}/${b} Tasks (${T}%)</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${T}%;"></div>
                    </div>
                </div>

                <div class="project-actions">
                    <button class="btn btn-secondary" data-action="open-hub" data-id="${l.id}">
                        <span>Squad Hub</span>
                    </button>
                    ${v?`
                        <span class="badge badge-emerald" style="padding: 7px 11px;">Squad Member</span>
                    `:`
                        <button class="btn btn-primary" data-action="open-apply" data-id="${l.id}">
                            <span>Apply (${I}%)</span>
                        </button>
                    `}
                </div>
            </div>
        `,n.appendChild(r)}),n.querySelectorAll("[data-action]").forEach(l=>{l.addEventListener("click",r=>{const u=l.getAttribute("data-action"),g=l.getAttribute("data-id");u==="open-hub"&&window.openProjectModal(g),u==="open-apply"&&window.openApplyModal(g)})})}window.renderProjects=E;window.openProjectModal=function(n){M=n;const e=s.getProjectById(n);if(!e)return;const a=document.getElementById("project-detail-modal"),t=document.getElementById("modal-project-title"),i=document.getElementById("modal-project-hackathon"),o=document.getElementById("modal-project-track"),c=document.getElementById("modal-project-status");t&&(t.textContent=e.title),i&&(i.textContent=e.hackathon),o&&(o.textContent=e.track),c&&(c.textContent=e.status||"Active Sprint"),V(n),a&&(a.style.display="flex"),f.play("click")};function V(n){const e=s.getProjectById(n),a=document.getElementById("modal-project-body");if(!e||!a)return;const t=e.members.map(p=>p.assignedRole),i=e.requiredSquadRoles.filter(p=>!t.includes(p)),o=s.getCurrentUser(),c=e.members.some(p=>p.userId===o.id);if(s.hubActiveTab==="roster"){const p=e.members.map(l=>{const r=s.getStudentById(l.userId);return`
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.03); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${l.avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #8b5cf6;" alt="${m(l.name)}">
                        <div>
                            <div style="font-weight:700; color:#fff; font-size:14px;">
                                ${m(l.name)} ${l.isLeader?'<span class="badge badge-purple" style="font-size:10px; margin-left:6px;">Squad Lead</span>':""}
                            </div>
                            <div style="font-size:12px; color:var(--text-muted);">${m(l.assignedRole)} ${r?`• ${m(r.university)}`:""}</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary" style="padding:5px 10px; font-size:12px;" onclick="window.startDirectMessage('${l.userId}')">Chat</button>
                </div>
            `}).join("");let d="";i.length===0?d=`<p style="color:#10b981; font-weight:600; font-size:13.5px;">🎉 Squad is complete! All ${e.requiredSquadRoles.length} squad roles filled.</p>`:d=i.map(l=>{const u=s.students.filter(g=>!e.members.some(v=>v.userId===g.id)).filter(g=>g.primaryRole===l||g.secondaryRoles&&g.secondaryRoles.includes(l)).map(g=>({student:g,score:R(g,e)})).sort((g,v)=>v.score-g.score)[0];return`
                    <div style="padding:12px; background:rgba(6, 182, 212, 0.04); border:1px dashed rgba(6, 182, 212, 0.3); border-radius:8px; display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:700; color:#22d3ee; font-size:13px;">🚨 Needed: ${m(l)}</span>
                            ${c?"":`
                                <button class="btn btn-primary" style="padding:4px 10px; font-size:11px;" onclick="window.openApplyModal('${e.id}', '${l}')">Apply for Role</button>
                            `}
                        </div>
                        ${u?`
                            <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:rgba(0,0,0,0.3); border-radius:6px; font-size:12px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <img src="${u.student.avatar}" style="width:26px; height:26px; border-radius:50%;" alt="${m(u.student.name)}">
                                    <span>Top Pick: <strong>${m(u.student.name)}</strong> (${m(u.student.university)})</span>
                                    <span class="badge badge-emerald" style="font-size:10px;">${u.score}% Match</span>
                                </div>
                                <button class="btn btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="window.inviteCandidate('${e.id}', '${u.student.id}', '${l}')">Invite</button>
                            </div>
                        `:'<span style="font-size:11.5px; color:var(--text-dim);">Scanning candidate directory...</span>'}
                    </div>
                `}).join(""),a.innerHTML=`
            <div>
                <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px;">Project Overview & Concept</h4>
                <p style="color:var(--text-muted); font-size:14px; line-height:1.6;">${m(e.description)}</p>
            </div>

            <div style="margin-top:16px;">
                <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Current Squad Members (${e.members.length})</h4>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${p}
                </div>
            </div>

            <div style="margin-top:16px;">
                <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Open Positions & AI Recruits</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${d}
                </div>
            </div>
        `}else if(s.hubActiveTab==="kanban"){const p=e.tasks||[];let l=[{key:"backlog",title:"📋 Backlog",icon:"📋"},{key:"in_progress",title:"🔨 In Progress",icon:"🔨"},{key:"review",title:"🧪 Review / Testing",icon:"🧪"},{key:"done",title:"✅ Demo Ready",icon:"✅"}].map(r=>{const u=p.filter(v=>r.key==="done"?v.status==="done"||v.status==="completed":r.key==="backlog"?v.status==="backlog"||v.status==="todo":v.status===r.key),g=u.map(v=>{const I=v.priority==="urgent"?"priority-urgent":v.priority==="high"?"priority-high":"priority-medium";return`
                    <div class="kanban-card" id="task-${v.id}">
                        <div class="kanban-card-title">${m(v.title)}</div>
                        <div class="kanban-meta-row">
                            <span class="${I}">${v.priority||"medium"}</span>
                            <span style="font-size:11px; color:var(--text-dim);">${m(v.assignee||"Unassigned")}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                            <span style="font-size:10px; color:var(--accent-cyan); font-weight:600;">${m(v.role||"General")}</span>
                            <div class="kanban-nav-btns">
                                ${r.key!=="backlog"?`
                                    <button class="kanban-nav-btn" title="Move Left" onclick="window.moveTask('${e.id}', '${v.id}', 'left')">←</button>
                                `:""}
                                ${r.key!=="done"?`
                                    <button class="kanban-nav-btn" title="Move Right" onclick="window.moveTask('${e.id}', '${v.id}', 'right')">→</button>
                                `:""}
                            </div>
                        </div>
                    </div>
                `}).join("");return`
                <div class="kanban-col">
                    <div class="kanban-col-header">
                        <span class="kanban-col-title">${r.title}</span>
                        <span class="kanban-col-count">${u.length}</span>
                    </div>
                    <div class="kanban-cards-list">
                        ${g.length>0?g:'<div style="text-align:center; padding:20px; font-size:12px; color:var(--text-dim);">No tasks in this lane</div>'}
                    </div>
                </div>
            `}).join("");a.innerHTML=`
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                    <h4 style="font-size:15px; font-weight:700; color:#fff;">Hackathon Sprint Kanban Board</h4>
                    <p style="font-size:12px; color:var(--text-muted);">Track feature branches, wireframes, and pitch slides. Move tasks as your squad progresses.</p>
                </div>
            </div>

            <!-- Quick Add Task Bar -->
            <div class="new-task-form" style="background:rgba(0,0,0,0.3); padding:10px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); display:flex; gap:10px; flex-wrap:wrap;">
                <input type="text" id="new-task-title" class="new-task-input" placeholder="New sprint task description..." style="flex:2; min-width:200px;">
                <select id="new-task-role" class="filter-select" style="padding:6px 10px; font-size:12px;">
                    <option value="General">General</option>
                    ${e.requiredSquadRoles.map(r=>`<option value="${m(r)}">${m(r)}</option>`).join("")}
                </select>
                <select id="new-task-priority" class="filter-select" style="padding:6px 10px; font-size:12px;">
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Priority</option>
                </select>
                <button class="btn btn-primary" style="padding:6px 16px; font-size:12px;" onclick="window.addNewKanbanTask('${e.id}')">Add Task</button>
            </div>

            <div class="kanban-board">
                ${l}
            </div>
        `}else if(s.hubActiveTab==="rubric"){const p=me(e);a.innerHTML=`
            <div class="rubric-container">
                <div class="readiness-banner">
                    <div class="readiness-score-box">
                        <div class="score-circle">${p.overall}%</div>
                        <div>
                            <h3 style="font-size:18px; font-weight:800; color:#fff;">Demo Day Readiness Index</h3>
                            <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">
                                ${p.overall>=85?"🌟 Exceptional! Your squad and prototype are primed to win.":"⚡ Good progress! Follow AI judge recommendations below to hit 90%+ readiness."}
                            </p>
                        </div>
                    </div>
                    <span class="badge ${p.overall>=80?"badge-emerald":"badge-amber"}" style="padding:8px 16px; font-size:13px; text-transform:uppercase;">
                        ${p.overall>=85?"Demo Ready":"In Sprint"}
                    </span>
                </div>

                <div class="rubric-grid">
                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">🛠 Technical Difficulty & MVP (30%)</span>
                            <span style="font-weight:700; color:#38bdf8;">${p.technical}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${p.technical}%; background:linear-gradient(90deg, #38bdf8, #6366f1);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">Backend APIs, schema models, and working client integration.</p>
                    </div>

                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">🎨 UI/UX Polish & Usability (25%)</span>
                            <span style="font-weight:700; color:#a855f7;">${p.design}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${p.design}%; background:linear-gradient(90deg, #a855f7, #ec4899);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">High-fidelity wireframes, intuitive ergonomics, and design system.</p>
                    </div>

                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">🎤 Pitch & Demo Storytelling (25%)</span>
                            <span style="font-weight:700; color:#10b981;">${p.pitch}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${p.pitch}%; background:linear-gradient(90deg, #10b981, #06b6d4);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">Compelling hook, live demo script, and market impact narrative.</p>
                    </div>

                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">👥 Squad Role Coverage (20%)</span>
                            <span style="font-weight:700; color:#f59e0b;">${p.squad}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${p.squad}%; background:linear-gradient(90deg, #f59e0b, #f97316);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">Full 5-role coverage ensures balanced team execution during judging.</p>
                    </div>
                </div>

                <div class="ai-advice-box">
                    <span style="font-weight:700; color:#a5b4fc; font-size:13.5px;">💡 AI Judge Advisory & Next Sprint Steps:</span>
                    <ul style="padding-left:18px; margin:0; display:flex; flex-direction:column; gap:6px; font-size:13px; color:#e2e8f0; line-height:1.5;">
                        ${p.advice.map(d=>`<li>${m(d)}</li>`).join("")}
                    </ul>
                </div>
            </div>
        `}else if(s.hubActiveTab==="devpost"){const p=e.devpostDraft||{inspiration:`${e.tagline}. Built specifically for ${e.hackathon}.`,whatItDoes:e.description,howWeBuiltIt:`Built using ${(e.requiredSkills||[]).join(", ")}.`,challenges:"Tight hackathon timeline and synchronizing team sprint tasks.",accomplishments:"Finished full working demo prototype with 5-person squad."},d=`# ${e.title}
> ${e.tagline}

**Hackathon Event:** ${e.hackathon}
**Track:** ${e.track}
**Squad Roster:** ${e.members.map(r=>`${r.name} (${r.assignedRole})`).join(", ")}

## 💡 Inspiration
${p.inspiration}

## ⚙️ What it does
${p.whatItDoes}

## 🛠 How we built it
${p.howWeBuiltIt}

## 🧗 Challenges we ran into
${p.challenges}

## 🏆 Accomplishments that we're proud of
${p.accomplishments}

## 🚀 What's next for ${e.title}
Taking feedback from ${e.hackathon} judges and preparing university pilot rollout!`;a.innerHTML=`
            <div class="devpost-export-container">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4 style="font-size:15px; font-weight:700; color:#fff;">Devpost & Pitch Deck Markdown Export</h4>
                        <p style="font-size:12px; color:var(--text-muted);">Ready-to-paste markdown formatted for Devpost, GitHub README, or presentation speaker notes.</p>
                    </div>
                    <button class="btn btn-primary" id="btn-copy-devpost">
                        <span>📋 Copy to Clipboard</span>
                    </button>
                </div>

                <div class="devpost-preview-box" id="devpost-text-box">${m(d)}</div>
            </div>
        `;const l=document.getElementById("btn-copy-devpost");l&&l.addEventListener("click",()=>{navigator.clipboard.writeText(d).then(()=>{l.innerHTML="<span>✓ Copied to Clipboard!</span>",k("Devpost markdown copied to clipboard!"),f.play("success"),setTimeout(()=>{l&&(l.innerHTML="<span>📋 Copy to Clipboard</span>")},2500)}).catch(()=>{k("Failed to copy to clipboard","info")})})}}window.moveTask=function(n,e,a){const t=s.getProjectById(n);if(!t||!t.tasks)return;const i=t.tasks.find(d=>d.id===e);if(!i)return;const o=["backlog","in_progress","review","done"];let c=i.status;c==="todo"&&(c="backlog"),c==="completed"&&(c="done");let p=o.indexOf(c);p===-1&&(p=0),a==="right"&&p<o.length-1?i.status=o[p+1]:a==="left"&&p>0&&(i.status=o[p-1]),s.save(),f.play("task"),V(n),E()};window.addNewKanbanTask=function(n){const e=s.getProjectById(n),a=document.getElementById("new-task-title"),t=document.getElementById("new-task-role"),i=document.getElementById("new-task-priority");if(!e||!a||!a.value.trim())return;e.tasks||(e.tasks=[]);const o={id:`t-${Date.now()}`,title:a.value.trim(),status:"backlog",priority:i?i.value:"medium",role:t?t.value:"General",assignee:"Unassigned"};e.tasks.push(o),s.save(),f.play("success"),k(`Task added to Backlog: ${o.title}`),V(n),E()};function C(){const n=document.getElementById("students-container");if(!n)return;const e=document.getElementById("student-search-input"),a=document.getElementById("student-role-filter"),t=document.getElementById("student-exp-filter"),i=(e?e.value:"").toLowerCase().trim(),o=a?a.value:"all",c=t?t.value:"all",p=s.getCurrentUser(),d=s.projects[0],l=s.students.filter(r=>{if(o!=="all"&&r.primaryRole!==o&&(!r.secondaryRoles||!r.secondaryRoles.includes(o))||c!=="all"&&r.experience!==c)return!1;if(s.studentFilter==="bookmarked"){if(!r.bookmarked)return!1}else if(s.studentFilter==="advanced"){if(r.experience!=="Advanced")return!1}else if(s.studentFilter==="high-synergy"&&R(r,d)<88)return!1;if(i){const u=r.name.toLowerCase().includes(i),g=r.university.toLowerCase().includes(i),v=r.major.toLowerCase().includes(i),I=(r.skills||[]).some(b=>b.toLowerCase().includes(i));if(!u&&!g&&!v&&!I)return!1}return!0});if(n.innerHTML="",l.length===0){n.innerHTML=`
            <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: rgba(0,0,0,0.25); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <span style="font-size:36px;">👥</span>
                <p style="font-size: 16px; color: var(--text-muted); margin-top: 10px;">No student talent matches the selected filters.</p>
                <button class="btn btn-secondary" style="margin-top: 14px;" id="btn-reset-stud-filters">Clear Talent Filters</button>
            </div>
        `;const r=document.getElementById("btn-reset-stud-filters");r&&r.addEventListener("click",()=>{e&&(e.value=""),a&&(a.value="all"),t&&(t.value="all"),s.studentFilter="all",document.querySelectorAll("[data-student-filter]").forEach(g=>g.classList.remove("active"));const u=document.querySelector('[data-student-filter="all"]');u&&u.classList.add("active"),C()});return}l.forEach(r=>{const u=document.createElement("div");u.className="student-card";const g=R(r,d),v=r.id===p.id,I=(r.skills||[]).slice(0,5).map(w=>`<span class="skill-tag">${m(w)}</span>`).join(""),b=(r.hackathonHistory||[]).map(w=>`
            <div class="achievement-item">
                <span>🏆</span>
                <span><strong>${m(w.event)}:</strong> ${m(w.achievement)}</span>
            </div>
        `).join("");u.innerHTML=`
            <div>
                <div class="student-top">
                    <img class="student-avatar" src="${r.avatar}" alt="${m(r.name)}" data-action="view-dossier" data-id="${r.id}" style="cursor:pointer;" title="View Dossier">
                    <div class="student-info">
                        <div class="student-name-row">
                            <h3 class="student-name" data-action="view-dossier" data-id="${r.id}" style="cursor:pointer;" title="View Dossier">${m(r.name)}</h3>
                            <div style="display:flex; align-items:center; gap:6px;">
                                <button class="btn-bookmark ${r.bookmarked?"bookmarked":""}" data-action="toggle-bookmark" data-id="${r.id}" title="${r.bookmarked?"Remove from shortlist":"Shortlist candidate"}">★</button>
                                <span class="match-score-pill">
                                    <span>⚡</span> ${g}% Synergy
                                </span>
                            </div>
                        </div>
                        <div class="student-univ">${m(r.university)} • ${m(r.year)}</div>
                        <div class="student-major">${m(r.major)}</div>
                    </div>
                </div>

                <div style="margin-top: 12px;">
                    <div class="roles-row">
                        <span class="role-badge-primary">${m(r.primaryRole)}</span>
                        ${(r.secondaryRoles||[]).map(w=>`<span class="role-badge-secondary">${m(w)}</span>`).join("")}
                    </div>
                </div>

                <p class="student-bio" style="margin-top: 10px;">${m(r.bio)}</p>

                <div style="margin-top: 12px;">
                    <div class="skills-tags">
                        ${I}
                    </div>
                </div>

                ${b?`
                    <div style="margin-top: 12px;">
                        <div class="achievement-list">
                            ${b}
                        </div>
                    </div>
                `:""}
            </div>

            <div class="project-card-footer" style="padding-top: 14px;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:11px; color:var(--text-dim);">Weekly Availability</span>
                    <span style="font-size:12px; font-weight:600; color:#34d399;">${m(r.availability)}</span>
                </div>

                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary" data-action="view-dossier" data-id="${r.id}">
                        <span>Dossier</span>
                    </button>
                    ${v?`
                        <span class="badge badge-purple" style="padding:7px 10px;">Acting User</span>
                    `:`
                        <button class="btn btn-secondary" data-action="message-student" data-id="${r.id}">
                            <span>Chat</span>
                        </button>
                        <button class="btn btn-primary" data-action="invite-student" data-id="${r.id}">
                            <span>Invite</span>
                        </button>
                    `}
                </div>
            </div>
        `,n.appendChild(u)}),n.querySelectorAll("[data-action]").forEach(r=>{r.addEventListener("click",u=>{const g=r.getAttribute("data-action"),v=r.getAttribute("data-id");g==="view-dossier"&&window.openCandidateDossier(v),g==="toggle-bookmark"&&(u.stopPropagation(),window.toggleStudentBookmark(v)),g==="message-student"&&window.startDirectMessage(v),g==="invite-student"&&window.openInviteModal(v)})})}window.renderStudents=C;window.toggleStudentBookmark=function(n){const e=s.getStudentById(n);e&&(e.bookmarked=!e.bookmarked,s.save(),f.play("click"),B(),C(),k(e.bookmarked?`Added ${e.name} to shortlist`:`Removed ${e.name} from shortlist`,"info"))};window.openCandidateDossier=function(n){const e=s.getStudentById(n);if(!e)return;const a=document.getElementById("candidate-modal"),t=document.getElementById("candidate-modal-body"),i=document.getElementById("candidate-modal-title");if(!a||!t)return;i&&(i.textContent=`${e.name} — Talent Dossier`);const o=s.projects[0],c=R(e,o),p=(e.hackathonHistory||[]).map(d=>`
        <div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
            <span style="font-size:20px;">🏆</span>
            <div>
                <div style="font-weight:700; color:#fff; font-size:13.5px;">${m(d.achievement)}</div>
                <div style="font-size:11.5px; color:var(--text-dim);">${m(d.event)}</div>
            </div>
        </div>
    `).join("");t.innerHTML=`
        <div class="dossier-top">
            <img class="dossier-avatar" src="${e.avatar}" alt="${m(e.name)}">
            <div class="dossier-details">
                <div style="display:flex; align-items:center; gap:10px;">
                    <h3 class="dossier-name">${m(e.name)}</h3>
                    <span class="badge badge-emerald">⚡ ${c}% Synergy Match</span>
                </div>
                <div style="font-size:14px; color:#38bdf8;">${m(e.university)} • ${m(e.year)}</div>
                <div style="font-size:13px; color:var(--text-muted);">${m(e.major)}</div>
                <div class="dossier-links">
                    ${e.github?`<a href="https://${e.github}" target="_blank" class="dossier-link-chip">🐙 ${e.github}</a>`:""}
                    ${e.portfolio?`<a href="https://${e.portfolio}" target="_blank" class="dossier-link-chip">🌐 ${e.portfolio}</a>`:""}
                    ${e.discord?`<span class="dossier-link-chip" style="color:#a5b4fc;">💬 ${e.discord}</span>`:""}
                </div>
            </div>
        </div>

        <div style="margin-top:18px;">
            <h4 style="font-size:12.5px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px;">Biography & Mission</h4>
            <p style="font-size:14px; color:#e2e8f0; line-height:1.6;">${m(e.bio)}</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:16px;">
            <div style="background:rgba(0,0,0,0.25); padding:12px 16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Working Style</div>
                <div style="font-size:13.5px; font-weight:600; color:#fff; margin-top:2px;">${m(e.workingStyle||"Collaborative Sprint Hacker")}</div>
            </div>
            <div style="background:rgba(0,0,0,0.25); padding:12px 16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Availability Commitment</div>
                <div style="font-size:13.5px; font-weight:600; color:#34d399; margin-top:2px;">${m(e.availability)} (${m(e.availabilityType||"Hackathon Weekend")})</div>
            </div>
        </div>

        <div style="margin-top:18px;">
            <h4 style="font-size:12.5px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Core Tech Stack & Verified Skills</h4>
            <div class="skills-tags">
                ${(e.skills||[]).map(d=>`<span class="skill-tag" style="padding:5px 12px; font-size:12px;">${m(d)}</span>`).join("")}
            </div>
        </div>

        <div style="margin-top:18px;">
            <h4 style="font-size:12.5px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Hackathon Trophies & Past Accolades</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${p}
            </div>
        </div>

        <div class="modal-footer" style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('candidate-modal').style.display='none';">Close</button>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('candidate-modal').style.display='none'; window.openInviteModal('${e.id}');">
                <span>⚡ Send Squad Invitation</span>
            </button>
        </div>
    `,a.style.display="flex",f.play("click")};function ce(){const n=document.getElementById("matchmaker-project-select");n&&(n.innerHTML="",s.projects.forEach(e=>{const a=document.createElement("option");a.value=e.id,a.textContent=`${e.title} (${e.hackathon})`,n.appendChild(a)}),G())}function G(){const n=document.getElementById("matchmaker-project-select"),e=document.getElementById("matchmaker-results");if(!n||!e)return;const a=n.value||s.projects[0]&&s.projects[0].id,t=s.getProjectById(a);if(!t)return;const i=t.members.map(c=>c.userId),o=t.requiredSquadRoles.map(c=>{const p=t.members.find(d=>d.assignedRole===c);if(p)return`
                <div class="roster-card filled">
                    <span class="badge badge-purple" style="position:absolute; top:12px; left:12px;">Active Member</span>
                    <span class="roster-role-title">${m(c)}</span>
                    <img class="roster-avatar" src="${p.avatar}" alt="${m(p.name)}">
                    <div>
                        <h4 style="font-weight:700; color:#fff; font-size:15px;">${m(p.name)}</h4>
                        <span style="font-size:12px; color:var(--text-muted);">${p.isLeader?"Squad Captain":"Confirmed Member"}</span>
                    </div>
                </div>
            `;{const l=s.students.filter(r=>!i.includes(r.id)).filter(r=>r.primaryRole===c||r.secondaryRoles&&r.secondaryRoles.includes(c)).map(r=>({student:r,score:R(r,t)})).sort((r,u)=>u.score-r.score)[0];return l?`
                    <div class="roster-card matched">
                        <span class="roster-match-score badge badge-emerald">⚡ ${l.score}% Synergy</span>
                        <span class="roster-role-title" style="color:#22d3ee;">Needed: ${m(c)}</span>
                        <img class="roster-avatar" style="border-color:#10b981;" src="${l.student.avatar}" alt="${m(l.student.name)}">
                        <div>
                            <h4 style="font-weight:700; color:#fff; font-size:15px;">${m(l.student.name)}</h4>
                            <span style="font-size:12px; color:#38bdf8;">${m(l.student.university)}</span>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); line-height:1.3;">
                            Key: ${(l.student.skills||[]).slice(0,3).join(", ")}
                        </p>
                        <button class="btn btn-primary" style="width:100%; padding:6px 12px; font-size:12px; margin-top:4px;" onclick="window.inviteCandidate('${t.id}', '${l.student.id}', '${c}')">
                            Send Squad Invite
                        </button>
                    </div>
                `:`
                    <div class="roster-card">
                        <span class="roster-role-title" style="color:var(--accent-amber);">Needed: ${m(c)}</span>
                        <div class="slot-empty" style="width:68px; height:68px; font-size:24px;">?</div>
                        <div>
                            <h4 style="font-weight:700; color:#fff; font-size:14px;">Open Slot</h4>
                            <span style="font-size:12px; color:var(--text-muted);">No candidate in directory</span>
                        </div>
                    </div>
                `}}).join("");e.innerHTML=`
        <div style="background: rgba(0,0,0,0.3); padding: 18px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
                <h3 style="font-size: 18px; font-weight: 700; color: #fff;">${m(t.title)} — Autonomous Squad Assembly</h3>
                <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
                    Targeting 5-role complete squad coverage with maximum skill compatibility for ${m(t.hackathon)}.
                </p>
            </div>
            <button class="btn btn-primary" onclick="window.inviteAllRecommendations('${t.id}')">
                <span>⚡ 1-Click Invite All Missing Roles</span>
            </button>
        </div>

        <div class="roster-grid">
            ${o}
        </div>
    `}window.inviteAllRecommendations=function(n){const e=s.getProjectById(n);if(!e)return;const a=e.members.map(o=>o.assignedRole),t=e.requiredSquadRoles.filter(o=>!a.includes(o));let i=0;t.forEach(o=>{const c=e.members.map(d=>d.userId),p=s.students.filter(d=>!c.includes(d.id)).filter(d=>d.primaryRole===o||d.secondaryRoles&&d.secondaryRoles.includes(o))[0];p&&(window.inviteCandidate(n,p.id,o,!1),i++)}),f.play("success"),k(`Sent ${i} squad invitations automatically!`),B(),j()};window.inviteCandidate=function(n,e,a,t=!0){const i=s.getProjectById(n),o=s.getStudentById(e),c=s.getCurrentUser();if(!i||!o)return;if(s.requests.find(l=>l.projectId===n&&l.recipientId===e&&l.status==="pending")){t&&k(`Invitation already pending for ${o.name}`,"info");return}const d={id:`req-${Date.now()}-${Math.floor(Math.random()*1e3)}`,projectId:i.id,projectTitle:i.title,senderId:c.id,senderName:`${c.name} (${i.title})`,senderAvatar:c.avatar,senderRole:"Squad Lead",targetRole:a,recipientId:o.id,type:"invitation",status:"pending",note:`Hi ${o.name}! We saw your incredible hackathon work and would love for you to join our squad as our ${a} for ${i.hackathon}!`,matchScore:R(o,i),timestamp:"Just now"};s.requests.unshift(d),s.save(),B(),f.play("pop"),t&&k(`Invitation sent to ${o.name} for ${a}!`)};function L(){const n=document.getElementById("blueprints-container"),e=document.getElementById("copilot-track-select");if(!n)return;const a=e?e.value:"all",t=re.filter(i=>!(a!=="all"&&i.track!==a));n.innerHTML="",t.forEach(i=>{const o=document.createElement("div");o.className="blueprint-card";const c=i.techStack.map(d=>`<span class="skill-tag">${m(d)}</span>`).join(""),p=i.squadRoles.map(d=>`<span class="role-badge-secondary">${m(d)}</span>`).join("");o.innerHTML=`
            <div class="blueprint-header">
                <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="badge badge-purple">${m(i.hackathon)}</span>
                        <span class="badge badge-cyan">${m(i.track)}</span>
                    </div>
                    <h3 class="blueprint-title">${m(i.title)}</h3>
                    <p class="blueprint-tagline">${m(i.tagline)}</p>
                </div>
            </div>

            <div class="blueprint-section">
                <div class="blueprint-section-title">🚨 The Problem & Opportunity</div>
                <div class="blueprint-section-body">${m(i.problem)}</div>
            </div>

            <div class="blueprint-section">
                <div class="blueprint-section-title">💡 MVP Solution & Technical Architecture</div>
                <div class="blueprint-section-body">${m(i.solution)}</div>
            </div>

            <div class="blueprint-section">
                <div class="blueprint-section-title">🎤 3-Minute Demo Day Pitch Flow</div>
                <div class="blueprint-section-body">${m(i.demoScript)}</div>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
                <div style="font-size:11.5px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">Recommended 5-Role Squad Matrix:</div>
                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${p}
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
                <div style="font-size:11.5px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">Core Tech Stack:</div>
                <div class="skills-tags">
                    ${c}
                </div>
            </div>

            <div style="padding-top:8px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; color:#10b981; font-weight:600;">✨ Judge Edge: ${m(i.winningEdge)}</span>
                <button class="btn btn-primary" onclick="window.launchFromBlueprint('${i.id}')">
                    <span>🚀 Launch as Live Squad</span>
                </button>
            </div>
        `,n.appendChild(o)})}window.renderCopilot=L;window.launchFromBlueprint=function(n){const e=re.find(t=>t.id===n);if(!e)return;const a=document.getElementById("create-project-modal");a&&(document.getElementById("new-project-title").value=e.title,document.getElementById("new-project-tagline").value=e.tagline,document.getElementById("new-project-hackathon").value=e.hackathon,document.getElementById("new-project-track").value=e.track,document.getElementById("new-project-description").value=`${e.problem}

Our Solution:
${e.solution}`,document.getElementById("new-project-skills").value=e.techStack.join(", "),a.style.display="flex",f.play("click"),k(`Loaded blueprint "${e.title}". Review and publish!`))};function j(){const n=document.getElementById("requests-container");if(!n)return;const e=s.getCurrentUser(),t=s.projects.filter(o=>o.creatorId===e.id).map(o=>o.id);let i=[];if(s.inboxSubtab==="incoming"?i=s.requests.filter(o=>(o.recipientId===e.id||t.includes(o.projectId))&&o.senderId!==e.id):i=s.requests.filter(o=>o.senderId===e.id),n.innerHTML="",i.length===0){n.innerHTML=`
            <div style="text-align: center; padding: 48px; background: rgba(0,0,0,0.25); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <span style="font-size:36px;">📬</span>
                <p style="font-size: 15px; color: var(--text-muted); margin-top:10px;">No ${s.inboxSubtab} requests at this time.</p>
            </div>
        `;return}i.forEach(o=>{const c=document.createElement("div");c.className="request-card";const p=o.status==="pending",d=s.inboxSubtab==="incoming";c.innerHTML=`
            <div class="request-left">
                <img class="request-avatar" src="${o.senderAvatar}" alt="${m(o.senderName)}">
                <div class="request-details">
                    <div class="request-title-line">
                        <span class="request-sender-name">${m(o.senderName)}</span>
                        <span class="badge badge-purple">${o.type==="application"?"Application":"Team Invitation"}</span>
                        <span class="badge badge-cyan">Role: ${m(o.targetRole)}</span>
                        <span class="badge badge-emerald">${o.matchScore}% Match</span>
                    </div>
                    <div class="request-meta">Project: <strong>${m(o.projectTitle)}</strong> • Sent ${m(o.timestamp)}</div>
                    <p class="request-note">"${m(o.note)}"</p>
                </div>
            </div>

            <div class="request-actions">
                ${p&&d?`
                    <button class="btn btn-accept" onclick="window.acceptRequest('${o.id}')">Accept & Add to Squad</button>
                    <button class="btn btn-decline" onclick="window.declineRequest('${o.id}')">Decline</button>
                `:`
                    <span class="badge ${o.status==="accepted"?"badge-emerald":o.status==="declined"?"badge-rose":"badge-amber"}" style="padding: 6px 12px; font-size: 12px; text-transform: uppercase;">
                        ${o.status}
                    </span>
                `}
            </div>
        `,n.appendChild(c)})}window.acceptRequest=function(n){const e=s.requests.find(i=>i.id===n);if(!e)return;const a=s.getProjectById(e.projectId),t=s.getStudentById(e.senderId);if(a&&t){a.members.some(c=>c.userId===t.id)||a.members.push({userId:t.id,name:t.name,avatar:t.avatar,assignedRole:e.targetRole,isLeader:!1});const o=s.chats.find(c=>c.targetId===a.id);o&&o.messages.push({id:`m-${Date.now()}`,senderId:"system",senderName:"HackerThorne Bot",senderAvatar:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",text:`🎉 Squad Update: ${t.name} has officially joined the team as our ${e.targetRole}! Welcome aboard!`,timestamp:"Just now"})}e.status="accepted",s.save(),f.play("success"),B(),O(),k(`Accepted ${e.senderName}! ${e.targetRole} role is now filled on ${a?a.title:"the squad"}.`)};window.declineRequest=function(n){const e=s.requests.find(a=>a.id===n);e&&(e.status="declined",s.save(),B(),j(),k("Request declined."))};function D(){const n=document.getElementById("project-chats-list"),e=document.getElementById("dm-chats-list"),a=document.getElementById("chat-header"),t=document.getElementById("chat-messages");if(!n||!e||!a||!t)return;n.innerHTML="",s.chats.filter(d=>d.type==="team").forEach(d=>{const l=document.createElement("div");l.className=`chat-channel-item ${d.id===s.activeChatId?"active":""}`,l.innerHTML=`
            <span>#</span>
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m(d.title)}</span>
        `,l.addEventListener("click",()=>{s.activeChatId=d.id,f.play("click"),D()}),n.appendChild(l)}),e.innerHTML="",s.chats.filter(d=>d.type==="dm").forEach(d=>{const l=document.createElement("div");l.className=`chat-channel-item ${d.id===s.activeChatId?"active":""}`,l.innerHTML=`
            <img class="chat-channel-avatar" src="${d.avatar}" alt="${m(d.title)}">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m(d.title)}</span>
        `,l.addEventListener("click",()=>{s.activeChatId=d.id,f.play("click"),D()}),e.appendChild(l)});const c=s.chats.find(d=>d.id===s.activeChatId)||s.chats[0];if(!c)return;a.innerHTML=`
        <div style="display:flex; align-items:center; gap:12px;">
            ${c.type==="team"?`
                <div class="brand-icon" style="width:34px; height:34px; font-size:14px;">⚡</div>
            `:`
                <img src="${c.avatar}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" alt="${m(c.title)}">
            `}
            <div>
                <div class="chat-active-title">${m(c.title)}</div>
                <div style="font-size:11.5px; color:var(--text-dim);">${c.type==="team"?"Hackathon Squad Channel":"Direct Conversation"}</div>
            </div>
        </div>
    `,t.innerHTML="";const p=s.getCurrentUser();(c.messages||[]).forEach(d=>{const l=d.senderId===p.id,r=document.createElement("div");r.className=`chat-msg ${l?"self":""}`,r.innerHTML=`
            <img class="chat-msg-avatar" src="${d.senderAvatar}" alt="${m(d.senderName)}">
            <div class="chat-msg-content">
                <div class="chat-msg-author">
                    <span>${m(d.senderName)}</span>
                    <span class="chat-msg-time">${m(d.timestamp)}</span>
                </div>
                <div class="chat-msg-body">${m(d.text)}</div>
            </div>
        `,t.appendChild(r)}),t.scrollTop=t.scrollHeight}function be(n){n.preventDefault();const e=document.getElementById("chat-input");if(!e)return;const a=e.value.trim();if(!a)return;const t=s.chats.find(d=>d.id===s.activeChatId);if(!t)return;const i=s.getCurrentUser();if(a.startsWith("/task ")){const d=a.replace("/task ","").trim(),l=s.getProjectById(t.targetId)||s.projects[0];l&&(l.tasks||(l.tasks=[]),l.tasks.push({id:`t-${Date.now()}`,title:d,status:"backlog",priority:"high",role:"General",assignee:i.name}),s.save(),E(),f.play("task"),k(`Task created: "${d}"`))}else if(a==="/standup"){t.messages.push({id:`m-${Date.now()}`,senderId:i.id,senderName:i.name,senderAvatar:i.avatar,text:`📋 **Daily Hackathon Standup**
• Yesterday: Refactored architecture & tested endpoints
• Today: Building UI integration & Kanban sprint tasks
• Blockers: None currently. Ready for sprint push!`,timestamp:"Just now"}),e.value="",s.save(),f.play("pop"),D();return}else if(a==="/beacon"){t.messages.push({id:`m-${Date.now()}`,senderId:i.id,senderName:i.name,senderAvatar:i.avatar,text:"🚨 SQUAD BEACON: Actively recruiting missing roles for demo day! Check our Squad Hub for open positions.",timestamp:"Just now"}),e.value="",s.save(),f.play("pop"),D();return}const o={id:`m-${Date.now()}`,senderId:i.id,senderName:i.name,senderAvatar:i.avatar,text:a,timestamp:"Just now"};t.messages.push(o),e.value="",s.save(),f.play("pop"),D();const c=document.getElementById("chat-typing-bar"),p=document.getElementById("typing-username");if(c){c.style.display="flex";let d="Teammate";if(t.type==="dm"){const l=s.getStudentById(t.targetId);l&&(d=l.name)}else{const l=s.getProjectById(t.targetId);l&&l.members.length>1&&(d=(l.members.find(u=>u.userId!==s.currentUserId)||l.members[0]).name)}p&&(p.textContent=`${d} is typing...`)}setTimeout(()=>{c&&(c.style.display="none"),ke(t)},1100)}function ke(n,e){const a=["Sounds like a great plan! I'm pushing the updates to GitHub now.","Awesome! I'll test the API endpoints and check the response format.","Love this direction. I'll mock up the user flows in Figma so we have wireframes ready for demo day.","Got it! Let's synchronize before the hackathon submission deadline to finalize our pitch slides.","Perfect! That directly addresses what the hackathon judges will look for in the grading rubric."],t=a[Math.floor(Math.random()*a.length)];let i="Teammate",o="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";if(n.type==="dm"){const c=s.getStudentById(n.targetId);c&&(i=c.name,o=c.avatar)}else{const c=s.getProjectById(n.targetId);if(c&&c.members.length>1){const p=c.members.find(d=>d.userId!==s.currentUserId)||c.members[0];i=p.name,o=p.avatar}}n.messages.push({id:`m-reply-${Date.now()}`,senderId:"teammate-auto",senderName:i,senderAvatar:o,text:t,timestamp:"Just now"}),s.save(),f.play("pop"),s.activeChatId===n.id&&s.activeView==="chat"&&D()}window.startDirectMessage=function(n){const e=document.getElementById("project-detail-modal");e&&(e.style.display="none");const a=document.getElementById("candidate-modal");a&&(a.style.display="none");const t=s.getStudentById(n);if(!t)return;let i=s.chats.find(o=>o.type==="dm"&&o.targetId===n);i||(i={id:`chat-dm-${t.id}`,type:"dm",targetId:t.id,title:`${t.name} (${t.primaryRole.split(" ")[0]})`,avatar:t.avatar,messages:[{id:`dm-init-${Date.now()}`,senderId:t.id,senderName:t.name,senderAvatar:t.avatar,text:"Hey there! Excited to connect for the upcoming hackathon season!",timestamp:"Just now"}]},s.chats.push(i),s.save()),s.activeChatId=i.id,$("chat")};window.openApplyModal=function(n,e=null){M=n;const a=s.getProjectById(n);if(!a)return;const t=document.getElementById("apply-modal"),i=document.getElementById("apply-modal-title"),o=document.getElementById("apply-modal-desc"),c=document.getElementById("apply-role-select"),p=document.getElementById("apply-note");i&&(i.textContent=`Apply to ${a.title}`),o&&(o.textContent=`Target Event: ${a.hackathon} • Track: ${a.track}`);const d=a.members.map(g=>g.assignedRole),l=a.requiredSquadRoles.filter(g=>!d.includes(g)),r=l.length>0?l:a.requiredSquadRoles;c&&(c.innerHTML="",r.forEach(g=>{const v=document.createElement("option");v.value=g,v.textContent=g,e&&g===e&&(v.selected=!0),c.appendChild(v)}));const u=s.getCurrentUser();p&&(p.value=`Hey team! I'm ${u.name} studying ${u.major} at ${u.university}. I'd love to join as your ${e||r[0]}! I have experience in ${(u.skills||[]).slice(0,3).join(", ")} and ${u.availability} availability.`),t&&(t.style.display="flex"),f.play("click")};window.openInviteModal=function(n){const e=s.getStudentById(n);if(!e)return;const a=s.getCurrentUser(),i=s.projects.filter(o=>o.creatorId===a.id)[0]||s.projects[0];window.inviteCandidate(i.id,e.id,e.primaryRole)};function xe(n){n.preventDefault();const e=s.getProjectById(M);if(!e)return;const a=document.getElementById("apply-role-select"),t=document.getElementById("apply-note"),i=document.getElementById("apply-modal"),o=s.getCurrentUser(),c=a?a.value:"Member",p=t?t.value.trim():"",d={id:`req-${Date.now()}`,projectId:e.id,projectTitle:e.title,senderId:o.id,senderName:o.name,senderAvatar:o.avatar,senderRole:o.primaryRole,targetRole:c,recipientId:e.creatorId,type:"application",status:"pending",note:p,matchScore:R(o,e),timestamp:"Just now"};s.requests.unshift(d),s.save(),i&&(i.style.display="none"),f.play("success"),k(`Application submitted for ${e.title}!`),B(),j()}function we(n){n.preventDefault();const e=document.getElementById("new-project-title").value.trim(),a=document.getElementById("new-project-tagline").value.trim(),t=document.getElementById("new-project-hackathon").value,i=document.getElementById("new-project-track").value.trim(),o=document.getElementById("new-project-commitment").value.trim(),c=document.getElementById("new-project-deadline").value.trim(),p=document.getElementById("new-project-description").value.trim(),d=document.getElementById("new-project-skills").value.trim(),l=Array.from(document.querySelectorAll('#new-project-roles input[type="checkbox"]:checked')).map(T=>T.value),r=l.length>0?l:["Frontend Developer","UI/UX Designer","Pitch / Presenter"],u=s.getCurrentUser(),g=d?d.split(",").map(T=>T.trim()).filter(Boolean):["React","Python","Figma"],v={id:`proj-${Date.now()}`,title:e,tagline:a,description:p,hackathon:t,track:i,timeCommitment:o,deadline:c,status:"Recruiting Missing Roles",creatorId:u.id,requiredSquadRoles:r,requiredSkills:g,members:[{userId:u.id,name:u.name,avatar:u.avatar,assignedRole:u.primaryRole,isLeader:!0}],tasks:[{id:`t-${Date.now()}-1`,title:"Define hackathon MVP scope and architecture",status:"done",priority:"urgent",role:"General",assignee:u.name},{id:`t-${Date.now()}-2`,title:"Recruit missing squad roles and conduct kickoff sync",status:"in_progress",priority:"high",role:"General",assignee:u.name},{id:`t-${Date.now()}-3`,title:"Build high-fidelity prototype and demo video",status:"backlog",priority:"medium",role:"General",assignee:"Unassigned"}],devpostDraft:{inspiration:`${a}. Built specifically for ${t}.`,whatItDoes:p,howWeBuiltIt:`Built using ${g.join(", ")}.`,challenges:"Scoping an ambitious MVP for a 36-hour collegiate hackathon sprint.",accomplishments:"Successfully assembled a complementary 5-person squad on HackerThorne."}},I={id:`chat-${v.id}`,type:"team",targetId:v.id,title:`${e} Hub`,avatar:u.avatar,channel:"#general",messages:[{id:`m-init-${Date.now()}`,senderId:u.id,senderName:u.name,senderAvatar:u.avatar,text:`Welcome to ${e}! Project is live on HackerThorne. Let's assemble our squad and build something awesome!`,timestamp:"Just now"}]};s.projects.unshift(v),s.chats.unshift(I),s.save();const b=document.getElementById("create-project-modal");b&&(b.style.display="none");const w=document.getElementById("create-project-form");w&&w.reset(),f.play("success"),k(`Project "${e}" published successfully!`),E(),$("projects")}document.addEventListener("DOMContentLoaded",ge);
