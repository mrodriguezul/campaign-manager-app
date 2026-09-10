import { IsEmail, isEmail } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'agents' })
export class Agent {
    @PrimaryGeneratedColumn({name: 'agent_id'})
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30})
    @IsEmail()
    email: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}
