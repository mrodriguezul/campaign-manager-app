import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation, UpdateDateColumn } from "typeorm";
import { CallLog } from "./call-log.entity.js";

@Entity({
    name: 'leads'
})
export class Lead{
    @PrimaryGeneratedColumn({name: 'lead_id'})
    id: number;

    @Column({ type: 'varchar', length: 70 })
    name: string;

    @Column({ type: 'varchar', length: 15, unique: true })
    phone: string;

    @Column({ type: 'varchar', length: 250 })
    context: string;
    
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => CallLog, (callLog) => callLog.lead, {nullable: true, cascade: true})
    callLogs: Relation<CallLog[]>;
}