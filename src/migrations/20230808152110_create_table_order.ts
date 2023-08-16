import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('order', table => {
        table.increments('id').primary()
        table.integer('user_id').references('id').inTable('users').unsigned()
        table.integer('total').notNullable()
        table.string('status').notNullable()
        table.string('payment_method').notNullable()
        table.string('payment_id').nullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('order')
}

