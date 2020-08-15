import Knex from 'Knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('connections', table => {
         table.increments('id').primary();

         table.integer('user_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE') // deleta todas as aulas do professor, as aulas somem juntos o CASCADE faz isso automatico
         .onUpdate('CASCADE'); // faz um update todas as aulas do professor

         table.timestamp('created_at')
         .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
         .notNullable()
  })
}

export async function down(knex: Knex) {
   return knex.schema.dropTable('connections')
} 