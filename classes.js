var hitTypes = {
    1:  'Hit',
    2:  'Crit',
    4:  'Blocked',
    6:  'Glancing',
    7:  'Dodge',
    8:  'Parry',
    10: 'Immune',
}

function handler_zero(name) {
    return (player, event) => {
        return [0, name];
    }
}

function handler_changeThreatModifier(threatModifier, name) {
    return (player, event) => {
        player.threatModifier = threatModifier;
        return [0, name];
    }
}

function handler_castCanMiss(threatValue, name) {
    return (player, event) => {
        switch (event.type) {
            case 'cast':
                return [threatValue, name];
            case 'damage':
                return [-threatValue, name];
        }
        return [0, name];
    }
}

function handler_damage(name) {
    return (player, event) => {
        if (event.type == 'damage') {
            return [event['amount'], name];
        }
        return [0, name];
    }
}

function handler_threatOnHit(threatValue=0, name) {
    return (player, event) => {
        if (event.type == 'damage' && event['hitType']<=6) {
            return [event['amount'] + threatValue, name];
        }
        return [0, name];
    }
}

function handler_threatOnDebuff(threatValue, name) {
    return (player, event) => {
        switch (event.type) {
            case 'applydebuff':
            case 'refreshdebuff':
                return [threatValue, name];
        }
        return [0, name];
    }
}

function handler_threatOnBuff(threatValue, name) {
    return (player, event) => {
        switch (event.type) {
            case 'applybuff':
            case 'refreshbuff':
                return [threatValue, name];
        }
        return [0, name];
    }
}


class Player {
    classSpells = {};

    globalSpells = {
        /* Physical */
            1: handler_damage("Melee"),
         7919: handler_damage("Shoot Crossbow"),
        16624: handler_damage("Thorium Shield Spike"),
    

        /* Consumables */
        11374: handler_threatOnDebuff(90, "Gift of Arthas"),
    
    
        /* Damage/Weapon Procs */
        20007: handler_zero("Heroic Strength (Crusader)"),   //Heroic Strength (Crusader)
        18138: handler_damage("Shadow Bolt (Deathbringer Proc)"), //Deathbringer (Shadow Bolt)
    
        /* Thorn Effects */
        9910: handler_damage("Thorns"),  //Thorns (Rank 6)
        17275: handler_damage("Heart of the Scale"), //Heart of the Scale
        22600: handler_damage("Force Reactive Disk"), //Force Reactive
        11350: handler_zero("Oil of Immolation"),   //Oil of Immolation (buff)
        11351: handler_damage("Oil of Immolation"), //Oil of Immolation (dmg)
    
        /* Explosives */
        13241: handler_damage("Goblin Sapper Charge"), //Goblin Sapper Charge
    
    
        /* Zero Threat Abilities */
        10610: handler_zero("Windfury Totem"), //Windfury Totem
        20572: handler_zero("Blood Fury"), //Blood Fury
        26296: handler_zero("Berserking (Troll racial)"), //Berserking (Troll racial)
        26635: handler_zero("Berserking (Troll racial)"), //Berserking (Troll racial)
        22850: handler_zero("Sanctuary"), //Sanctuary
         9515: handler_zero("Summon Tracking Hound"), //Summon Tracking Hound
    
        /* Consumable Buffs (zero-threat) */
        10667: handler_zero("Rage of Ages"), //Rage of Ages
        25804: handler_zero("Rumsey Rum Black Label"), //Rumsey Rum Black Label
        17038: handler_zero("Winterfall Firewater"), //Winterfall Firewater
         8220: handler_zero("Savory Deviate Delight (Flip Out)"), //Savory Deviate Delight (Flip Out)
        17543: handler_zero("Fire Protection"), //Fire Protection
        17548: handler_zero("Greater Shadow Protection Potion"), //Greater Shadow Protection Potion
        18125: handler_zero("Blessed Sunfruit"), //Blessed Sunfruit
        17538: handler_zero("Elixir of the Mongoose"), //Elixir of the Mongoose
        11359: handler_zero("Restorative Potion (Restoration) Buff"), //Restorative Potion (Restoration) Buff
        23396: handler_zero("Restorative Potion (Restoration) Dispel"), //Restorative Potion (Restoration) Dispel
    }

    constructor(events) {
        throw "This should be overridden"
    }

    spell(id) {
        return this.classSpells[id] || this.globalSpells[id];
    }
}




class Warrior extends Player {
    classSpells = {
        /* Stances */
        71: handler_changeThreatModifier(1.495, "Defensive Stance"),
        2457: handler_changeThreatModifier(0.8, "Battle Stance"),
        2458: handler_changeThreatModifier(0.8, "Berserker Stance"),

        /* Physical */
        12721: handler_damage("Deep Wounds"),
         6552: handler_damage("Pummel (Rank 1)"), // (TODO: Did this interrupt)
         6554: handler_damage("Pummel (Rank 2)"), // (TODO: Did this interrupt)
        
        23881: handler_damage("Bloodthirst"), //Rank 1
        23892: handler_damage("Bloodthirst"), //Rank 2
        23893: handler_damage("Bloodthirst"), //Rank 3
        23894: handler_damage("Bloodthirst"), //Rank 4
        23888: handler_zero("Bloodthirst"),   //Buff
        23885: handler_zero("Bloodthirst"),   //Buff
     
        //Heroic Strike
           78: handler_threatOnHit(20, "Heroic Strike"),
          284: handler_threatOnHit(39, "Heroic Strike"),
          285: handler_threatOnHit(59, "Heroic Strike"),
         1608: handler_threatOnHit(78, "Heroic Strike"),
        11564: handler_threatOnHit(98, "Heroic Strike"),
        11565: handler_threatOnHit(118, "Heroic Strike"),
        11566: handler_threatOnHit(137, "Heroic Strike"),
        11567: handler_threatOnHit(145, "Heroic Strike"),
        25286: handler_threatOnHit(175, "Heroic Strike"), // (AQ)
     
        //Shield Slam
        23925: handler_threatOnHit(250, "Shield Slam"), //Rank 4
     
        //Revenge
        11601: handler_threatOnHit(315, "Revenge"), //Rank 5
        25288: handler_threatOnHit(355, "Revenge"), //Rank 6 (AQ)
        12798: handler_zero("Revenge Stun"),           //Revenge Stun
     
        //Cleave
          845: handler_threatOnHit(10, "Cleave"),  //Rank 1
         7369: handler_threatOnHit(40, "Cleave"),  //Rank 2
        11608: handler_threatOnHit(60, "Cleave"),  //Rank 3
        11609: handler_threatOnHit(70, "Cleave"),  //Rank 4
        20569: handler_threatOnHit(100, "Cleave"), //Rank 5
     
        //Whirlwind
         1680: handler_damage("Whirlwind"), //Whirlwind
     
        //Hamstring
        7373: handler_threatOnHit(145, "Hamstring"),
     
        //Intercept
        20252: handler_threatOnHit(0, "Intercept"), //Intercept
        20253: handler_zero("Intercept Stun"),         //Intercept Stun (Rank 1)
        20616: handler_threatOnHit(0, "Intercept"), //Intercept (Rank 2)
        20614: handler_zero("Intercept Stun"),         //Intercept Stun (Rank 2)
        20617: handler_threatOnHit(0, "Intercept"), //Intercept (Rank 3)
        20615: handler_zero("Intercept Stun"),         //Intercept Stun (Rank 3)
     
        //Execute
        20647: (encounter, event) => {
            return [event['amount'] * 1.2, "Execute"];
        },
     
        /* Abilities */
        //Sunder Armor
        11597: handler_castCanMiss(261, "Sunder Armor"), //Rank 6
     
        //Battleshout
        11551: handler_threatOnBuff(52, "Battle Shout"), //Rank 6
        25289: handler_threatOnBuff(60, "Battle Shout"), //Rank 7 (AQ)
     
        //Demo Shout
        11556: handler_threatOnDebuff(43, "Demoralizing Shout"),
     
        //Mocking Blow
        20560: handler_damage("Mocking Blow"),



        /* Zero threat abilities */
         355: handler_zero("Taunt"), //Taunt
        1161: handler_zero("Challenging Shout"), //Challenging Shout
        2687: handler_zero("Bloodrage"), //Bloodrage (cast)
       29131: handler_zero("Bloodrage"), //Bloodrage (buff)
       29478: handler_zero("Battlegear of Might"), //Battlegear of Might
       23602: handler_zero("Shield Specialization"), //Shield Specialization
       12964: handler_zero("Unbridled Wrath"), //Unbridled Wrath
       11578: handler_zero("Charge"), //Charge
        7922: handler_zero("Charge Stun"), //Charge Stun
       18499: handler_zero("Berserker Rage"), //Berserker Rage
       12966: handler_zero("Flurry (Rank 1)"), //Flurry (Rank 1)
       12967: handler_zero("Flurry (Rank 2)"), //Flurry (Rank 2)
       12968: handler_zero("Flurry (Rank 3)"), //Flurry (Rank 3)
       12969: handler_zero("Flurry (Rank 4)"), //Flurry (Rank 4)
       12970: handler_zero("Flurry (Rank 5)"), //Flurry (Rank 5)
       12328: handler_zero("Death Wish"), //Death Wish
         871: handler_zero("Shield Wall"),
        1719: handler_zero("Recklessness"), //Recklessness
       12323: handler_zero("Piercing Howl"), //Piercing Howl
       14204: handler_zero("Enrage"), //Enrage
       12975: handler_zero("Last Stand (cast)"), //Last Stand (cast)
       12976: handler_zero("Last Stand (buff)"), //Last Stand (buff)
        2565: handler_zero("Shield Block"), //Shield Block


        /* Consumable */
         6613: handler_zero("Great Rage Potion"), //Great Rage Potion
        17528: handler_zero("Mighty Rage Potion"), //Mighty Rage Potion
    } 

    constructor(events) {
        // Identify the starting stance based on ability usage
        let startStance = this.identify_start_stance(events);
        switch (startStance) {
            case 'Defensive Stance':
                this.spell(71)(this);
                break;
            case 'Battle Stance':
                this.spell(2457)(this);
                break;
            case 'Berserker Stance':
                this.spell(2458)(this);
                break;
            default:
                throw "Failed to identify starting stance";
        }
        console.log(`Identified starting stance as '${startStance}' using modifier ${this.threatModifier}`);
    }

    identify_start_stance(events) {
        for (let event of events) {
            if (event.type == 'cast') {
                switch (event.ability.name) {
                    case 'Revenge':
                    case 'Shield Slam':
                    case 'Disarm':
                    case 'Shield Wall':
                    case 'Shield Block':
                    case 'Taunt':
                        return 'Defensive Stance';
                    case 'Berserker Rage':
                    case 'Intercept':
                    case 'Recklessness':
                    case 'Whirlwind':
                        return 'Berserker Stance';
                    case 'Charge':
                    case 'Mocking Blow':
                    case 'Overpower':
                    case 'Retaliation':
                    case 'Thunder Clap':
                        return 'Battle Stance';
                }
            } else if (event.type == 'removebuff') {
                switch (event.ability.guid) {
                    case 71:
                        return 'Defensive Stance';
                    case 2457:
                        return 'Battle Stance';
                    case 2458:
                        return 'Berserker Stance';
                }
            }
        }
        return 'Unknown';
    }
}

const gClasses = {
    "Warrior": Warrior,
}