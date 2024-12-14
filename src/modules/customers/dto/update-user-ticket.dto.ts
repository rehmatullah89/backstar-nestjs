import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTicketDto } from './create-user-ticket.dto';
export class UpdateUserTicketDto extends PartialType(CreateUserTicketDto) {}
