import Knex from 'Knex';

export async function up(Knex: Knex) {
  return Knex.schema.createTable('users', table => {
         table.increments('id').primary();
         table.string('name').notNullable();
         table.string('avatar').notNullable();
         table.string('whatsapp').notNullable();
         table.string('bio').notNullable();
  })
}

export async function down(knex: Knex) {
   return knex.schema.dropTable('users')
} 