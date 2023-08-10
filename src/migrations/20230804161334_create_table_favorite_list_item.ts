import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('favorite_list_item', table => {
        table.increments('id').primary()
        table.integer('product_id').references('id').inTable('product').unsigned()
        table.integer('position').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('favorite_list_item')
}

