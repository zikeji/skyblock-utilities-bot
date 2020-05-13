interface Pet {
    name: string;
    rarity?: string;
    emoji: string;
    goalType: string;
    nextGoal?: number;
    nextRarity?: string;
    key: string;
}

interface PetWithMilestones {
    pet: Pet;
    milestones: {
        rarity: string;
        goal: number;
    }[]
}

export abstract class PetMilestones {
    static PETS_WITH_MILESTONES: PetWithMilestones[] = [
        {
            pet: {
                name: 'Rock',
                emoji: '<:rock_pet:710234815516901466>',
                goalType: 'ores mined',
                nextGoal: 2500,
                nextRarity: 'Common',
                key: 'pet_milestone_ores_mined'
            },
            milestones: [
                {
                    rarity: 'Common',
                    goal: 2500
                },
                {
                    rarity: 'Uncommon',
                    goal: 7500
                },
                {
                    rarity: 'Rare',
                    goal: 20000
                },
                {
                    rarity: 'Epic',
                    goal: 100000
                },
                {
                    rarity: 'Legendary',
                    goal: 250000
                }
            ]
        },

        {
            pet: {
                name: 'Dolphin',
                emoji: '<:dolphin_pet:710234803106086992>',
                goalType: 'sea creatures killed',
                nextGoal: 250,
                nextRarity: 'Common',
                key: 'pet_milestone_sea_creatures_killed'
            },
            milestones: [
                {
                    rarity: 'Common',
                    goal: 250
                },
                {
                    rarity: 'Uncommon',
                    goal: 1000
                },
                {
                    rarity: 'Rare',
                    goal: 2500
                },
                {
                    rarity: 'Epic',
                    goal: 5000
                },
                {
                    rarity: 'Legendary',
                    goal: 10000
                }
            ]
        }
    ];

    public static GetPetMilestoneProgress(data: PetWithMilestones, currentValue: number = 0): Pet {
        const pet: Pet = Object.assign({}, data.pet);

        for (let i = 0; i < data.milestones.length; i += 1) {
            const milestone = data.milestones[i];

            if (currentValue >= milestone.goal) {
                pet.rarity = milestone.rarity;
                if (data.milestones.length >= (i+2)) {
                    pet.nextGoal = data.milestones[i+1].goal;
                    pet.nextRarity = data.milestones[i+1].rarity;
                } else {
                    delete pet.nextGoal;
                    delete pet.nextRarity;
                }
            }
        }
        return pet;
    }
}
