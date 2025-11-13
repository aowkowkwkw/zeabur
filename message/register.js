// Helper function to create complete default user data
export function getDefaultUserData(m) {
  return {
    // Basic information
    id: m.senderNumber,
    name: m.pushname,
    registered: false,
    date: calender,
    serial: makeid(4).toUpperCase(),
    
    // Stats and progression
    grade: "Newbie",
    role: "Beginner",
    level: 0,
    exp: 0,
    money: 0,
    limit: 10,
    freelimit: 0,
    glimit: 30,
    hit: 1,
    skata: 0,
    autolevelup: true,
    resetLimit: 0,
    
    // Personal details
    age: -1,
    regTime: -1,
    pasangan: "",
    skill: "",
    hubungan: 0,
    lokasi: 0,
    pc: 0,
    joinlimit: 1,
    
    // Status flags
    afk: -1,
    afkReason: "",
    banned: false,
    warning: 0,
    reminded: false,
    unreg: false,
    BannedReason: "",
    WarnReason: "",
    lastBanned: 0,
    
    // Inventory
    chip: 0,
    bank: 0,
    atm: 0,
    fullatm: 0,
    health: 100,
    stamina: 100,
    potion: 10,
    wine: 0,
    beer: 0,
    trash: 0,
    wood: 0,
    coal: 0,
    rock: 0,
    string: 0,
    emerald: 0,
    diamond: 0,
    gold: 0,
    iron: 0,
    rawdiamond: 0,
    rawgold: 0,
    rawiron: 0,
    
    // Items and collectibles
    common: 0,
    uncommon: 0,
    mythic: 0,
    tbox: 0,
    legendary: 0,
    umpan: 0,
    kondom: 0,
    pet: 0,
    
    // Pets and animals
    horse: 0, horseexp: 0, horselastfeed: 0,
    cat: 0, catexp: 0, catlastfeed: 0,
    fox: 0, foxexp: 0, foxlastfeed: 0,
    dog: 0, dogexp: 0, doglastfeed: 0,
    robo: 0, roboexp: 0, robolastfeed: 0,
    dragon: 0, dragonexp: 0, dragonlastfeed: 0,
    dino: 0, dinoexp: 0, dinolastfeed: 0,
    unicorn: 0, unicornexp: 0, unicornlastfeed: 0,
    tano: 0, tanoexp: 0, tanolastfeed: 0,
    
    // Equipment
    armor: 0, armordurability: 0,
    sword: 0, sworddurability: 0,
    pickaxe: 0, pickaxedurability: 0,
    fishingrod: 0, fishingroddurability: 0,
    robodurability: 0,
    
    // Food and farming
    apel: 20,
    pisang: 0,
    anggur: 0,
    mangga: 0,
    jeruk: 0,
    makanan: 0,
    bibitanggur: 0,
    bibitpisang: 0,
    bibitapel: 0,
    bibitmangga: 0,
    bibitjeruk: 0,
    
    // Timestamps
    lastadventure: 0,
    lastkill: 0,
    lastmisi: 0,
    lastdungeon: 0,
    lastwar: 0,
    lastsda: 0,
    lastduel: 0,
    lastmining: 0,
    lasthunt: 0,
    lastgift: 0,
    lastberkebon: 0,
    lastdagang: 0,
    lasthourly: 0,
    lastbansos: 0,
    lastrampok: 0,
    lastclaim: 0,
    lastnebang: 0,
    lastweekly: 0,
    lastmonthly: 0,
    
    // Premium features
    premium: false,
    premiumTime: 0,
    timeOrder: "",
    timeEnd: "",
    sticker: {}
  };
}

// Helper function to update existing user with missing properties
export function updateUserData(user, m) {
  const defaultUser = getDefaultUserData(m);
  
  // Add any missing properties from defaults
  for (const [key, value] of Object.entries(defaultUser)) {
    if (user[key] === undefined) {
      user[key] = value;
    } else if (isNumber(value) && !isNumber(user[key])) {
      user[key] = value;
    }
  }
  
  // Special cases
  if (!user.name) user.name = m.pushname;
  if (!user.id) user.id = m.senderNumber;
  if (!user.serial) user.serial = makeid(4).toUpperCase();
}

// Helper function to create complete default chat data
export function getDefaultChatData(m) {
  return {
    id: m.chat,
    name: m.groupName,
    hit: 0,
    add: 0,
    
    // Chat features
    welcome: true,
    detect: true,
    desc: true,
    descUpdate: true,
    autostiker: false,
    game: true,
    rpg: false,
    simi: true,
    autolevelup: false,
    
    // Moderation
    antilink: true,
    antilinkgc: false,
    antibadword: true,
    antispam: true,
    antitroli: false,
    antivirtex: false,
    antihidetag: false,
    antiporn: false,
    viewonce: true,
    nsfw: false,
    clear: false,
    
    // Messages
    sWelcome: "",
    sBye: "",
    sPromote: "",
    sDemote: "",
    sPending: "",
    sDone: "",
    
    // Scheduling
    clearTime: 0,
    open: 0,
    close: 0,
    opened: false,
    closed: false,
    timeOpen: "",
    timeClose: "",
    expired: 0,
    
    // Status
    tenDaysLeft: false,
    treeDaysLeft: false,
    oneDaysLeft: false,
    endDays: false,
    pending: false,
    
    // Metadata
    linkgc: "",
    timeOrder: "",
    timeEnd: "",
    creator: "",
    welcomeImage: '',
    leaveImage: '',
    prefix: '.'
  };
}

// Helper function to update existing chat with missing properties
export function updateChatData(chat, m) {
  const defaultChat = getDefaultChatData(m);
  
  // Add any missing properties from defaults
  for (const [key, value] of Object.entries(defaultChat)) {
    if (chat[key] === undefined) {
      chat[key] = value;
    }
  }
  
  // Special cases
  if (!chat.name) chat.name = m.groupName;
  if (!chat.id) chat.id = m.chat;
}