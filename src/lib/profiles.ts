/**
 * FOUND HER — published profiles.
 *
 * Every profile here is a real woman's own account, published only after she
 * has read the final text and approved it. Nothing in this file is written on
 * anyone's behalf, and nothing is added to it without that approval. The shape
 * below is what a CMS should map onto when one is connected.
 */

export type FoundHerProfile = {
  slug: string;
  name: string;
  role: string;
  location?: string;
  portrait?: { src: string; alt: string; position?: string };
  /** One line for the archive card */
  building: string;
  /** Sits under the name at the top of her page */
  standfirst: string;
  answers: { question: string; body: string[] }[];
  closing?: string;
  /** The date she signed off on this text */
  approvedOn: string;
};

export const profiles: FoundHerProfile[] = [
  {
    slug: "shelby-korpi",
    name: "Shelby Korpi",
    role: "Founder",
    portrait: {
      src: "/editorial/shelby-korpi.webp",
      alt: "Shelby Korpi in a black blazer, photographed in a panelled room with a brass lamp behind her.",
      position: "45% 26%",
    },
    building: "FOUNDER, EcoYield.ai, and a few things before both.",
    standfirst:
      "The first story here is her own — the kitchen-table business, the chicken barns, the year she delivered other people’s dinners to keep her company alive.",
    approvedOn: "2026-08-05",
    answers: [
      {
        question: "What are you building?",
        body: [
          "I’m building FOUNDER — a beauty brand for women building businesses, families, careers, second chances, and lives that finally feel like their own.",
          "It begins with skincare, but it was never meant to end there.",
          "I want to create a place where women are known for more than how they look. A brand where real women share what they have built, what it cost them, and who they discovered along the way.",
          "FOUNDER is the title.",
          "FOUND HER is the woman behind it.",
          "Because being a founder isn’t limited to starting a company. Every woman has founded something: a business, a family, a new direction, a life after loss, or a version of herself she had to fight to find again.",
          "This brand exists to put those women on the products, inside the campaigns, and at the center of the conversation.",
        ],
      },
      {
        question: "What’s the part nobody saw?",
        body: [
          "In 2020, I was building a business from my kitchen.",
          "There were cloth face masks, satin sleep sets, hair accessories, shipping supplies, and boxes everywhere. I sourced the products, handled production, created the listings, answered customer messages, and packed orders late into the night.",
          "That business, v3rywell, did just under one million dollars in its first year.",
          "People saw the sales. They didn’t see the hours, uncertainty, mistakes, pressure, or how many problems had to be solved before a single order reached someone’s door.",
          "Before EcoYield.ai, there was BitThermal.",
          "BitThermal began with an idea: use the heat created by immersion-cooled Bitcoin mining to help heat large-scale poultry operations. It was an unconventional idea that brought together technology, energy, agriculture, and a problem most people had never considered.",
          "That idea took me inside commercial poultry barns.",
          "I spent years around chickens, dust, heat, noise, manure, equipment, and every smell that comes with a working farm. I listened to operators. I watched how the barns were managed. I saw how much information was separated across different systems and how much critical knowledge still lived inside the minds of experienced workers.",
          "The longer I spent inside those barns, the more I understood that the problem was bigger than heat.",
          "BitThermal became the beginning of EcoYield.ai — a larger vision for helping commercial agricultural operations understand what is happening inside their facilities, recognize problems earlier, and make better decisions.",
          "For a long time, almost no one believed in it.",
          "People saw a girl standing inside a chicken barn. They didn’t see the drive, passion, research, and determination behind her. They didn’t see the years I spent learning an industry, building relationships, developing the technology, and refusing to let the idea go.",
          "I ran out of money.",
          "Someone stole a large amount of money from me.",
          "I kept getting knocked down, and every time I had to decide whether I was going to stay there.",
          "I drove across the country alone multiple times for my projects because I believed being in the room mattered. On one of those trips, I thought I might have to sleep in my car because I no longer had enough money.",
          "While trying to build a startup, I delivered Uber Eats orders to pay my bills. I needed work that allowed me to remain flexible enough to take meetings, continue researching, travel when an opportunity appeared, and keep the company alive.",
          "There was nothing glamorous about that season.",
          "These are not details I share to make struggle look beautiful. They are part of the truth. Behind every title, polished photograph, patent filing, and big idea was a woman doing whatever honest work she could to keep going.",
          "The part nobody saw was how many times I had to start over without knowing whether the next attempt would work.",
        ],
      },
      {
        question: "What are you proud of?",
        body: [
          "I’m proud of the businesses, the sales, the ideas, and becoming the sole inventor behind five provisional patent filings.",
          "But I’m most proud that I did not quit when quitting would have made sense to almost everyone around me.",
          "I’m proud that when I ran out of money, I found a way to keep moving. I’m proud that I made deliveries instead of pretending everything was fine. I’m proud that I drove those miles alone, walked into the barns, asked the questions, and continued showing up when no one was waiting to applaud me.",
          "I’m proud that I allowed BitThermal to grow into EcoYield.ai. I didn’t hold onto the first version of the idea simply because it was where I started. I listened, learned, and let the vision become bigger.",
          "I’m proud that being underestimated did not make me smaller.",
          "And I’m proud that I kept my softness. I remained creative, curious, feminine, and hopeful. I refused to believe I had to become cold to become credible.",
          "I can care about beautiful skin and build technology for million-bird agricultural operations. I can understand an exquisite beauty campaign and the complicated operations underneath a business.",
          "None of those parts cancel each other out.",
          "Together, they are what make me a founder.",
        ],
      },
      {
        question: "When did you find her?",
        body: [
          "I didn’t find her when I reached a certain number in sales.",
          "I didn’t find her when I filed a patent, earned a title, or finally received someone else’s approval.",
          "I found her during the moments when there was no applause.",
          "I found her driving alone across the country toward an opportunity I couldn’t afford to miss. I found her delivering someone else’s dinner so I could keep paying my bills while building my own future. I found her standing inside a dirty barn, surrounded by chickens and people who could not yet see what I saw.",
          "I found her every time life knocked me down and I chose to stand up again.",
          "Most of all, I found her when I stopped separating the different versions of myself.",
          "The beauty founder. The inventor. The woman packing boxes in her kitchen. The delivery driver. The woman behind BitThermal. The woman building EcoYield.ai. The woman who ran out of money. The woman who had been betrayed. The woman walking into rooms where she wasn’t expected. The woman who succeeded, struggled, and still believed she had more to build.",
          "I found her when I stopped asking which version of me belonged and understood that all of them did.",
          "I didn’t suddenly become her.",
          "I finally recognized the woman who had been fighting for me the entire time.",
        ],
      },
      {
        question: "What does beauty mean to you now?",
        body: [
          "Beauty used to feel like something you had to achieve before you were ready to be seen.",
          "Now, beauty means recognizing yourself.",
          "It can be clean skin, a favorite serum, and five quiet minutes before a demanding day. It can also be the way a woman carries herself after surviving something nobody else knows about.",
          "Beauty is not proof that your life is perfect.",
          "It is the decision to care for yourself while your life is still being built.",
          "It is the woman who gets dressed for an important meeting after crying the night before. It is the woman who puts on her serum before heading out to make deliveries because she still believes the life she is building is possible.",
          "Beauty is ambition without shame, softness without weakness, and confidence that no longer depends on being chosen.",
          "It is looking in the mirror and knowing the woman looking back belongs in every room she worked to enter.",
        ],
      },
      {
        question: "What would you tell a woman starting where you started?",
        body: [
          "Start with what you have.",
          "Start from the kitchen. Start with the imperfect idea. Start before the branding is finished, before anyone understands, and before you feel completely ready.",
          "Learn the parts nobody applauds. Pack the boxes. Make the deliveries. Ask the questions. Drive the miles. Walk into the barns. Fix what doesn’t work. Let the first version be small enough to teach you something.",
          "Do not be ashamed of the work you have to do to support the work you were meant to do.",
          "Do not confuse running out of money with running out of potential.",
          "Do not confuse being new with being incapable.",
          "And do not let someone else’s inability to see your vision convince you that it isn’t real.",
          "Your first idea may not be the final company. BitThermal taught me what I needed to see before I could build EcoYield.ai. Sometimes the beginning is not supposed to be the destination. It is supposed to get you close enough to the problem to understand what you are truly meant to build.",
          "People may see “just a girl.”",
          "Let them.",
          "You know about the drive, the passion, the sacrifice, and the woman working behind the scenes. One day, they will see what she built. But long before they understand it, you have to believe in her.",
          "The room does not make you a founder.",
          "The title does not make you a founder.",
          "Building when no one is watching does.",
          "You are not waiting to become her.",
          "You are finding the woman who has been there all along.",
        ],
      },
    ],
    closing: "FOUNDER. FOUND HER.",
  },
];

export function getProfile(slug: string) {
  return profiles.find((profile) => profile.slug === slug);
}
