import { seekEnergy } from "../behaviors";

export default {
  run: (creep: Creep) => {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('🚧 build');
    }
    if (creep.memory.working) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        const repairs = creep.room.find(FIND_STRUCTURES).filter(s => s.hits < s.hitsMax)
          .sort((a, b) => Math.min(b.hitsMax, 2000000) - b.hits - (Math.min(a.hitsMax, 2000000) - a.hits));
        if (repairs.length) {
          if (creep.repair(repairs[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(repairs[0], { visualizePathStyle: { stroke: '#aaffaa' } });
          }
        }
      }
    } else {
      seekEnergy(creep);
    }
  }
};
