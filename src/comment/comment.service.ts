import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { ClientService } from 'src/client/client.service';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<object> {
    try {
      await this.clientService.getById(createCommentDto.client_id);
      await this.productService.getById(createCommentDto.product_id);
      const comment = await this.commentRepository.create(createCommentDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Kommentariya qo'shildi",
        data: {
          comment,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const comments = await this.commentRepository.findAll({
        include: { model: Product, include: [Image] },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          comments,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByProductId(product_id: number): Promise<object> {
    try {
      const comments = await this.commentRepository.findAll({
        where: { product_id },
        include: { model: Product, include: [Image] },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          comments,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const comment = await this.commentRepository.findByPk(id, {
        include: { model: Product, include: [Image] },
      });
      if (!comment) {
        throw new NotFoundException('Kommentariya topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          comment,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<object> {
    try {
      await this.getById(id);
      const comment = await this.commentRepository.update(
        { text: updateCommentDto.text },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Kommentariya tahrirlandi',
        data: {
          comment: comment[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      await this.getById(id);
      await this.commentRepository.destroy({ where: { id } });
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Kommentariya o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
