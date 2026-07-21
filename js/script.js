/* ============================================================
   PORTFOLIO v5.1 — intro, scramble titles + telemetry, waves,
   story split, project carousel/modal, A* path planning game
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/*#";

  /* ---------- data ---------- */
  const PROJECTS = [
    {t:"Quadruped Locomotion Policy Deployment (TensorRT + ROS 2)", g:"images/Project Gifs/TRT Locomotion.gif",
     d:"A reinforcement learning locomotion policy for ANYmal-C, trained in NVIDIA Isaac Lab and deployed the way most projects skip. The policy exports to ONNX, compiles to a TensorRT engine, and runs inside a C++ ROS 2 node that closes the control loop against Isaac Sim at 50 Hz, walking uneven terrain with a 187 ray height scanner and following waypoints from a second planning node. Instrumenting the loop revealed the policy was acting on state that was already 10 ms stale, and moving inference into the state callback cut end to end latency 9x with no change to inference time.",
     l:"https://github.com/varunlakshmanan11/quad-locomotion-deployment", b:"1.3 ms E2E",
     m:[["END-TO-END","1.3 ms"],["REDUCTION","9x"]]},
    {t:"FireDroneX: Autonomous UAV Fire Detection", g:"images/Project Gifs/FiredroneX.gif",
     d:"FireDroneX is an autonomous UAV system that detects and localizes fire using computer vision and monocular depth estimation. Built with ROS 2 and PX4, it integrates YOLO for real-time fire detection and uses offboard control with PID based trajectory planning for smooth, responsive aerial navigation in simulated emergency scenarios.",
     l:"https://github.com/varunlakshmanan11/FireDroneX", b:"1.2 m ACC",
     m:[["LOCALIZATION","1.2 m ACCURACY"],["LATENCY","<100 ms (VOXL 2)"],["STACK","ROS 2 / PX4 / YOLO"]]},
    {t:"Perception Based Robot Navigation", g:"images/Project Gifs/Turtlebot Challenge.gif",
     d:"A perception system for a TurtleBot3 robot navigating a dynamic real world environment. OpenCV driven detection and tracking, including optical flow, stop sign detection, homography and horizon line segmentation, gives the robot the information it needs to navigate safely.",
     l:"https://github.com/varunlakshmanan11/Perception-Based-Robot-Navigation", b:"REAL-TIME",
     m:[["PLATFORM","TURTLEBOT3 (REAL)"],["STACK","OPENCV / PYTHON"],["MODE","REAL-TIME ONBOARD"]]},
    {t:"Multi-Robot Navigation Using Centralized & Decentralized MCTS", g:"images/Project Gifs/MCTS.gif",
     d:"Monte Carlo Tree Search for multi robot navigation in a dynamic environment. Four TurtleBot3 Waffle robots coordinate through moving obstacles in Gazebo, with centralized and decentralized planners compared head to head on path efficiency and convergence.",
     l:"https://github.com/varunlakshmanan11/Multi-Robot-Navigation-Using-Centralized-and-Decentralized-Monte-Carlo-Tree-Search", b:"4 ROBOTS",
     m:[["ROBOTS","4 X TURTLEBOT3"],["PLANNERS","CENTRAL + DECENTRAL"],["ARENA","DYNAMIC OBSTACLES"]]},
    {t:"Dueling Double DQN on TurtleBot3 in Dynamic Environments", g:"images/Project Gifs/DRL project.gif",
     d:"Evaluates Dueling Double Deep Q Networks against vanilla DQN for navigation in a dynamic Gazebo simulation. Dueling state value streams, double Q updates, and deeper nonlinear layers deliver more reliable decision making around moving obstacles.",
     l:"https://github.com/varunlakshmanan11/Performance-Analysis-of-Dueling-Double-DQN-on-TurtleBot3-navigating-in-dynamic-environment", b:"75% / 5K",
     m:[["SUCCESS","75% COMPLETION"],["TRIALS","5,000"],["BASELINE","VANILLA DQN"]]},
    {t:"Adaptive Text-to-Command Translation for Robot Navigation", g:"images/Project Gifs/NLP Project.gif",
     d:"Natural language robot control: a fine tuned T5-Small model translates plain English instructions into navigation command sequences, trained on a custom dataset of 24,581 instructions and refined with low rank adaptation.",
     l:"https://github.com/varunlakshmanan11/Adaptive-Text-to-Command-Translation-for-Robot-Navigation", b:"98% ACC",
     m:[["MODEL","T5-SMALL + LORA"],["DATASET","24,581 INSTRUCTIONS"],["ACCURACY","98%"]]},
    {t:"A* Algorithm Implementation for a Rigid Robot", g:"images/Project Gifs/A STAR.gif",
     d:"A* search implemented for a TurtleBot3 navigating a custom built Gazebo world. Five action discrete movement, heuristic balanced optimal paths, and OpenCV visualization of the evolving search in real time.",
     l:"https://github.com/varunlakshmanan11/A_star-Algorithm-Implementation-for-a-Rigid-Robot", b:"A* SEARCH",
     m:[["PLANNER","A* (5-ACTION SET)"],["VIZ","OPENCV LIVE SEARCH"],["SIM","GAZEBO TURTLEBOT3"]]},
    {t:"Alpha: Mobile Pick and Place Manipulator", g:"images/Project Gifs/MPAP.gif",
     d:"A mobile pick and place manipulator designed in SolidWorks, exported as URDF, and simulated in Gazebo with teleoperation, open loop control, and inverse kinematics for precise operation under dynamic conditions.",
     l:"https://github.com/varunlakshmanan11/Mobile-Pick-and-Place-Manipulator", b:"IK CONTROL",
     m:[["DESIGN","SOLIDWORKS TO URDF"],["CONTROL","IK + TELEOP"],["SIM","ROS 2 GAZEBO"]]},
    {t:"Gesture-Based Control in Assistive Technology", g:"images/Project Gifs/HRI.gif",
     d:"Assistive gesture control with Google's MediaPipe: hand gestures from a webcam are classified in real time and mapped to control a DexHand in ROS 2 simulation and a physical TurtleBot. Intuitive robotics for accessibility.",
     l:"https://github.com/varunlakshmanan11/Gesture-Based-Control-in-Assistive-Technology", b:"MEDIAPIPE",
     m:[["TRACKING","REAL-TIME WEBCAM"],["TARGETS","DEXHAND + TURTLEBOT3"],["STACK","MEDIAPIPE / ROS 2"]]},
    {t:"Performance Analysis of RRT Path Planning Variants", g:"images/Project Gifs/RRT.gif",
     d:"A comparative study of RRT, RRT*, Informed RRT*, Quick RRT* and Quick Informed RRT* in 2D, then deployed to a TurtleBot3 in Gazebo with a PID controller to validate performance in 3D simulation.",
     l:"https://github.com/varunlakshmanan11/Performance-Analysis-of-RRT-Variants", b:"10K ITERS",
     m:[["ITERATIONS","10,000 BENCHMARK"],["BEST","QUICK RRT*"],["CONTROL","PID TRACKING"]]},
    {t:"Motion Planning of PANDA Robot Using MoveIt", g:"images/Project Gifs/Panda.gif",
     d:"A ROS 2 simulation of a Franka Panda arm running a complete pick and place workflow in MoveIt. Collision free end effector trajectories across multiple goal poses within a fully configured planning scene.",
     l:"https://github.com/varunlakshmanan11/Motion-Planning-of-PANDA-Manipulator-Using-MoveIt", b:"MOVEIT",
     m:[["ARM","FRANKA PANDA"],["PIPELINE","MOVEIT 2 (C++)"],["TASK","PICK & PLACE"]]}
  ];

  const SKILLS = [
    ["Programming Languages",[["Python","Python-Emblem.png","https://www.python.org/"],["C++","cpp_logo.png","https://isocpp.org/"],["MATLAB","Matlab_Logo.png","https://www.mathworks.com/products/matlab.html"]]],
    ["Robotics Frameworks",[["ROS 2","ROS.png","https://www.ros.org/"],["MoveIt","MoveIt.png","https://moveit.ros.org/"]]],
    ["Simulation Software",[["Gazebo","gazebo-logo-51C46471CA-seeklogo.com.png","https://gazebosim.org/"],["Isaac Sim","Isaac.png","https://developer.nvidia.com/isaac/sim"],["Isaac Lab","Isaac.png","https://isaac-sim.github.io/IsaacLab/"],["MuJoCo","Mujoco.jpeg","https://mujoco.org/"]]],
    ["Machine Learning",[["PyTorch","Pytorch.png","https://pytorch.org/"],["TensorFlow","Tensorflow.png","https://www.tensorflow.org/"],["Scikit-learn","Scikit Learn.png","https://scikit-learn.org/"]]],
    ["GPU & Deployment",[["CUDA C/C++","CUDA.png","https://developer.nvidia.com/cuda-toolkit"],["Docker","Docker.png","https://www.docker.com/"],["Linux","Linux.png","https://www.kernel.org/"]]],
    ["Tools & Libraries",[["OpenCV","OpenCV_logo_black.png","https://opencv.org/"],["NumPy","Numpy.png","https://numpy.org/"],["Pandas","Pandas.png","https://pandas.pydata.org/"],["SciPy","scipy.png","https://scipy.org/"],["MediaPipe","Mediapipe.png","https://developers.google.com/mediapipe"],["NLTK","NLTK.png","https://www.nltk.org/"],["Git","Git.png","https://git-scm.com/"]]],
    ["CAD Software",[["AutoCAD","Autocad.webp","https://www.autodesk.com/products/autocad/overview"],["Fusion 360","AutoDesk Fusion 360.png","https://www.autodesk.com/products/fusion-360/overview"],["Creo","Creo.png","https://www.ptc.com/en/products/creo"],["SolidWorks","Solidworks.webp","https://www.solidworks.com/"]]]
  ];

  const CERTS = [
    ["Getting Started with Accelerated Computing in Modern CUDA C++","NVIDIA","SEP 2025","Thrust Library / GPU Computing / CUDA Kernels / CUDA Streams / Nsight Systems"],
    ["Machine Learning Specialization","DeepLearning.AI / Stanford University","SEP 2024","Machine Learning / Logistic Regression / Neural Networks / Decision Trees / Recommender Systems"],
    ["Python (Complete Bootcamp)","Udemy","NOV 2022","Python / Object Oriented Programming (OOP)"],
    ["Virtual Internship on Electric Vehicles","TVS Training and Services","SEP 2021","Hybrid Electric Vehicles / Powertrain Fundamentals"],
    ["Introduction and Programming with IoT Boards","Coursera","AUG 2020","Arduino / Raspberry Pi / Embedded Systems"],
    ["AutoCAD (3D Computer Aided Design)","Go Tech Solutions","JUN 2019","3D CAD / AutoCAD / Engineering Drawing"]
  ];

  /* ---------- scramble helpers ---------- */
  function scrambleEl(el, txt, speed){
    txt = txt !== undefined ? txt : el.dataset.text;
    let frame=0; const total=Math.max(18, txt.length*2);
    const iv=setInterval(()=>{
      frame++;
      el.textContent=txt.split("").map((c,i)=> c===" "?" ": (i<(frame/total)*txt.length? c : CHARS[Math.floor(Math.random()*CHARS.length)])).join("");
      if(frame>=total){clearInterval(iv);el.textContent=txt;}
    },speed||24);
  }

  /* ---------- intro ---------- */
  const intro=document.getElementById("intro"), introName=document.getElementById("intro-name");
  const navTitle=document.getElementById("nav-title"), mobileTitle=document.querySelector(".mobile-title");
  const heroPhoto=document.getElementById("hero-photo");
  function finishIntro(instant){
    intro && intro.classList.add("done");
    navTitle && navTitle.classList.add("shown");
    mobileTitle && mobileTitle.classList.add("shown");
    setTimeout(()=> heroPhoto && heroPhoto.classList.add("revealed"), instant?0:250);
  }
  if (!intro || reduced || sessionStorage.getItem("introPlayed")) {
    document.body.classList.add("intro-skip"); finishIntro(true);
  } else {
    sessionStorage.setItem("introPlayed","1");
    requestAnimationFrame(()=>requestAnimationFrame(()=>introName.classList.add("go")));
    setTimeout(()=>{
      const target = navTitle.offsetParent !== null ? navTitle : mobileTitle;
      if (target){
        const t=target.getBoundingClientRect(), s=introName.getBoundingClientRect();
        const scale=Math.min(t.height/s.height,0.5);
        introName.style.transform=`translate(${(t.left+t.width/2)-(s.left+s.width/2)}px, ${(t.top+t.height/2)-(s.top+s.height/2)}px) scale(${scale})`;
        introName.style.textShadow="none";
      }
    },600);
    setTimeout(()=>finishIntro(false),950);
  }

  /* ---------- mobile nav + hero tap ---------- */
  const menuIcon=document.getElementById("menu-icon"), mobileNav=document.getElementById("mobile-nav");
  const heroLeft=document.querySelector(".hero-left");
  function closeHeroTap(){heroLeft.classList.remove("tapped");}
  menuIcon.addEventListener("click",()=>{mobileNav.classList.toggle("active");closeHeroTap();});
  document.querySelectorAll(".mobile-nav a, .nav-links a").forEach(a=>a.addEventListener("click",()=>{mobileNav.classList.remove("active");closeHeroTap();}));
  if (coarse){
    heroLeft.addEventListener("click",e=>{
      if(!heroLeft.classList.contains("tapped")){
        if(!e.target.closest(".cv-button")){e.preventDefault();heroLeft.classList.add("tapped");}
      }
    });
    document.addEventListener("click",e=>{if(!heroLeft.contains(e.target))closeHeroTap();});
    const hint=document.querySelector(".hover-hint");if(hint)hint.textContent="Tap the photo to read about me";
  }

  /* ---------- waves ---------- */
  /* frequency-modulated signal trace (oscilloscope style), seamless 800px loop */
  const sigPath=(A,N,beta,envN,off)=>{
    const P=800;let d="";
    for(let x=0;x<=1600;x+=3){
      const env=.25+.75*Math.abs(Math.sin(Math.PI*envN*x/P));
      const y=60+off+A*env*Math.sin(2*Math.PI*N*x/P+beta*Math.sin(2*Math.PI*x/P));
      d+=(x?` L${x} ${y.toFixed(1)}`:`M${x} ${y.toFixed(1)}`);
    }
    return d;
  };
  document.querySelectorAll(".wave-section").forEach(sec=>{
    const div=document.createElement("div");div.className="waves";div.setAttribute("aria-hidden","true");
    div.innerHTML=
      `<svg viewBox="0 0 1600 120" preserveAspectRatio="none" style="top:10%"><path d="${sigPath(30,26,12,2,0)}" fill="none" stroke="#E63946" stroke-opacity=".11" stroke-width="1.6"/></svg>`+
      `<svg class="w2" viewBox="0 0 1600 120" preserveAspectRatio="none" style="top:56%"><path d="${sigPath(38,17,9,3,8)}" fill="none" stroke="#E63946" stroke-opacity=".07" stroke-width="1.4"/></svg>`;
    sec.prepend(div);
  });

  /* ---------- section titles ---------- */
  const titleObs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      titleObs.unobserve(en.target);
      const sec=en.target.closest("section");
      if(reduced){en.target.textContent=en.target.dataset.text;sec.classList.add("title-docked");return;}
      scrambleEl(en.target,undefined,28);
      setTimeout(()=>sec.classList.add("title-docked"), en.target.dataset.text.length*2*28+150);
    });
  },{threshold:.4});
  document.querySelectorAll(".scramble-title").forEach(t=>{t.textContent="";titleObs.observe(t);});

  /* ---------- story grids: come together + split, telemetry scrambles ---------- */
  const gridObs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      gridObs.unobserve(en.target);
      en.target.classList.add("go");
      en.target.querySelectorAll(".tv.scr").forEach((v,i)=>{
        if(reduced){v.textContent=v.dataset.text;return;}
        setTimeout(()=>scrambleEl(v,undefined,30), 350+i*180);
      });
    });
  },{threshold:.35});
  document.querySelectorAll(".story-grid").forEach(g=>gridObs.observe(g));
  if(reduced)document.querySelectorAll(".story-grid").forEach(g=>g.classList.add("go"));

  /* ---------- project carousel ---------- */
  const pv=document.getElementById("projViewport");
  PROJECTS.forEach((p,i)=>{
    const s=document.createElement("div");s.className="car-slide";s.dataset.i=i;
    s.innerHTML=`<div class="proj-card"><img src="${p.g}" alt="${p.t}" loading="lazy">
      <div class="proj-name">${p.t}</div></div>`;
    pv.appendChild(s);
  });

  const visibleCars=new Set();
  document.querySelectorAll(".carousel").forEach(car=>{
    const viewport=car.querySelector(".car-viewport");
    const slides=[...viewport.querySelectorAll(".car-slide")];
    const dotsWrap=car.parentElement.querySelector(".car-dots");
    let cur=0;
    const dots=slides.map((_,i)=>{const b=document.createElement("button");b.ariaLabel="Item "+(i+1);b.onclick=()=>go(i);dotsWrap.appendChild(b);return b;});
    function render(){const n=slides.length;slides.forEach((s,i)=>{s.classList.remove("center","left","right");
      if(i===cur)s.classList.add("center");
      else if(i===(cur-1+n)%n)s.classList.add("left");
      else if(i===(cur+1)%n)s.classList.add("right");});
      dots.forEach((d,i)=>d.classList.toggle("on",i===cur));}
    function go(i){cur=(i+slides.length)%slides.length;render();}
    car._go=go;car._cur=()=>cur;
    car.querySelector(".car-arrow.left").onclick=()=>go(cur-1);
    car.querySelector(".car-arrow.right").onclick=()=>go(cur+1);
    slides.forEach((s,i)=>s.addEventListener("click",()=>{ if(i!==cur){go(i);} else {openModal(PROJECTS[+s.dataset.i]);}}));
    let sx=null;
    viewport.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;},{passive:true});
    viewport.addEventListener("touchend",e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1));sx=null;},{passive:true});
    new IntersectionObserver(en=>en.forEach(x=>x.isIntersecting?visibleCars.add(car):visibleCars.delete(car)),{threshold:.3}).observe(car);
    render();
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape")return closeModal();
    if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return;
    if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
    const car=visibleCars.values().next().value;if(!car)return;
    car._go(car._cur()+(e.key==="ArrowRight"?1:-1));
  });

  /* ---------- modal with scrambling metrics ---------- */
  const modal=document.getElementById("projModal");
  function openModal(p){
    document.getElementById("modalGif").src=p.g;
    document.getElementById("modalTitle").textContent=p.t;
    document.getElementById("modalDesc").textContent=p.d;
    document.getElementById("modalLink").href=p.l;
    const tele=document.getElementById("modalTele");
    tele.innerHTML=p.m.map(([k,v])=>
      `<div class="tele-item"><span class="tl mono">${k}</span><span class="tv" data-text="${v}"></span></div>`).join("");
    modal.classList.add("open");modal.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
    tele.querySelectorAll(".tv").forEach((v,i)=>{
      if(reduced){v.textContent=v.dataset.text;return;}
      setTimeout(()=>scrambleEl(v,undefined,26), 420+i*160);
    });
  }
  function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";}
  modal.addEventListener("click",e=>{if(!e.target.closest("#modalLink"))closeModal();});
  document.getElementById("modalClose").onclick=closeModal;

  /* ---------- skills grid ---------- */
  const sg=document.getElementById("skillGrid");
  SKILLS.forEach(([cat,items])=>{
    const c=document.createElement("div");c.className="skill-cat";
    c.innerHTML=`<h3>${cat}</h3><ul>`+
      items.map(([n,img,url])=>`<li><a href="${url}" target="_blank" rel="noopener"><img src="images/Skills Logo/${img}" alt="${n}">${n}</a></li>`).join("")+`</ul>`;
    sg.appendChild(c);
  });

  /* ---------- certificates ---------- */
  const cg=document.getElementById("certGrid");
  CERTS.forEach(([t,iss,date,skills])=>{
    const c=document.createElement("div");c.className="cert-card";
    c.innerHTML=`<h3>${t}</h3><p class="cert-issuer">${iss}</p><p class="cert-date">ISSUED ${date}</p>
      <div class="cert-skills"><span>SKILLS //</span> ${skills}</div>
      <p class="cert-toggle"><span class="plus"></span></p>`;
    c.onclick=()=>c.classList.toggle("expanded");
    cg.appendChild(c);
  });

  /* ---------- HUD form ---------- */
  const form=document.getElementById("contactForm"), fm=document.getElementById("formMessage");
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    fm.textContent="SENDING...";fm.classList.remove("success");
    try{
      const res=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});
      if(res.ok){fm.textContent="MESSAGE SENT. I WILL GET BACK TO YOU SOON.";fm.classList.add("success");form.reset();}
      else{fm.textContent="SOMETHING WENT WRONG. TRY AGAIN OR EMAIL ME DIRECTLY.";}
    }catch{fm.textContent="SOMETHING WENT WRONG. TRY AGAIN OR EMAIL ME DIRECTLY.";}
  });

  /* ---------- A* PATH PLANNING GAME ---------- */
  const cv=document.getElementById("botCanvas");if(!cv)return;
  const ctx=cv.getContext("2d");
  const N=24, CELL=cv.width/N;
  let grid,bot,goal=null,path=[],explored=new Set(),score=0,animId=null,driving=false;
  const statusEl=document.getElementById("simStatus"),scoreEl=document.getElementById("simScore");
  const pLen=document.getElementById("p1"),pExp=document.getElementById("p2");
  const key=(x,y)=>x+","+y;
  function genMap(){
    grid=Array.from({length:N},()=>Array(N).fill(0));
    for(let b=0;b<26;b++){
      const x=Math.floor(Math.random()*N),y=Math.floor(Math.random()*N),len=2+Math.floor(Math.random()*4),horiz=Math.random()<.5;
      for(let i=0;i<len;i++){const cx=horiz?x+i:x,cy=horiz?y:y+i;if(cx<N&&cy<N)grid[cy][cx]=1;}
    }
    bot={x:Math.floor(N/2),y:N-3,px:0,py:0,ang:-Math.PI/2};
    grid[bot.y][bot.x]=0;grid[bot.y-1][bot.x]=0;
    bot.px=(bot.x+.5)*CELL;bot.py=(bot.y+.5)*CELL;
    goal=null;path=[];explored=new Set();driving=false;
    pLen.textContent="0";pExp.textContent="0";
  }
  function astar(sx,sy,gx,gy){
    const open=[{x:sx,y:sy,g:0,f:Math.abs(gx-sx)+Math.abs(gy-sy)}];
    const came={},gScore={[key(sx,sy)]:0};explored=new Set();
    while(open.length){
      open.sort((a,b)=>a.f-b.f);
      const c=open.shift();const ck=key(c.x,c.y);
      explored.add(ck);
      if(c.x===gx&&c.y===gy){
        const p=[[c.x,c.y]];let k=ck;
        while(came[k]){p.unshift(came[k]);k=key(came[k][0],came[k][1]);}
        return p;
      }
      for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){
        const nx=c.x+dx,ny=c.y+dy;
        if(nx<0||ny<0||nx>=N||ny>=N||grid[ny][nx])continue;
        const nk=key(nx,ny),ng=c.g+1;
        if(nk in gScore&&gScore[nk]<=ng)continue;
        gScore[nk]=ng;came[nk]=[c.x,c.y];
        open.push({x:nx,y:ny,g:ng,f:ng+Math.abs(gx-nx)+Math.abs(gy-ny)});
      }
    }
    return null;
  }
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.strokeStyle="rgba(79,217,240,.10)";ctx.lineWidth=1;
    for(let i=0;i<=N;i++){ctx.beginPath();ctx.moveTo(i*CELL,0);ctx.lineTo(i*CELL,cv.height);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,i*CELL);ctx.lineTo(cv.width,i*CELL);ctx.stroke();}
    explored.forEach(k=>{const[x,y]=k.split(",").map(Number);
      ctx.fillStyle="rgba(79,217,240,.06)";ctx.fillRect(x*CELL,y*CELL,CELL,CELL);});
    for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(grid[y][x]){
      ctx.fillStyle="rgba(230,57,70,.16)";ctx.fillRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);
      ctx.strokeStyle="rgba(230,57,70,.55)";ctx.strokeRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);}
    if(path.length){ctx.beginPath();ctx.strokeStyle="rgba(79,217,240,.85)";ctx.lineWidth=3;ctx.lineJoin="round";
      path.forEach(([x,y],i)=>{const px=(x+.5)*CELL,py=(y+.5)*CELL;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();}
    if(goal){const gx=(goal[0]+.5)*CELL,gy=(goal[1]+.5)*CELL;
      ctx.strokeStyle="#4FD9F0";ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(gx,gy,CELL*.36,0,7);ctx.stroke();
      ctx.beginPath();ctx.moveTo(gx-CELL*.55,gy);ctx.lineTo(gx+CELL*.55,gy);ctx.moveTo(gx,gy-CELL*.55);ctx.lineTo(gx,gy+CELL*.55);ctx.stroke();}
    // robot (turtlebot style)
    ctx.save();ctx.translate(bot.px,bot.py);ctx.rotate(bot.ang);
    ctx.beginPath();ctx.arc(0,0,CELL*.4,0,7);ctx.fillStyle="#E63946";ctx.fill();
    ctx.strokeStyle="#F2F4F8";ctx.lineWidth=2;ctx.stroke();
    ctx.beginPath();ctx.moveTo(CELL*.4,0);ctx.lineTo(CELL*.12,-CELL*.16);ctx.lineTo(CELL*.12,CELL*.16);ctx.closePath();
    ctx.fillStyle="#F2F4F8";ctx.fill();ctx.restore();
  }
  function drive(){
    if(path.length<2){driving=false;score++;scoreEl.textContent=score;
      statusEl.textContent="STATUS: TARGET REACHED \u2713";
      bot.x=goal[0];bot.y=goal[1];return;}
    const[nx,ny]=path[1];
    const tx=(nx+.5)*CELL,ty=(ny+.5)*CELL;
    const dx=tx-bot.px,dy=ty-bot.py,d=Math.hypot(dx,dy);
    bot.ang=Math.atan2(dy,dx);
    const sp=Math.max(2.4,CELL/9);
    if(d<=sp){bot.px=tx;bot.py=ty;bot.x=nx;bot.y=ny;path.shift();}
    else{bot.px+=dx/d*sp;bot.py+=dy/d*sp;}
    draw();
    animId=requestAnimationFrame(drive);
  }
  cv.addEventListener("click",e=>{
    const r=cv.getBoundingClientRect();
    const x=Math.floor((e.clientX-r.left)*cv.width/r.width/CELL);
    const y=Math.floor((e.clientY-r.top)*cv.height/r.height/CELL);
    if(x<0||y<0||x>=N||y>=N)return;
    if(grid[y][x]){statusEl.textContent="STATUS: CELL BLOCKED";draw();return;}
    cancelAnimationFrame(animId);
    goal=[x,y];
    statusEl.textContent="STATUS: PLANNING...";
    const p=astar(bot.x,bot.y,x,y);
    if(!p){statusEl.textContent="STATUS: NO PATH FOUND";path=[];draw();return;}
    path=p;pLen.textContent=p.length-1;pExp.textContent=explored.size;
    statusEl.textContent="STATUS: EXECUTING...";
    driving=true;drive();
  });
  document.getElementById("simReset").onclick=()=>{cancelAnimationFrame(animId);genMap();statusEl.textContent="STATUS: IDLE";draw();};
  genMap();draw();
});
