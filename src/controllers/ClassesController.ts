import { Request, Response } from 'express';
import convertoHourToMinutes from "../util/convertHourToMinutes";

import db from "../database/connection";

interface scheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {

    async index(request: Request, response: Response) {
        const filters = request.query;
        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!filters.subject || !filters.week_day || !filters.time) {
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertoHourToMinutes(time);

        const classes = await db('classes')

       //subquery para filtar os horarios e dias disponiveis para marcar aula
            .whereExists(function () {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id`= `classes`.`id`') //buscando nas tabela de class_schedule as class_id que é igual ao id da class
                    .whereRaw('`class_schedule`. `week_day` = ??', [Number(week_day)]) //buscando nas tabela de class_schedule os dias da semana que forem igual ao que eu passei no request
                    .whereRaw('`class_schedule`. `from` <= ??', [Number(timeInMinutes)]) //buscando nas tabela de class_schedule a data de inicio quando for menor igual ao que eu passei no request
                    .whereRaw('`class_schedule`. `to` > ??', [Number(timeInMinutes)]) //buscando nas tabela de class_schedule a data de inicio quando for maior ao que eu passei no request
            })

            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);


        return response.json(classes);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;

        const trx = await db.transaction();

        try {
            const insertedUsersId = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });

            //quero somente o primeiro ID pois estou adicionando apenas 1 usuário por vez
            const user_id = insertedUsersId[0];

            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id
            });

            const class_id = insertedClassesIds[0];

            const classSchedule = schedule.map((scheduleItem: scheduleItem) => {

                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertoHourToMinutes(scheduleItem.from),
                    to: convertoHourToMinutes(scheduleItem.to),
                };
            })

            await trx('class_schedule').insert(classSchedule);

            await trx.commit();
            return response.status(200).send();

        } catch (error) {

            await trx.rollback();

            return response.status(400).json({
                error: 'unexpected error while creating new class'
            });
        }
    }
}