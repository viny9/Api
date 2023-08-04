import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('product', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.float('price').notNullable()
        table.string('img').notNullable() // Mudar tipo depois
        // table.integer('category_id').references('id').inTable('product_category').unsigned()
        // table.integer('discount_id').references('id').inTable('product_discount').unsigned()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('product')
}

