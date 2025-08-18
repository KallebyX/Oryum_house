import { SetMetadata } from '@nestjs/common';

export const CONDOMINIUM_KEY = 'condominium';
export const RequireCondominium = () => SetMetadata(CONDOMINIUM_KEY, true);
