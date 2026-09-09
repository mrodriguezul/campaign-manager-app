import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'leads'
})
export class Lead{
    @PrimaryGeneratedColumn()
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
}