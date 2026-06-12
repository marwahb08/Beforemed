type MockResponse = {
  keywords: string[]
  reply: string
}

export const MOCK_SCORES: Record<string, number> = {
  surgery: 48,
  emergency: 44,
  general: 46,
  'surgeon-day': 52,
}

/**
 * Suggested next-action choices shown beneath the chat in mock mode (no real
 * Claude key). Each specialty has several rotating sets so the choices change
 * as the conversation progresses. Real mode gets these from Claude instead.
 */
export const MOCK_OPTIONS: Record<string, string[][]> = {
  surgery: [
    ['When did the pain start?', 'Can you describe the pain?', 'Does it spread anywhere?'],
    ['Have you felt feverish?', 'Any nausea or vomiting?', 'When did you last eat?'],
    ['Any change in your bowel habits?', 'Do you have any allergies?', 'Are you on any medication?'],
    ['May I examine your abdomen?', 'Any past operations?', "What's worrying you most?"],
  ],
  emergency: [
    ['When did this start?', 'Have you used an inhaler?', 'Can you speak in sentences?'],
    ["I'm putting you on oxygen now", 'What triggered this today?', 'Do you have asthma?'],
    ['Any allergies to medicines?', 'Have you been admitted before?', 'Try to slow your breathing'],
    ['Start a salbutamol nebuliser', 'Check her oxygen levels', 'Call for senior help'],
  ],
  general: [
    ['How long has this been going on?', 'How much weight have you lost?', 'Any night sweats?'],
    ['Have you noticed any lumps?', 'Any itching or rashes?', 'How is your appetite?'],
    ['May I examine your neck?', 'Do you smoke or drink?', 'Any family history of cancer?'],
    ['What medication do you take?', 'Any other symptoms?', 'How are things at work?'],
  ],
  'surgeon-day': [
    ['Introduce yourself to Mr. Hassan', 'Ask how he slept', 'Confirm he fasted since midnight'],
    ['Check his consent form is signed', 'Ask if he has any questions', 'Explain the operation simply'],
    ['Confirm the patient identity', 'Check his allergy status', 'Ask about equipment concerns'],
    ['Call your consultant for advice', 'Proceed carefully with the dissection', 'Convert to open surgery'],
    ['Reassure Mrs. Hassan gently', 'Explain the biopsy honestly', "Don't give a diagnosis yet"],
  ],
}

export const MOCK_RESPONSES: Record<string, MockResponse[]> = {
  surgery: [
    {
      keywords: ['pain', 'hurt', 'ache', 'sore', 'where'],
      reply: "It's here — right lower side of my stomach. I keep pressing on it but that just makes it worse. It started dull but now it's really sharp. Maybe a 7 out of 10.",
    },
    {
      keywords: ['when', 'start', 'long', 'begin', 'ago', 'since'],
      reply: "About six hours ago. It came on after dinner — I had a big meal. At first I thought it was just indigestion, but it never went away and it's been getting worse since.",
    },
    {
      keywords: ['fever', 'temperature', 'hot', 'chills', 'sweat'],
      reply: "Yes, I feel hot. My wife said I was burning up when she touched my forehead before we left for the hospital. I've been shivering a little too.",
    },
    {
      keywords: ['nausea', 'sick', 'vomit', 'throw up', 'queasy'],
      reply: "Yes, I vomited once about two hours ago. I still feel nauseous now — the smell of the hospital isn't helping.",
    },
    {
      keywords: ['bowel', 'stool', 'poo', 'toilet', 'constipat', 'diarrhea', 'wind', 'gas', 'last open'],
      reply: "Last time was two days ago. Nothing unusual — normal stool. No diarrhea. I haven't been able to pass gas either since this morning, now that you mention it.",
    },
    {
      keywords: ['spread', 'radiat', 'move', 'travel', 'shoulder', 'back', 'groin'],
      reply: "It doesn't really move — it's pretty much stayed in the same place on the right side. Though sometimes it feels like it goes toward my belly button.",
    },
    {
      keywords: ['eat', 'food', 'drink', 'appetite', 'meal', 'last ate'],
      reply: "I had a big dinner — chicken, rice, lots of food. That was about seven hours ago. I haven't eaten or drunk anything since then. No appetite at all now.",
    },
    {
      keywords: ['allerg', 'reaction', 'medication', 'medicine', 'drug', 'tablet', 'pill'],
      reply: "I'm allergic to penicillin — I got a bad rash from it as a kid. I don't take any regular medications. I took some paracetamol about three hours ago but it barely touched the pain.",
    },
    {
      keywords: ['past', 'history', 'previous', 'before', 'surgery', 'hospital', 'operation', 'medical'],
      reply: "Nothing serious. I've never had surgery. I went to hospital once years ago for a twisted ankle. That's about it. I'm generally healthy.",
    },
    {
      keywords: ['family', 'relative', 'parent', 'father', 'mother', 'sibling'],
      reply: "My father has diabetes, but apart from that nothing significant that I know of. No family history of bowel or stomach problems.",
    },
    {
      keywords: ['work', 'job', 'stress', 'occupation', 'smoke', 'alcohol', 'drink'],
      reply: "I'm a civil engineer. Work has been stressful lately but nothing out of the ordinary. I don't smoke. I drink occasionally — maybe a beer or two on the weekend.",
    },
    {
      keywords: ['urine', 'pee', 'urinate', 'bladder', 'kidney', 'dark urine'],
      reply: "Urine seems fine, normal colour. No burning or anything like that.",
    },
    {
      keywords: ['press', 'touch', 'exam', 'feel', 'check', 'palpat'],
      reply: "Ow — yes, right there. That's the worst spot. Please be gentle... is this something serious? I'm a bit worried.",
    },
    {
      keywords: ['diagnos', 'what is', 'what do you think', 'what\'s wrong', 'serious'],
      reply: "Doctor, can you tell me what you think is going on? My wife is outside waiting — I want to be able to tell her something. Is this something that needs surgery?",
    },
    {
      keywords: ['worried', 'scared', 'anxious', 'nervous', 'afraid'],
      reply: "Honestly, yes. I've never had pain like this before. I have two young kids. I just need to know it's going to be okay.",
    },
    {
      keywords: ['__fallback__'],
      reply: "The pain is really not letting up... what else do you need to know, doctor? I'll answer anything.",
    },
    {
      keywords: ['__fallback__'],
      reply: "Sorry, I'm a bit distracted by the pain. Can you repeat that? I'm trying to focus.",
    },
    {
      keywords: ['__fallback__'],
      reply: "Is there something specific you're looking for? I want to help you figure this out — I just want to know what's wrong with me.",
    },
  ],

  emergency: [
    {
      keywords: ['when', 'start', 'long', 'ago', 'begin'],
      reply: "About... an hour ago. I was at my friend's place... came on suddenly. Couldn't breathe... had to call an ambulance.",
    },
    {
      keywords: ['inhaler', 'medication', 'medicine', 'drug', 'pill', 'salbutamol', 'ventolin'],
      reply: "I have... a blue inhaler... but I ran out... three days ago. I kept meaning to get more... didn't think I'd need it this bad.",
    },
    {
      keywords: ['trigger', 'cause', 'what happen', 'before', 'where were you', 'cat', 'animal', 'pet'],
      reply: "I was at Sarah's... she has two cats. I'm allergic... I know I shouldn't go but... it was her birthday.",
    },
    {
      keywords: ['asthma', 'history', 'before', 'previous', 'hospital', 'admission', 'past'],
      reply: "Since I was twelve... had it my whole life. Been admitted... twice before. Last time was... two years ago.",
    },
    {
      keywords: ['allerg', 'reaction', 'nsaid', 'aspirin', 'ibuprofen', 'nurofen'],
      reply: "NSAIDs... bad reaction. Ibuprofen makes it... much worse. It's on my records.",
    },
    {
      keywords: ['oxygen', 'spo2', 'sats', 'breathing', 'breath'],
      reply: "I can feel... the tightness here... in my chest. Every breath is hard... like breathing through a straw.",
    },
    {
      keywords: ['speak', 'sentence', 'talk', 'voice'],
      reply: "Talking is... hard right now. Please... can you help me?",
    },
    {
      keywords: ['worse', 'better', 'change', 'position', 'sitting', 'lying'],
      reply: "Sitting up... helps a bit. If I lie down... it gets much worse.",
    },
    {
      keywords: ['work', 'job', 'teacher', 'smoke', 'alcohol'],
      reply: "I'm a teacher... I don't smoke. Never smoked. Drink occasionally... that's all.",
    },
    {
      keywords: ['family', 'relative'],
      reply: "My mum has asthma too... my brother is fine.",
    },
    {
      keywords: ['pain', 'chest pain', 'heart'],
      reply: "It's more... tightness. Not like a stabbing pain... just feels like my chest is being squeezed.",
    },
    {
      keywords: ['__fallback__'],
      reply: "Please... I need help... the tightness isn't getting better.",
    },
    {
      keywords: ['__fallback__'],
      reply: "I'm scared... this has never been this bad before.",
    },
    {
      keywords: ['__fallback__'],
      reply: "Can you... give me something? My inhaler... please...",
    },
  ],

  general: [
    {
      keywords: ['tired', 'fatigue', 'energy', 'exhausted', 'lethargy'],
      reply: "It's been about three months now. I used to be able to get through a full day without any issues — now I'm wiped out by midday. I thought it was just the long hours at work, but my wife thinks it's something else.",
    },
    {
      keywords: ['weight', 'lose', 'loss', 'slim', 'appetite'],
      reply: "About six kilograms, maybe a bit more. I haven't been trying — if anything I've been eating more or less normally. I only noticed because my trousers started feeling loose.",
    },
    {
      keywords: ['sweat', 'night sweat', 'hot', 'temperature', 'fever'],
      reply: "Yes, actually. I wake up drenched sometimes — have to change my pyjamas. My wife keeps saying the room is fine and she's not hot, so it's not the temperature. It's been happening two or three times a week.",
    },
    {
      keywords: ['lump', 'lymph', 'node', 'swollen', 'neck', 'gland', 'bump'],
      reply: "Now that you mention it — my collar has been feeling tighter lately. I just thought I'd put on weight around my neck, which is strange because I've been losing weight overall. Let me feel... yes, there does seem to be something there.",
    },
    {
      keywords: ['itch', 'itchy', 'skin', 'rash', 'pruritus'],
      reply: "Yes, I've been itchy — mostly on my legs and arms. No rash that I can see, just the itching. I assumed it was dry skin.",
    },
    {
      keywords: ['smoke', 'smoking', 'cigarette', 'tobacco'],
      reply: "I quit ten years ago. Before that I smoked for about twenty years — a pack a day. I know, I know.",
    },
    {
      keywords: ['alcohol', 'drink', 'wine', 'beer'],
      reply: "Minimal. Maybe a glass of wine on a Friday. I'm not a big drinker.",
    },
    {
      keywords: ['medication', 'medicine', 'drug', 'tablet', 'pill', 'prescription'],
      reply: "Amlodipine 5mg for blood pressure. That's all. No over-the-counter stuff regularly.",
    },
    {
      keywords: ['allerg'],
      reply: "None that I know of.",
    },
    {
      keywords: ['diabetes', 'blood sugar', 'glucose'],
      reply: "Yes, type 2. I manage it with diet — no medication for that yet. My last HbA1c was borderline, my GP was keeping an eye on it.",
    },
    {
      keywords: ['blood pressure', 'hypertension', 'bp'],
      reply: "Yes, diagnosed about four years ago. The amlodipine keeps it in check.",
    },
    {
      keywords: ['family', 'relative', 'parent', 'father', 'mother', 'cancer'],
      reply: "My father had prostate cancer — he's fine, they caught it early. My mother died from a stroke at 71. No other cancers in the family that I know of.",
    },
    {
      keywords: ['work', 'job', 'stress', 'occupation'],
      reply: "I'm an accountant. Desk job mostly. The stress has been higher than usual this quarter, but nothing I haven't managed before.",
    },
    {
      keywords: ['pain', 'ache', 'hurt', 'uncomfortable', 'abdomen', 'stomach'],
      reply: "No real pain as such. I've had a vague sense of discomfort in my abdomen occasionally — I wouldn't call it pain. Maybe a heaviness.",
    },
    {
      keywords: ['breath', 'cough', 'chest', 'lung'],
      reply: "A bit short of breath climbing stairs recently — more than I used to be. I put it down to being unfit. No cough.",
    },
    {
      keywords: ['bowel', 'stool', 'toilet', 'constipat', 'diarrhea'],
      reply: "Normal, I think. No big changes. Maybe slightly irregular but nothing dramatic.",
    },
    {
      keywords: ['__fallback__'],
      reply: "I suppose I did put off coming in too long. I kept telling myself it would sort itself out.",
    },
    {
      keywords: ['__fallback__'],
      reply: "Is this something to be worried about? You have a look on your face that's making me nervous.",
    },
    {
      keywords: ['__fallback__'],
      reply: "Whatever you need to know, I'll tell you. I should have come in sooner, I realise that now.",
    },
  ],

  'surgeon-day': [
    // Stage 1 — Ward round responses as Mr. Hassan
    {
      keywords: ['hello', 'hi', 'good morning', 'morning', 'introduce', 'i am', "i'm", 'doctor', 'surgeon', 'team', 'name'],
      reply: "Oh, good morning. I'm glad someone came. I've been awake since 5am, couldn't sleep. The pain's been manageable but I'm nervous. Is everything still going ahead at 10?",
    },
    {
      keywords: ['feeling', 'how are you', 'doing', 'night', 'sleep', 'pain'],
      reply: "Honestly? A bit scared. The pain is a 4 out of 10 this morning — better than yesterday. I just want this thing out. My wife's already downstairs in the waiting area. She's more nervous than I am.",
    },
    {
      keywords: ['fast', 'eat', 'food', 'drink', 'water', 'midnight', 'last meal', 'nil by mouth', 'nbm'],
      reply: "Yes — nothing since midnight. The nurse told me last night. I had a light dinner at 9pm and that was it. Not even water this morning.",
    },
    {
      keywords: ['consent', 'form', 'sign', 'signed', 'paperwork'],
      reply: "I signed it last night, yes. But honestly, the nurse went through it quite fast and I was tired... I'm not entirely sure I understood everything that was going to happen. Is that okay?",
    },
    {
      keywords: ['question', 'ask', 'anything', 'concern', 'worry', 'before theatre', 'before we go'],
      reply: "Actually, yes. What exactly are you going to do in there? Nobody's explained it to me properly. I know it's a camera thing but what does that actually mean?",
    },
    // Task 1 — consent explanation keywords
    {
      keywords: ['gallbladder', 'remove', 'keyhole', 'laparoscop', 'small cuts', 'camera', 'ports', 'gallstone'],
      reply: "**Task 1 Score: 8/10**\n\nGood explanation — you covered the what and how clearly. One thing to add next time: mention the recovery timeline specifically. Patients scheduled for same-day or next-day discharge want to know when they can get back to normal life. Mr. Hassan drives for a living — that detail matters to him.\n\n---\n\n**STAGE 2 — PRE-OPERATIVE CHECKLIST**\n*Theatre, 9:55am*\n\nYou scrub in. The theatre is cold and bright. Equipment trolleys everywhere.\n\n*Nurse Fatima looks up from her checklist:*\n\n\"Right, let's run through the WHO checklist before we begin. Can you confirm — patient identity and procedure site?\"",
    },
    // Stage 2 — checklist
    {
      keywords: ['confirm', 'identity', 'hassan', 'verified', 'check', 'wristband', 'correct patient'],
      reply: "*Nurse Fatima nods.* \"Good. Site marked — right upper quadrant, confirmed. Anaesthesia check complete, Dr. Priya is happy. Now — allergies. Do you have the allergy status for Mr. Hassan?\"",
    },
    {
      keywords: ['penicillin', 'allerg', 'antibiotic', 'amoxicillin', 'co-amoxiclav'],
      reply: "*Nurse Fatima raises an eyebrow — in a good way.* \"Correct. Penicillin allergy — rash. I've flagged it. We're using cefazolin, which is fine. Well caught.\"\n\n\"Imaging up on screen — ultrasound showing the gallstones clearly. Any equipment concerns before we proceed?\"\n\n*Just as you're about to give the go-ahead, the anaesthetist Dr. Priya speaks up:*\n\n---\n\n**TASK 2 — CRITICAL DECISION**\n\n\"Before I put him under — he just told me he had a biscuit at 6am. Two hours ago. He forgot to mention it this morning. Theatre's booked, the team is ready, his family took the day off.\"\n\n**What do you do?**\n\nA) Proceed — it was only a biscuit and the team is ready\nB) Postpone the operation until he has fasted properly\nC) Ask the anaesthetist to make the call\n\nType your answer and your reasoning.",
    },
    // Task 2 — fasting decision
    {
      keywords: ['b)', 'postpone', 'delay', 'cancel', 'reschedule', 'aspiration', 'not safe', 'cannot proceed', 'can\'t proceed', 'fast properly'],
      reply: "**Task 2 Score: 10/10**\n\nCorrect — and you understood *why*. Aspiration under general anaesthesia is rare but can be fatal. Two hours is nowhere near enough. A biscuit isn't nothing — it contains fat, which delays gastric emptying. The team's inconvenience does not override patient safety. Ever.\n\n*Dry note from Dr. Priya: \"Good call. I'll reschedule for tomorrow morning. The family won't be happy, but they'll be happier than the alternative.\"*\n\n---\n\n**STAGE 3 — THE OPERATION**\n*Theatre, 11:15am — next day*\n\nMr. Hassan has fasted properly. He's under. You're at the camera.\n\n*Dr. Priya: \"Ports are in. Camera's live. Gallbladder's visible but there's significant inflammation around the cystic duct. Harder to see than usual. What do you want to do?\"*\n\n**A)** Proceed carefully and dissect the inflammation away\n**B)** Convert to open surgery\n**C)** Call your consultant for advice",
    },
    {
      keywords: ['a)', 'proceed', 'dissect', 'carefully', 'go ahead', 'continue'],
      reply: "**Step 1 Score: 6/10**\n\nBold — but risky solo. In a routine case with unexpected complexity, the first call is always to your consultant. Not because you can't handle it — but because two sets of eyes on an inflamed cystic duct prevent the most common serious complication in this operation: bile duct injury. Real surgeons call for help early. It's not weakness, it's judgement.\n\n*You proceed carefully with consultant guidance on the phone. The dissection is slow but successful.*\n\n---\n\n*Dr. Priya: \"Cystic duct clipped. Artery clipped. You're removing the gallbladder now — and the BP just dropped. 85 over 50. Nurse Fatima calls it out.*\n\n**What do you do first?**",
    },
    {
      keywords: ['c)', 'consultant', 'call', 'senior', 'help', 'advice', 'attend'],
      reply: "**Step 1 Score: 10/10**\n\nExactly right. Calling your consultant on an inflamed cystic duct is not hesitation — it's surgical maturity. Bile duct injury is the most feared complication of this operation. Two sets of eyes costs five minutes. Fixing a bile duct injury costs months.\n\n*Consultant guides you through the dissection. Clean. Cystic duct and artery clipped.*\n\n---\n\n*Dr. Priya: \"BP just dropped. 85 over 50. Nurse Fatima's calling it.*\n\n**What do you do first?**",
    },
    {
      keywords: ['anaesth', 'priya', 'bleed', 'pressure', 'bp', 'check', 'stop', 'pause', 'look'],
      reply: "**Step 2 Score: 9/10**\n\nGood instincts — pause, communicate, assess. In a sudden BP drop intraoperatively, you stop moving, you talk to your anaesthetist, and you look for the source. Blind continuation is how small bleeds become catastrophic ones.\n\n*Dr. Priya confirms: \"Small vessel nicked during dissection. Diathermy applied. BP recovering. Good catch.\"*\n\n---\n\n*Gallbladder out. Nurse Fatima begins her count.*\n\n*\"I have four swabs. We started with five.\"*\n\n**What do you do?**",
    },
    {
      keywords: ['search', 'look', 'find', 'count', "don't close", 'do not close', 'swab', 'retained', 'cavity', 'scan'],
      reply: "**Step 3 Score: 10/10**\n\nPerfect. You never close on a wrong count. You declare it aloud, you search the cavity methodically, and you don't rush. The swab was tucked behind the liver. Found and removed.\n\n*Dry note from Nurse Fatima: \"It's always the last place you look. Because you stop looking after you find it.\"*\n\n---\n\n**STAGE 4 — RECOVERY**\n*1:30pm*\n\nOperation successful. But during the procedure you noticed a lesion on the liver — unusual, irregular margin. You've taken a biopsy. Results in 5-7 days.\n\nMrs. Hassan has been waiting since 10am. She's in the family room.\n\n*She stands immediately when you walk in:*\n\n\"Is he okay? Did it go well? The nurse said it took longer than expected...\"",
    },
    // Stage 4 — Mrs Hassan
    {
      keywords: ['went well', 'successful', 'fine', 'okay', 'good', 'operation complete', 'gallbladder removed'],
      reply: "*She exhales.* \"Thank god. Thank you. But — why did it take so long? And the nurse mentioned something about his liver? She wouldn't tell me anything, just said the surgeon would explain.\" *She's holding her phone tight, knuckles pale.*",
    },
    {
      keywords: ['biopsy', 'sample', 'finding', 'liver', 'lesion', 'results', '5 days', '7 days', 'wait', 'test'],
      reply: "*She nods slowly, processing it.* \"So you don't know what it is yet.\" *A pause.* \"Is it cancer? You can tell me. I'd rather know.\"\n\n*This is the moment. What do you say?*",
    },
    {
      keywords: ['don\'t know', 'cannot say', "can't say", 'no diagnosis', 'wait for results', 'too early', 'not sure yet', 'could be many things', 'range of possibilities'],
      reply: "*She nods again, more settled this time.* \"Okay. Okay, I understand. Can I see him?\"\n\n---\n\n**TASK 3 — REFLECTION**\n\nBefore the debrief, take a moment.\n\nIn one paragraph: what surprised you most about what a general surgeon actually does today? What did you expect going in — and what caught you off guard?",
    },
    // Reflection and debrief
    {
      keywords: ['surpris', 'expect', 'thought', 'didn\'t expect', 'didn\'t know', 'realise', 'communication', 'people', 'family', 'not just', 'more than'],
      reply: "That's honest — and that's exactly what most students miss until they're in the room. Surgery is sold as a technical skill. The knife, the camera, the stitches. What nobody tells you is that the hardest part of the day was probably that conversation with Mrs. Hassan. Real surgeons will tell you the same thing.\n\n---\n\n**STAGE 5 — END OF DAY DEBRIEF**\n\n🏥 **OVERALL SCORE**\n\nTask 1 (Consent explanation): 8/10\nTask 2 (Fasting decision): 10/10\nIntraop Step 1: 9/10\nIntraop Step 2: 9/10\nIntraop Step 3: 10/10\n\n**Total: 46/50 — 92%**\n\n---\n\n🎯 **CAREER FIT: \"You think like a surgeon\"**\n\nYou prioritised patient safety over convenience (Task 2), you communicated uncertainty to Mrs. Hassan without causing panic, and you didn't close on a missing swab. Those three things define surgical judgement more than any technical skill.\n\n---\n\n✅ **Three things you did well:**\n1. You never let time pressure override safety — the biscuit decision was correct and you knew why\n2. You communicated the unknown to Mrs. Hassan with honesty and without a premature diagnosis\n3. You stopped the operation on the swab count without hesitation\n\n---\n\n⚠️ **One thing every surgeon struggles with — that you struggled with too:**\n\nThe inflammatory cystic duct. Proceeding without calling the consultant first is the most common error even experienced surgeons make. The instinct to handle it yourself is strong. Learning to override that instinct — early in your career — is what separates good surgeons from great ones.\n\n---\n\n💬 **What real surgeons say:**\n\n*\"People think surgery is about cutting. It's not. It's about deciding — a hundred times a day — what not to do. The knife is the easy part.\"*\n— Consultant General Surgeon, 22 years",
    },
    {
      keywords: ['__fallback__'],
      reply: "*Mr. Hassan looks at you expectantly.* \"So... what happens next, doctor?\"",
    },
    {
      keywords: ['__fallback__'],
      reply: "*Nurse Fatima glances over:* \"We're ready when you are, doctor.\"",
    },
    {
      keywords: ['__fallback__'],
      reply: "*Dr. Priya from behind the drape:* \"Take your time — but not too much of it.\"",
    },
  ],
}
