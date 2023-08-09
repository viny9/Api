import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('order_item', table => {
        table.increments('id').primary()
        table.integer('product_id').references('id').inTable('product').unsigned()
        table.integer('order_id').references('id').inTable('order').unsigned()
        table.integer('quantity').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('order_item')
}

