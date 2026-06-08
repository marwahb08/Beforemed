type MockResponse = {
  keywords: string[]
  reply: string
}

export const MOCK_SCORES: Record<string, number> = {
  surgery: 48,
  emergency: 44,
  general: 46,
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
}
