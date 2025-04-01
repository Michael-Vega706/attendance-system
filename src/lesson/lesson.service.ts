import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from 'src/entities/attachment.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonModel } from 'src/models/education.model';
import { Repository } from 'typeorm';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async save(payload: LessonModel) {
    return await this.lessonRepository.save(payload);
  }

  async findAll() {
    return await this.lessonRepository.find({
      relations: ['course', 'teacher'],
    });
  }

  async findOneById(id: number) {
    return await this.lessonRepository.findOne({
      where: { id },
      relations: ['course', 'teacher'],
    });
  }

  async findOneWithResourcesById(id: number) {
    return await this.lessonRepository.findOne({
      where: { id },
      relations: ['resources'],
    });
  }

  async findOneWithStudentsById(id: number) {
    return await this.lessonRepository.findOne({
      where: { id },
      relations: ['students'],
    });
  }

  async deleteOneById(id: number) {
    await this.lessonRepository.delete({ id });
  }

  async updateOneById(id: number, payload: LessonModel) {
    await this.lessonRepository.update(id, payload);
  }

  async assignAttachmentToLesson(lesson_id: number, attachment_ids: number[]) {
    const lessonDB = await this.findOneById(lesson_id);
    if (lessonDB) {
      lessonDB.resources = attachment_ids.map((el) => {
        const attachment = new Attachment();
        attachment.id = el;
        return attachment;
      });
      return await this.save(lessonDB);
    }
    throw new NotFoundException("Can't assign attachments to lesson.");
  }

  async attachmentList(lesson_id: number) {
    const lessonDB = await this.findOneWithResourcesById(lesson_id);
    if (lessonDB) {
      return lessonDB.resources;
    }
    throw new NotFoundException(`Lesson with id ${lesson_id} not found.`);
  }
}
