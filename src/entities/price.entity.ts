import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('price')
export class PriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  coin: string;

  @Column()
  currency: string;

  @Column()
  price: string;

  @Column()
  date: Date;
}
