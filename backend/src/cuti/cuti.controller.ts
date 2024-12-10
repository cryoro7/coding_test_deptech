// src/cuti/cuti.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CutiService } from './cuti.service';
import { CreateCutiDto } from './dto/create-cuti.dto';
import { Cuti } from './entities/cuti.entity';

@Controller('cuti')
export class CutiController {
  constructor(private readonly cutiService: CutiService) {}

  // add leave
  @Post()
  async create(@Body() createCutiDto: CreateCutiDto): Promise<Cuti> {
    return this.cutiService.create(createCutiDto);
  }

  // get leave
  @Get()
  async findAll(): Promise<Cuti[]> {
    return this.cutiService.findAll();
  }

  // find byId
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Cuti> {
    return this.cutiService.findById(id);
  }

  // delete
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.cutiService.remove(id);
  }
}
