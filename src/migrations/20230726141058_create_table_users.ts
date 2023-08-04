import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', table => {
        // Adicionar o endereço
        // Talvez criar um table só para endereços
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('telephone').notNullable()
        table.string('password').notNullable()
        table.boolean('admin').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users')
}

