import { IsNotEmpty, IsString } from 'class-validator';
import { ClientSchema } from 'src/db/schema/clients';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  name: ClientSchema['name'];
}
