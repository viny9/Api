import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('image', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('key').notNullable()
        table.string('url').notNullable()
        table.integer('size').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('image')
}

