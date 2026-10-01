/**
 * FOUND HER — published profiles.
 *
 * Every profile here is a real woman's own account, sent in by her. Nothing in
 * this file is written on anyone's behalf: her answers are hers, copy-edited
 * at most, and the standfirst is the one line the house writes. A story goes
 * up only once she has approved the final text. Profiles can be drafted here
 * before that point, but pending records are never part of the public archive,
 * feed, sitemap, social cards or article routes. The shape below is what a CMS
 * should map onto when one is connected.
 */

export type FoundHerProfile = {
  slug: string;
  name: string;
  role: string;
  location?: string;
  portrait?: {
    src: string;
    alt: string;
    position?: string;
    /** Use contain when the portrait composition should be preserved rather
        than cropped into the slot. */
    fit?: "cover" | "contain";
    /** CSS aspect-ratio, e.g. "3 / 4". Defaults to the slot's own shape.
        Set it for framed artwork, which must never be cropped. */
    aspect?: string;
    /** Small print rendered above her "Read her story" link wherever the
        portrait stands in for her. Exists so a composed artwork is never
        mistaken for a photograph of the woman herself. */
    note?: string;
    /** True when the artwork ALREADY carries its own frame and nameplate.
        Those hang on the wall as they are — putting them inside the FOUNDER
        frame would be a frame inside a frame. */
    preframed?: boolean;
  };
  /** One line for the archive card */
  building: string;
  /** Two short lines for the FOUND HER gallery card (the desert-pink hall).
      Kept separate from `building` so the gallery band reads as a wall
      placard while `building` stays the plain descriptor used elsewhere. */
  tagline?: string;
  /** Sits under the name at the top of her page */
  standfirst: string;
  answers: { question: string; body: string[] }[];
  closing?: string;
  /** Publications she has appeared in, shown as a quiet band at the foot of
      her page. Only what she has told the house herself, with the
      publication's own logo as she supplied it. Never a "seen in" list for
      FOUNDER the brand: this is her credential, not the product's. */
  press?: {
    publication: string;
    caption: string;
    /** `rem` is the logo's display height on desktop (phones get 82% of
        it). Set per mark so a heavy block wordmark and a fine serif one
        read at the same weight side by side. */
    logo: { src: string; width: number; height: number; rem: number };
  }[];
  /** The date she signed off on this text, or "PENDING" until she has.
      While it is "PENDING", her page drops the "published after she read
      and approved the final text" line — the site never claims an
      approval that hasn't happened. */
  approvedOn: string;
  /** Legacy draft field from the pre-launch workflow. Pending profiles are
      no longer exposed publicly; remove this when the record is approved. */
  publishedOn?: string;
};

/** True once she has read and approved the final text. */
export function isApproved(profile: FoundHerProfile): boolean {
  return profile.approvedOn !== "PENDING";
}

/** The date machines cite. Public profiles are approval-gated, so the
    approval date is also the publication date exposed to crawlers. */
export function publicationDate(profile: FoundHerProfile): string {
  return profile.approvedOn;
}

export const profiles: FoundHerProfile[] = [
  {
    slug: "shelby-korpi",
    name: "Shelby Korpi",
    role: "Founder",
    portrait: {
      src: "/editorial/shelby-korpi.webp",
      alt: "Shelby Korpi in a deep green satin blazer, her hand on the brass plate of a dark green door, a lamp glowing in the room behind her.",
      position: "50% 26%",
    },
    building: "FOUNDER, EcoYield.ai, and a few things before both.",
    tagline: "Built with conviction. Led with grace.",
    standfirst:
      "Before the titles, the patents and the polished photographs, there was a girl who had seizures as a child, was bullied for how she looked, learned what it felt like to be underestimated from both sides, and kept choosing to get back up.",
    approvedOn: "2026-10-01",
    /* Shelby asked for these on 1 Oct 2026 and supplied every logo herself.
       The Maxim cover is already in her own answers below; FHM Sweden and
       the Plastic Cup Boyz show are her words in chat ("also featured in
       FHM Sweden"; "I was on the show with Kevin Hart and Plastic Cup
       Boyz", shortened at her request to match the others), as are WCK and
       Playboy ("ring girl with WCK"; "body paint model with Playboy Mansion
       events"). */
    press: [
      {
        publication: "Maxim Australia",
        caption: "On the cover of Maxim Australia",
        logo: { src: "/brand/press/maxim-australia-cream.png", width: 579, height: 191, rem: 3.5 },
      },
      {
        publication: "FHM Sweden",
        caption: "Featured in FHM Sweden",
        logo: { src: "/brand/press/fhm-sweden-cream.png", width: 547, height: 155, rem: 2.5 },
      },
      {
        publication: "Kevin Hart Presents: Plastic Cup Boyz",
        caption: "On the show with Kevin Hart",
        logo: { src: "/brand/press/plastic-cup-boyz-cream.png", width: 344, height: 212, rem: 5.75 },
      },
      {
        publication: "WCK",
        caption: "Ring girl with WCK",
        logo: { src: "/brand/press/wck-cream.png", width: 156, height: 188, rem: 4.75 },
      },
      {
        publication: "Playboy",
        caption: "Body paint model at Playboy Mansion events",
        logo: { src: "/brand/press/playboy-cream.png", width: 500, height: 600, rem: 5.75 },
      },
    ],
    answers: [
      {
        question: "What are you building?",
        body: [
          "I’m building FOUNDER — a beauty brand for women building businesses, families, careers, second chances, and lives that finally feel like their own.",
          "It begins with skincare, but it was never meant to end there.",
          "I want to create a place where women are known for more than how they look. A place where the polished photo can exist beside the part nobody saw, and neither one cancels out the other.",
          "FOUNDER is the title.",
          "FOUND HER is the woman behind it.",
          "Because being a founder isn’t limited to starting a company. Every woman has founded something: a business, a family, a new direction, a life after loss, or a version of herself she had to fight to find again.",
          "This brand exists to give those women the frame, the products, and the room to tell the whole story.",
        ],
      },
      {
        question: "What’s the part nobody saw?",
        body: [
          "Life was never especially easy for me, even before business entered the picture.",
          "I had seizures growing up as a kid. I was also bullied and made fun of for how I looked. At that age, I never thought I was going to grow up and be considered pretty. I knew what it felt like to walk into a room already wondering what people were going to say about me.",
          "Years later, life flipped the script. I built a modeling career and ended up on the cover of Maxim. From the outside, that probably looked like the perfect revenge story. In some ways, it was a pretty good lesson in karma.",
          "But being on the other side taught me something just as important. People can make assumptions about you because they think you’re attractive, too. They assume life must have been easy. They assume doors just opened. Sometimes they don’t take you seriously at all.",
          "I have been the girl who was bullied for not being pretty enough and the woman people underestimated because of how she looked. I know both sides.",
          "That stayed with me when I started building businesses.",
          "In 2020, I built a business from my kitchen. There were cloth face masks, satin sleep sets, hair accessories, shipping supplies, and boxes everywhere. I sourced the products, handled production, created the listings, answered customer messages, and packed orders late into the night.",
          "That business, v3rywell, did just under one million dollars in its first year.",
          "People saw the sales. They didn’t see the hours, uncertainty, mistakes, pressure, or how many problems had to be solved before a single order reached someone’s door.",
          "Then came BitThermal. The idea took me inside commercial poultry barns and eventually became the beginning of EcoYield.ai.",
          "I spent years around chickens, dust, heat, noise, manure, equipment, operators, and problems I had never imagined I would be solving. I listened. I learned. I kept showing up.",
          "For a long time, almost no one believed in it.",
          "People saw a girl standing in a chicken barn. Some saw the former model. Some saw the way I looked before they heard a word I said. What they did not see was the research, the obsession, the miles, the relationships, the failures, and how badly I wanted to understand the problem well enough to build something useful.",
          "I ran out of money.",
          "Someone stole a large amount of money from me.",
          "I drove across the country alone multiple times because I believed being in the room mattered. On one of those trips, I thought I might have to sleep in my car because I no longer had enough money.",
          "While trying to build a startup, I delivered Uber Eats orders to pay my bills. I needed work flexible enough to let me keep taking meetings, researching, traveling, and keeping the company alive.",
          "There was nothing glamorous about that season.",
          "I think people sometimes look at someone’s face, photos, titles, or successes and decide the rest of the story must have been easy. Mine wasn’t.",
          "The part nobody saw was how many times life tested me before anyone saw the outcome.",
        ],
      },
      {
        question: "What are you proud of?",
        body: [
          "I’m proud of the businesses, the sales, the ideas, and becoming the sole inventor behind five provisional patent filings.",
          "But those are the easy things to point to.",
          "What I am most proud of is that I kept choosing what to do with the cards I was dealt.",
          "I believe life throws challenges at you and, in a way, asks what you are going to do with them. Are you going to let them make you smaller? Bitter? Afraid to try again? Or are you going to learn everything they came to teach you and use it the next time life asks more of you?",
          "I do not think strength is something you are simply born with. I think you build it. One hard thing at a time.",
          "The seizures, the bullying, being judged for how I looked, being underestimated, losing money, being betrayed, starting over, walking into industries where I did not look like the person people expected — every one of those experiences taught me something different.",
          "If you play your cards right, the lessons start to accumulate. You become harder to scare. You see problems differently. You stop assuming adversity means stop.",
          "That is the part I am proudest of.",
          "I am also proud that I kept my softness. I can be feminine, care about beauty, love a beautiful campaign, and still build technology for million-bird agricultural operations.",
          "I never want success to require me to become less of myself.",
        ],
      },
      {
        question: "When did you find her?",
        body: [
          "I used to think finding her would be one big moment.",
          "A cover. A million dollars in sales. A patent. A title. Finally being taken seriously.",
          "It wasn’t.",
          "I found her in pieces.",
          "I found her in the girl who made it through things she did not understand yet.",
          "I found her after being bullied, when I eventually realized other people’s opinions were never going to be a reliable mirror.",
          "I found her when modeling taught me that being admired can be just as distorting as being criticized if you let either one decide your value.",
          "I found her driving alone across the country toward opportunities I could barely afford to chase.",
          "I found her delivering someone else’s dinner so I could keep paying my bills while building my own future.",
          "I found her standing inside dirty poultry barns, surrounded by chickens and people who could not yet see what I saw.",
          "I found her every time life gave me another reason to stop and I had to make a decision about who I was going to be next.",
          "Eventually I realized the challenges were not separate from the woman I was becoming. They were building her.",
          "Every lesson gave me another tool. Every failure made me less afraid of the next one. Every time I got back up, the world felt a little less capable of telling me what my limits were.",
          "That is when I found her.",
          "Not when life became easy.",
          "When I realized I could handle hard things and still build the life I wanted anyway.",
        ],
      },
      {
        question: "What does beauty mean to you now?",
        body: [
          "Beauty is complicated for me because I have lived on both sides of it.",
          "I was the girl who was bullied for how she looked. Later, I became the woman people saw in photographs and sometimes assumed must have had an easy life because of them.",
          "Neither version told the whole truth.",
          "Beauty can open doors. It can also make people underestimate you. It can make people decide who you are before you speak. And if you are not careful, it can make you hand strangers far too much power over how you feel about yourself.",
          "Now beauty feels much more private.",
          "It is taking care of myself because I want to, not because I need to prove I deserve to be seen.",
          "It is clean skin, a favorite serum, getting dressed after a hard night, and still showing up for the life I said I wanted.",
          "It is being feminine without apologizing for being ambitious.",
          "It is knowing I can walk into a boardroom, a barn, a photoshoot, a startup meeting, or a room full of people who have already made assumptions about me and still know exactly who I am.",
          "That is beautiful to me now.",
        ],
      },
      {
        question: "What would you tell a woman starting where you started?",
        body: [
          "Do not waste every hard season asking why it is happening to you.",
          "Ask what it is teaching you.",
          "I believe the lessons accumulate.",
          "The thing that hurts now may teach you how to read people. The failure may teach you how to rebuild. The embarrassment may make you less afraid of looking foolish. The money you lose may teach you how to protect the next opportunity. The room that underestimates you may teach you how to walk into the next one without asking for permission.",
          "You do not have to be grateful for every painful thing while you are living it. Some things are simply hard.",
          "But when you get through them, take the lesson with you.",
          "Play the cards you have as well as you can.",
          "Over time, you build something more valuable than a perfect life. You build evidence that you can survive change, solve problems, recover, and keep moving.",
          "That evidence changes the way you see the world.",
          "You stop treating adversity like a verdict. You start treating it like something you know how to move through.",
          "You stop accepting other people’s limitations for you because you have already watched yourself do things you once thought were impossible.",
          "Start with what you have. Build before you feel ready. Let the first version teach you something.",
          "And when life deals you another hard hand, remember that you have played difficult cards before.",
          "You are not waiting to become powerful.",
          "You are collecting proof that you already are.",
        ],
      },
    ],
    closing: "FOUNDER. FOUND HER.",
  },
  {
    slug: "julie-schoener",
    name: "Julie Schoener",
    role: "Building Stay Delusional",
    location: "Newport Beach",
    portrait: {
      src: "/editorial/julie-schoener-frame.webp",
      alt: "A framed collage for Julie Schoener: a watercolour vision board \u2014 mountains at sunrise, friends laughing over coffee, a climber, hot-air balloons, handwritten notes from her story \u2014 in a carved green-and-gold frame with a brass nameplate carrying her name.",
      aspect: "3 / 4",
      note: "The picture in the frame isn’t Julie — it’s a painting we put together for her story.",
      /* Her artwork is already a framed collage, nameplate and all. */
      preframed: true,
    },
    building: "Stay Delusional — a brand for believing in the life before it exists.",
    tagline: "Redefined success. On her own terms.",
    standfirst:
      "She spent years on the path she was supposed to follow. Losing her mom changed how she looked at time — so she moved across the country, started over, and began building a life she was excited to wake up to.",
    /* Approved by Julie for publication. Answers are verbatim from her
       submission of 15 August 2026. */
    approvedOn: "2026-09-30",
    answers: [
      {
        question: "When did you find her?",
        body: [
          "I found her after losing my mom and realizing how quickly life can change. I had spent years building a career at the same investment firm, and losing her made me stop and really question what I wanted my own life to look like. I realized I wanted to build something that was mine, take more chances, and create a life that felt meaningful to me, not just keep following the path I thought I was supposed to be on.",
        ],
      },
      {
        question: "What are you building?",
        body: [
          "I\u2019m building Stay Delusional with one of my best friends. It came from this idea that sometimes you have to believe in a life that doesn\u2019t exist yet so strongly that everyone else might think you\u2019re a little delusional.",
          "For me, it\u2019s not just about starting a company. It\u2019s about building a life I\u2019m actually excited to wake up to and creating something of my own that has meaning behind it. We\u2019re starting with a lifestyle brand, but the bigger dream is to build a community around people who are brave enough to believe in their crazy ideas before anyone else does.",
          "And one of the pieces that means the most to me is eventually having a portion of the proceeds support young people with a \u201cdelusional\u201d dream of their own, giving them a little help believing that maybe their idea isn\u2019t so crazy after all.",
        ],
      },
      {
        question: "What did it take?",
        body: [
          "Losing my mom changed the way I look at time. It made me realize that the life you keep saying you\u2019ll build \u201csomeday\u201d isn\u2019t guaranteed. It took leaving behind a version of my life that looked stable on paper, moving across the country, starting over, and being willing to not have everything figured out yet.",
          "I\u2019m still very much in the figuring-it-out part. Stay Delusional hasn\u2019t even launched yet. But maybe that\u2019s part of my story too, I\u2019m submitting this while I\u2019m still becoming her.",
        ],
      },
      {
        question: "What are you proud of?",
        body: [
          "I\u2019m proud that I\u2019ve been willing to start over. To leave behind what was comfortable, move across the country, meet new people, try new things, and build a life that feels more like mine. I definitely don\u2019t have it all figured out, but I\u2019m proud of how much I\u2019ve created from starting again.",
        ],
      },
      {
        question: "What makes you feel most like yourself?",
        body: [
          "Adventure. Being outside, doing something that scares me a little, laughing with my friends, dreaming up ideas that are probably way too big, and being around people who make me feel completely myself.",
        ],
      },
      {
        question: "What would you tell a woman beginning now?",
        body: [
          "You don\u2019t need proof that your dream is going to work before you start. Sometimes you have to be a little delusional first. Believe in the life you want before it exists and then start building it.",
        ],
      },
    ],
  },
  {
    slug: "aly-v",
    name: "Aly V",
    role: "Building MakeupGemz",
    location: "Pensacola, Florida",
    portrait: {
      src: "/editorial/aly-v.webp",
      /* Her own photograph, sent with her story on 28 Sept 2026, styled to
         the house at Shelby's direction ("keep the model exactly the same,
         you may change the outfit"): a Founder Green satin blazer over a
         champagne silk camisole, and the FOUNDER study after hours behind
         her — green panelling, a brass picture lamp, a door ajar, a desert
         rose cushion. The outfit and room were generated from her photo;
         HER FACE IS HER OWN — the original pixels, aligned landmark to
         landmark (≈1 px) and colour-matched into the new light, so no model
         re-drew her features. Same spec as Shelby's portrait: 1122×1402,
         4:5, unframed; position 50% 12% keeps the crown of her head in the
         3:2 story masthead. */
      alt: "Aly V, smiling softly, her long dark hair over her shoulders, in a deep green satin blazer over a champagne silk camisole and a fine gold necklace, seated before dark green panelling with a brass lamp over a gilt-framed painting, a door ajar with warm light beyond, and a dusky rose silk cushion at her shoulder.",
      position: "50% 12%",
      note: "Aly\u2019s own photograph, styled for FOUNDER \u2014 the outfit and the room are ours, her face is untouched.",
    },
    building: "MakeupGemz \u2014 makeup and beauty on Instagram, Whatnot and Skool. Next, a law degree.",
    tagline: "Faith over fear. Who says you can\u2019t do both?",
    standfirst:
      "Six years building her name as a makeup artist in New York, three years in beauty in Los Angeles, and now MakeupGemz \u2014 with a law degree next, because, in her words, who says you can\u2019t do both?",
    /* Approved by Aly for publication on 30 September 2026. The story uses
       her 28 September rewrite, with grammar and spelling copy-edits only;
       her voice and story remain hers. */
    approvedOn: "2026-09-30",
    answers: [
      {
        question: "When did you find her?",
        body: [
          "I found her in NYC. After graduating from USD, I took a leap of faith and enrolled in makeup school in the city to follow my dreams.",
        ],
      },
      {
        question: "What are you building?",
        body: [
          "I\u2019m building MakeupGemz, an online makeup and beauty platform featuring relatable beauty and lifestyle content on Instagram, a live-streaming Whatnot channel, and a Skool community for makeup tutorials. I\u2019m also planning to return to school for my JD. Who says you can\u2019t do both?",
        ],
      },
      {
        question: "What did it take?",
        body: [
          "Discipline, sacrifice, and resilience. Countless sleepless nights, no days off, and saying no far more than yes. I invested heavily in my dreams, overcame significant adversity, and learned to stay in my own lane. More than anything, it took perseverance, strength, and a mind-over-matter mentality.",
        ],
      },
      {
        question: "What are you proud of?",
        body: [
          "I\u2019m most proud of choosing faith over fear and never giving up. After graduating from college, I spent six years in NYC building my career as a makeup artist and became a published MUA. After moving to LA, I worked at Valentino Beauty for three years and then launched MakeupGemz, which now includes a Whatnot channel, a relatable IG page, and a Skool community for makeup tutorials.",
        ],
      },
      {
        question: "What makes you feel most like yourself?",
        body: [
          "Recording makeup videos in my studio, live-streaming on Whatnot, and working at my desk as a paralegal.",
        ],
      },
      {
        question: "What would you tell a woman beginning now?",
        body: [
          "Don\u2019t care what anyone else thinks. Do whatever you want. You can achieve far more than you can fathom if you have the courage to chase your dreams.",
        ],
      },
    ],
  },
];

/** The only records allowed onto public FOUND HER surfaces. */
export const approvedProfiles = profiles.filter(isApproved);

export function getProfile(slug: string) {
  return profiles.find((profile) => profile.slug === slug);
}

export function getPublishedProfile(slug: string) {
  return approvedProfiles.find((profile) => profile.slug === slug);
}
