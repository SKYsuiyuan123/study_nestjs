import { PartialType } from '@nestjs/mapped-types';
import { CreateLogDto } from './create-log.dto.js';

export class UpdateLogDto extends PartialType(CreateLogDto) {}
