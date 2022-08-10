import {Column, CreateDateColumn, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export default class Deposit {
    @PrimaryColumn({
        type: 'varchar'
    })
    public id: string | null = null

    @Column({
        name: 'session_id',
        type: 'varchar'
    })
    public sessionId: string | null = null

    @Column({
        name: 'tx_hash',
        type: 'varchar',
        nullable: true
    })
    public txHash: string | null = null

    @Column({
        name: 'revpop_account',
        type: 'varchar',
        nullable: true
    })
    public revpopAccount: string | null = null

    @Column({
        type: 'integer',
    })
    public status: number | null = null

    @CreateDateColumn({
        name: 'created_at'
    })
    public createdAt: Date | undefined
}