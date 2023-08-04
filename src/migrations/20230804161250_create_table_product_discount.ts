import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('product_discount', table => {
        table.increments('id').primary()
        table.integer('discount_percentage').notNullable()
        table.integer('product_id').references('id').inTable('product').unsigned()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('product_discount')
}

