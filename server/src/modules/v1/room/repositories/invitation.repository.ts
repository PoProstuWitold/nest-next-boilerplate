import { Repository } from 'typeorm'

import { CustomRepository } from '../../../../database/typeorm-ex.decorator'
import { Invitation } from '../entities/invitation.entity'

@CustomRepository(Invitation)
export class InvitationRepository extends Repository<Invitation> {}