import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('discount', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('description').nullable()
        table.boolean('active').notNullable()
        table.string('start_at').notNullable()
        table.string('end_at').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('discount')
}
