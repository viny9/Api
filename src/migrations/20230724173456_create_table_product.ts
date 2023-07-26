import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.float('price').notNullable()
        table.string('img').notNullable()
        table.string('category').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('products')
}

