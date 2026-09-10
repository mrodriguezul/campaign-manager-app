import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Lead } from "./lead.entity.js";
import { Agent } from "../../agents/entities/agent.entity.js";

@Entity({
    name: 'call_logs'
})
export class CallLog{
    @PrimaryGeneratedColumn({name: 'call_logs_id'})
    id: number;

    @Column({type: 'varchar', length: 20, nullable: false})
    status: string;

    @Column({type: 'varchar', length: 50, nullable: true})
    notes: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Lead, (lead) => lead.callLogs, {nullable: false, onDelete: 'CASCADE'}) 
    @JoinColumn({ name: 'lead_id'}) 
    lead: Relation<Lead>

    @ManyToOne(() => Agent, (agent) => agent.callLogs, {nullable: false})
    @JoinColumn({ name: 'agent_id'})
    agent: Relation<Agent>
}