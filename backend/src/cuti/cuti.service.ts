// src/cuti/cuti.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuti } from './entities/cuti.entity';
import { CreateCutiDto } from './dto/create-cuti.dto';
import { Pegawai } from '../user/pegawai/entities/pegawai.entity'; // Pastikan Pegawai terimport

@Injectable()
export class CutiService {
  constructor(
    @InjectRepository(Cuti)
    private readonly cutiRepository: Repository<Cuti>,

    @InjectRepository(Pegawai)
    private readonly pegawaiRepository: Repository<Pegawai>, // Repository Pegawai
  ) {}

  // crete leave
  async create(createCutiDto: CreateCutiDto): Promise<Cuti> {
    const { pegawai_id, alasan, mulai_tanggal, akhir_tanggal } = createCutiDto;

    // find ById
    const pegawai = await this.pegawaiRepository.findOne({
      where: { id: pegawai_id },
    });
    if (!pegawai) {
      throw new BadRequestException(
        `Pegawai dengan ID ${pegawai_id} tidak ditemukan`,
      );
    }

    // check onleave employee
    const sisaCuti = pegawai.sisa_cuti;
    const mulai = new Date(mulai_tanggal);
    const akhir = new Date(akhir_tanggal);

    // calculate leave
    const durasiCuti =
      (akhir.getTime() - mulai.getTime()) / (1000 * 3600 * 24) + 1; // Durasi cuti dalam hari

    if (sisaCuti < durasiCuti) {
      throw new BadRequestException(
        `Sisa cuti pegawai tidak mencukupi. Sisa cuti: ${sisaCuti}, durasi cuti yang diminta: ${durasiCuti}`,
      );
    }

    // calculate leave current year
    const tahunCuti = mulai.getFullYear();
    const cutiTahunIni = await this.cutiRepository
      .createQueryBuilder('cuti')
      .where('cuti.pegawai_id = :pegawai_id', { pegawai_id })
      .andWhere('YEAR(cuti.mulai_tanggal) = :tahun', { tahun: tahunCuti })
      .getMany();

    const totalCutiTahunIni = cutiTahunIni.reduce((total, cuti) => {
      const cutiMulai = new Date(cuti.mulai_tanggal);
      const cutiAkhir = new Date(cuti.akhir_tanggal);
      const durasi =
        (cutiAkhir.getTime() - cutiMulai.getTime()) / (1000 * 3600 * 24) + 1;
      return total + durasi;
    }, 0);

    if (totalCutiTahunIni + durasiCuti > 12) {
      throw new BadRequestException(
        `Pegawai tidak dapat mengambil lebih dari 12 hari cuti dalam satu tahun.`,
      );
    }

    // Check whether employees have taken more than 1 day of leave in the same month
    const bulanCuti = mulai.getMonth();
    const tahunCutiBulan = mulai.getFullYear();

    const cutiHariIni = [];
    let currentDate = new Date(mulai_tanggal);

    while (currentDate <= akhir) {
      cutiHariIni.push(new Date(currentDate).toISOString().split('T')[0]); // Format yyyy-mm-dd
      currentDate.setDate(currentDate.getDate() + 1); 
    }

    // Check whether there are any leave in the same month
    for (const tanggal of cutiHariIni) {
      const cutiBulanIni = await this.cutiRepository
        .createQueryBuilder('cuti')
        .where('cuti.pegawai_id = :pegawai_id', { pegawai_id })
        .andWhere('MONTH(cuti.mulai_tanggal) = :bulan', {
          bulan: bulanCuti + 1,
        })
        .andWhere('YEAR(cuti.mulai_tanggal) = :tahun', {
          tahun: tahunCutiBulan,
        })
        .andWhere('cuti.mulai_tanggal = :tanggal', { tanggal })
        .getMany();

      // throw error
      if (cutiBulanIni.length > 0) {
        throw new BadRequestException(
          `Pegawai hanya dapat mengambil 1 hari cuti dalam bulan yang sama.`,
        );
      }
    }

    // create leave
    const cuti = this.cutiRepository.create({
      alasan,
      mulai_tanggal,
      akhir_tanggal,
      pegawai,
    });

    // save
    const savedCuti = await this.cutiRepository.save(cuti);

    // Reduces remaining employee leave after leave is approved
    pegawai.sisa_cuti -= durasiCuti;
    await this.pegawaiRepository.save(pegawai);

    return savedCuti;
  }

  // get 
  async findAll(): Promise<Cuti[]> {
    return this.cutiRepository
      .createQueryBuilder('cuti')
      .leftJoinAndSelect('cuti.pegawai', 'pegawai')
      .getMany();
  }

  // find byId

  async findById(id: number): Promise<Cuti> {
    const cuti = await this.cutiRepository
      .createQueryBuilder('cuti')
      .leftJoinAndSelect('cuti.pegawai', 'pegawai') 
      .where('cuti.id = :id', { id })
      .getOne();

    if (!cuti) {
      throw new NotFoundException(`Cuti dengan ID ${id} tidak ditemukan`);
    }

    return cuti;
  }

  // delete
  async remove(id: number): Promise<void> {
    const cuti = await this.findById(id);
    await this.cutiRepository.remove(cuti);
  }
}
