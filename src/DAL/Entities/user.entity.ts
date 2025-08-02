import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ScheduledEvent } from './event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => ScheduledEvent, (event) => event.user)
  events: ScheduledEvent[];
}