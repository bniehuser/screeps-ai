import { seekEnergy } from "../behaviors";

export default {
  run: (creep: Creep) => {
    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say('⚡ upgrade');
    }

    if(creep.memory.working) {
      if(creep.upgradeController(creep.room.controller as StructureController) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller as StructureController, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    } else {
      seekEnergy(creep);
    }
  }
};
