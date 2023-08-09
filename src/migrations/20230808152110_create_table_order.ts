import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('order', table => {
        table.increments('id').primary()
        table.integer('user_id').references('id').inTable('users').unsigned()
        table.integer('total').notNullable()
        // table.integer('payment_id').references('id').inTable('payment')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('order')
}

