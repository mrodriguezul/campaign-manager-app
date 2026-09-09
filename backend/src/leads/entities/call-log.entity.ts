import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Lead } from "./lead.entity.js";

@Entity({
    name: 'call_logs'
})
export class CallLog{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 20, nullable: false})
    status: string;

    @Column({type: 'varchar', length: 50, nullable: true})
    notes: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    lead: Lead
}