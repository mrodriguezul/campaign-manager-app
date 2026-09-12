import * as bcrypt from 'bcrypt';
import { IsEmail } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation, UpdateDateColumn } from "typeorm";
import { CallLog } from "../../leads/entities/call-log.entity.js";
import { Exclude } from 'class-transformer';

@Entity({ name: 'agents' })
export class Agent {
    @PrimaryGeneratedColumn({name: 'agent_id'})
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30})
    @IsEmail()
    email: string;

    @Exclude()
    @Column({ type: 'varchar', length: 255 })
    password: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => CallLog, (callLog) => callLog.agent)
    callLogs: Relation<CallLog[]>

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10);
    }
}
