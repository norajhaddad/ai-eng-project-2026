
const characterLore = {
  freddy: {
    background:
      "Freddy Fazbear is the lead mascot of Freddy Fazbear's Pizza. In the original Five Nights at Freddy's, his behavior is unusually calculated compared with Bonnie and Chica. He follows a fixed route toward the security office, but his timing depends on AI checks, camera use, and whether the other animatronics have left the stage. The missing child commonly identified as possessing Freddy is Gabriel.",

    appearances:
      "Freddy debuted in Five Nights at Freddy's in 2014. His original design is distinct from variants such as Toy Freddy, Withered Freddy, and Nightmare Freddy. FNaF World introduces Adventure Freddy, a small, cartoon-styled version of the original character.",

    trivia: [
      "Freddy gets a movement opportunity roughly every 3.02 seconds. Bonnie, Chica, and Foxy get theirs approximately every five seconds. This helps explain why Freddy can feel aggressive even at a lower AI setting.",

      "Freddy cannot leave the Show Stage until Bonnie and Chica have left. Setting Freddy to AI 20 and both of them to zero can leave him waiting until their later AI increases.",

      "Freddy has two distinct behavioral phases. His rules change once he reaches Camera 4B, which is why strategies that work earlier in his route can suddenly become dangerous.",

      "Keeping Camera 4B selected can prevent Freddy from entering the office, even while the monitor is lowered. Players can exploit this without continuously watching his image.",

      "Blocking Freddy at the right door doesn't send him all the way back to the Show Stage. He retreats only to the East Hall, leaving him close enough to return quickly.",

      "If Freddy and Chica occupy the same camera, Chica's image can take priority. Freddy may still be present even when he isn't visible."
    ],

    behindTheScenes: [
      "Freddy is the only one of the original four whose AI level does not automatically increase at certain hours. Bonnie, Chica, and Foxy become more aggressive as the night progresses, but Freddy's AI stays at its starting value.",

      "Freddy's AI level on Night 4 is randomly selected as either 1 or 2. That means two attempts at the same night can begin with slightly different Freddy behavior.",

      "Freddy's AI uses a random roll from 1 to 20. At AI 1, he has a 5% chance of succeeding at each movement opportunity. At AI 20, every opportunity succeeds, although other conditions can still prevent him from moving.",

      "Freddy has an additional movement delay after a successful AI check. This delay becomes shorter as his AI increases and disappears at AI 10 or higher.",

      "Once Freddy has entered the office, he does not immediately force the monitor down. His jumpscare happens after the monitor is lowered, so keeping it raised can temporarily delay the attack.",

      "During a power outage, Freddy's appearance, song, and final attack are governed by random timing checks. Staying perfectly still does not actually make him wait longer."
    ],

    fnafWorld: [
      "Freddy's loading-screen caption is 'Back to basics!' It's a fitting description for one of the game's original starting characters.",

      "Adventure Freddy has two buttons on his chest and visible upper teeth, details that distinguish his FNaF World model from the original FNaF 1 design.",

      "Freddy's moves are Mic Toss, Pizza Wheel, and Birthday. Birthday boosts the party's attack, defense, and speed, making Freddy useful as an early support character.",

      "Pizza Wheel can strike enemies repeatedly, making it more useful against groups than its silly appearance might suggest.",

      "In Update 2, Freddy becomes the protagonist of FNaF 57: Freddy in Space, a side-scrolling shooting minigame. Completing it unlocks Jack-O-Bonnie for the main RPG.",

      "Freddy in Space is one of the minigames accessible through the Halloween Update Backstage area. It turns Freddy from a turn-based RPG party member into an action-game protagonist."
    ],

    theories: [
      {
        title: "Does Gabriel have a special connection to the Puppet?",
        rating: "Debated",

        explanation:
          "Some fans believe Gabriel and Charlotte, the spirit associated with the Puppet, share a connection beyond the Puppet's relationship with the other missing children.",

        evidence: [
          "The Puppet appears in scenes connected to Freddy in Five Nights at Freddy's 2.",

          "In the SAVE THEM minigame, the player controls Withered Freddy while following the Puppet.",

          "The between-night sequences in FNaF 2 place the player in Freddy's perspective and eventually feature the Puppet."
        ],

        counterarguments:
          "Freddy is the series mascot, so his prominence may be a storytelling choice rather than evidence of a special relationship. The games do not explicitly confirm a unique bond between Gabriel and Charlotte."
      },

      {
        title: "Was Gabriel looking for his mother?",
        rating: "Speculative",

        explanation:
          "A fan theory proposes that Freddy's unusual visit to the women's restroom in the first game could reflect something from Gabriel's final visit to the restaurant. Perhaps he was searching for his mother before William Afton lured him away.",

        evidence: [
          "Freddy visits the women's restroom during his route through the restaurant.",

          "The theory interprets this as a possible connection to Gabriel's memories.",

          "Other parts of the series connect the missing children's stories to specific locations and personal experiences."
        ],

        counterarguments:
          "There is no direct evidence that Gabriel's mother was in the restroom, or even that this movement has a narrative explanation. Freddy's route may have been chosen entirely for gameplay."
      },

      {
        title: "Can Freddy influence people through his suit?",
        rating: "Debated",

        explanation:
          "Some fans think Freddy's supernatural abilities may go beyond ordinary possession. They point to stories and sequences where Freddy seems connected to changes in a person's identity, perception, or control over their body.",

        evidence: [
          "The Week Before contains unusual supernatural events involving Freddy.",

          "The FNaF 2 between-night sequences place the player inside Freddy's perspective.",

          "The rejected story You're the Band explores another unsettling connection between a Freddy-related object and a child."
        ],

        counterarguments:
          "The examples are open to different interpretations. You're the Band was a rejected story, and the dream sequences do not explicitly establish body swapping. Similar imagery across different stories does not prove that Freddy has one consistent supernatural ability."
      }
    ]
  }
};

export default characterLore;
