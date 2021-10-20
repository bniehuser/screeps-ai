import roleBuilder from "roles/role.builder";
import roleHarvester from "roles/role.harvester";
import roleUpgrader from "roles/role.upgrader";

type CreepBreedBehavior = (c: Creep) => void;

interface CreepBreedData {
  max: number;
  parts: BodyPartConstant[];
  ai: CreepBreedBehavior;
}

// eslint-disable-next-line no-shadow
export enum BREED {
  HARVESTER = "harvester",
  UPGRADER = "upgrader",
  BUILDER = "builder",
  TINY = "tiny",
}

type CreepBreedLookup = {
  [key in BREED]: CreepBreedData;
};

export const CreepBreeds: CreepBreedLookup = {
  [BREED.HARVESTER]: { max: 2, parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], ai: roleHarvester.run },
  [BREED.UPGRADER]: { max: 6, parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], ai: roleUpgrader.run },
  [BREED.BUILDER]: { max: 4, parts: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], ai: roleBuilder.run },
  [BREED.TINY]: { max: 0, parts: [WORK, CARRY, MOVE, MOVE], ai: roleHarvester.run }
};

export const spawn = (parts: BodyPartConstant[], role: BREED, spawnFrom: StructureSpawn) => {
  return spawnFrom.spawnCreep(parts, `fun_gi_${Game.time}`, {
    memory: { role, room: spawnFrom.room.name, working: false }
  });
};

export const spawnBreed = (b: BREED, spawnFrom: StructureSpawn, force: boolean = false) => {
  const breed = CreepBreeds[b];
  if (breed) {
    if (force || Object.values(Game.creeps).filter(c => c.memory.role === b).length < breed.max) {
      const res = spawn(breed.parts, b, spawnFrom);
      if (res < 0) {
        console.log('failed to spawn: ', res);
      }
    }
  } else {
    console.log('breed not found', breed);
  }
};

export const doSpawn = () => {
  const spawnFrom = Game.spawns.home;
  Object.keys(CreepBreeds).forEach(t => spawnBreed(t as BREED, spawnFrom));
  if (spawnFrom.room.energyAvailable > 450) {
    const rl = Object.keys(CreepBreeds).reduce((a, c) => {
      for (let i = 0; i < CreepBreeds[c as BREED].max; i++) {
        a.push(c as BREED);
      }
      return a;
    }, [] as BREED[]);
    const breed = rl[Math.floor(Math.random() * rl.length)];
    spawnBreed(breed, spawnFrom, true);
  }
  if(Object.keys(Game.creeps).length < 3) {
    spawnBreed(BREED.TINY, spawnFrom, true);
  }
};
