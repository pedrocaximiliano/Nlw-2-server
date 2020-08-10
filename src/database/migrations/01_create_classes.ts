import Knex from 'Knex';

export async function up(Knex: Knex) {
  return Knex.schema.createTable('classes', table => {
         table.increments('id').primary();
         table.string('subject').notNullable();
         table.decimal('cost').notNullable();

         table.integer('user_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE') // deleta todas as aulas do professor, as aulas somem juntos o CASCADE faz isso automatico
         .onUpdate('CASCADE'); // faz um update todas as aulas do professor

  })
}

export async function down(knex: Knex) {
   return knex.schema.dropTable('classes')
} 