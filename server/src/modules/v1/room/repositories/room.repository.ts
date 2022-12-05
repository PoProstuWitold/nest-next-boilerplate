import { Repository } from 'typeorm'

import { CustomRepository } from '../../../../database/typeorm-ex.decorator'
import { Room } from '../entities/room.entity'

@CustomRepository(Room)
export class RoomRepository extends Repository<Room> {}