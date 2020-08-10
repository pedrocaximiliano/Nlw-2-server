import Knex from 'Knex';

export async function up(Knex: Knex) {
  return Knex.schema.createTable('class_schedule', table => {
         table.increments('id').primary();

         table.integer('week_day').notNullable();
         table.integer('from').notNullable();
         table.integer('to').notNullable();

         table.integer('class_id')
         .notNullable()
         .references('id')
         .inTable('classes')
         .onDelete('CASCADE') // deleta todas as aulas do professor, as aulas somem juntos o CASCADE faz isso automatico
         .onUpdate('CASCADE'); // faz um update todas as aulas do professor

  })
}

export async function down(knex: Knex) {
   return knex.schema.dropTable('class_schedule')
} 