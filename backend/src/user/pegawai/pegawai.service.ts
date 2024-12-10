import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pegawai } from './entities/pegawai.entity';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { GetTableDto } from 'src/helper/dto/general.dto';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(Pegawai)
    private readonly mainRepository: Repository<Pegawai>,
  ) {}

  async findAll(payload: GetTableDto): Promise<Pegawai[]> {
    const sql = this.mainRepository.createQueryBuilder('a');

    const resultData = await sql.getMany();
    return resultData;
  }

  async findById(id: number): Promise<Pegawai | undefined> {
    const pegawai = await this.mainRepository
      .createQueryBuilder('pegawai')
      .where('pegawai.id = :id', { id })
      .getOne();

    return pegawai;
  }

  async create(createPegawaiDto: CreatePegawaiDto): Promise<Pegawai> {
    const { nama_depan, nama_belakang, email, no_hp, jenis_kelamin, address } =
      createPegawaiDto;

    // create employee
    const pegawai = this.mainRepository.create({
      nama_depan,
      nama_belakang,
      email,
      no_hp,
      jenis_kelamin,
      address,
    });

    // save
    return this.mainRepository.save(pegawai);
  }

  async update(
    id: number,
    updatePegawaiDto: UpdatePegawaiDto,
  ): Promise<Pegawai> {
    // find byId
    const pegawai = await this.mainRepository.findOne({ where: { id } });

    // throw error
    if (!pegawai) {
      throw new NotFoundException(`Pegawai dengan id ${id} tidak ditemukan`);
    }

    // update data
    Object.assign(pegawai, updatePegawaiDto);

    // save
    return this.mainRepository.save(pegawai);
  }

  // delete
  async delete(id: number): Promise<boolean> {
    const pegawai = await this.mainRepository.findOne({ where: { id } });

    if (!pegawai) {
      return false; 
    }

    await this.mainRepository.remove(pegawai);
    return true;
  }
}
