import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(data: string | Buffer): Promise<string>;
  abstract iCompare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
