import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '../entities/attachment.entity';
import { AttachmentModel } from '../models/education.model';
import { Repository } from 'typeorm';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentepository: Repository<Attachment>,
  ) {}

  async save(payload: AttachmentModel) {
    return await this.attachmentepository.save(payload);
  }

  async findAll() {
    return await this.attachmentepository.find();
  }

  async findOneById(id: number) {
    return await this.attachmentepository.findOneBy({ id });
  }

  async deleteOneById(id: number) {
    await this.attachmentepository.delete({ id });
  }

  async updateOneById(id: number, payload: AttachmentModel) {
    await this.attachmentepository.update(id, payload);
  }
}
