import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { EventStatusEnum } from 'src/Shared/Enums/EventStatus.enum';

@Entity()
export class ScheduledEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp with time zone' })
  executeAt: Date;

  @Column({ default: EventStatusEnum.PENDING })
  status: EventStatusEnum;

  @Column({ type: 'timestamp with time zone', nullable: true })
  executedAt: Date | null;

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @Column()
  userId: string;
}