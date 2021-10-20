export const seekEnergy = (creep: Creep): void => {
  const source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: s => s.energy > 0 });
  if(source) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  }
};
